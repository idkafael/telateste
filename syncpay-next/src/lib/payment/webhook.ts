import crypto from "crypto";
import { env } from "@/lib/config";
import { prisma } from "@/db/prisma";
import { logger } from "@/lib/logger";
import { mapSyncPayStatus } from "@/lib/payment/status";
import { releaseDeliverableForTransaction } from "@/lib/payment/deliverable";
import { syncPayWebhookPayloadSchema, type SyncPayWebhookPayload } from "@/lib/syncpay/types";

function sha256(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function constantTimeEquals(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

function getIdentifier(payload: SyncPayWebhookPayload): string | null {
  return payload.identifier ?? payload.data?.identifier ?? null;
}

function getExternalStatus(payload: SyncPayWebhookPayload): string | undefined {
  return payload.status ?? payload.data?.status;
}

export async function handleSyncPayWebhook(params: {
  rawBody: string;
  headers: Record<string, string | undefined>;
}): Promise<{ ok: true }> {
  // 1) Autorização por Bearer (se aplicável)
  const auth = params.headers["authorization"];
  if (env.SYNCPAY_WEBHOOK_TOKEN) {
    const expected = `Bearer ${env.SYNCPAY_WEBHOOK_TOKEN}`;
    if (!auth || !constantTimeEquals(auth, expected)) {
      logger.warn("SyncPay webhook unauthorized", { authPresent: Boolean(auth) });
      return { ok: true }; // responder rápido e não dar pista
    }
  }

  // 2) (Opcional) assinatura HMAC - desconhecida
  // TODO: CONFIRM WITH SYNCPAY DOC - if there is a signature header.
  // const signature = params.headers["x-syncpay-signature"];
  // if (env.SYNCPAY_WEBHOOK_SIGNATURE_SECRET && signature) { ... }

  const parsedJson = JSON.parse(params.rawBody);
  const payload = syncPayWebhookPayloadSchema.parse(parsedJson);

  const identifier = getIdentifier(payload);
  if (!identifier) {
    logger.warn("SyncPay webhook missing identifier");
    return { ok: true };
  }

  const event = params.headers["event"] ?? payload.event ?? "unknown";
  const externalStatus = getExternalStatus(payload) ?? "unknown";
  const mapped = mapSyncPayStatus(externalStatus);

  // 3) Idempotência por eventKey (provider+identifier+event+statusHash)
  const eventHash = sha256(`${identifier}|${event}|${externalStatus}|${params.rawBody}`);
  const eventKey = `${identifier}:${event}:${mapped}`;

  const tx = await prisma.transaction.findUnique({ where: { identifier } });
  if (!tx) {
    logger.warn("SyncPay webhook for unknown transaction", { identifier });
    return { ok: true };
  }

  try {
    await prisma.processedEvent.create({
      data: {
        provider: "syncpay",
        transactionId: tx.id,
        eventKey,
        eventHash,
      },
    });
  } catch {
    logger.info("Duplicate webhook ignored", { identifier, eventKey });
    return { ok: true };
  }

  await prisma.transaction.update({
    where: { identifier },
    data: { status: mapped },
  });

  if (mapped === "paid") {
    await releaseDeliverableForTransaction(tx.id);
  }

  logger.info("Webhook processed", { identifier, event, mapped });
  return { ok: true };
}


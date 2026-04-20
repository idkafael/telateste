import { prisma } from "@/db/prisma";
import type { CreatePaymentInput, CreatePaymentOutput, PaymentStatusOutput } from "@/types/payment";
import { env } from "@/lib/config";
import { createPixCharge, getCashInByIdentifier } from "@/lib/syncpay/cashin";
import { mapSyncPayStatus } from "@/lib/payment/status";
import { releaseDeliverableForTransaction } from "@/lib/payment/deliverable";

export async function createPayment(input: CreatePaymentInput): Promise<CreatePaymentOutput> {
  const webhookUrl = `${env.APP_BASE_URL.replace(/\/$/, "")}/api/webhooks/syncpay`;

  const created = await createPixCharge({
    amountCents: input.amountCents,
    description: input.description,
    recode: input.recode,
    webhookUrl,
    customer: input.customer,
  });

  const initialStatus = mapSyncPayStatus((created as { status?: string }).status);

  await prisma.transaction.create({
    data: {
      provider: env.SYNCPAY_MOCK ? "syncpay_mock" : "syncpay",
      identifier: created.identifier,
      amountCents: input.amountCents,
      description: input.description,
      recode: input.recode,
      customerName: input.customer.name,
      customerEmail: input.customer.email,
      customerDoc: input.customer.document,
      status: initialStatus,
      pixCode: created.pix_code,
      qrCodeBase64: (created as { qr_code_base64?: string }).qr_code_base64,
    },
  });

  return {
    identifier: created.identifier,
    status: initialStatus,
    pixCode: created.pix_code,
    qrCodeBase64: (created as { qr_code_base64?: string }).qr_code_base64,
  };
}

export async function getTransactionByIdentifier(identifier: string) {
  return prisma.transaction.findUnique({ where: { identifier } });
}

export async function refreshTransactionFromProvider(identifier: string) {
  const tx = await prisma.transaction.findUnique({ where: { identifier } });
  if (!tx) return null;

  const providerTx = await getCashInByIdentifier(identifier);
  const mapped = mapSyncPayStatus(providerTx.status);

  const updated = await prisma.transaction.update({
    where: { identifier },
    data: {
      status: mapped,
      pixCode: providerTx.pix_code ?? tx.pixCode ?? undefined,
      qrCodeBase64: providerTx.qr_code_base64 ?? tx.qrCodeBase64 ?? undefined,
    },
  });

  if (updated.status === "paid") {
    await releaseDeliverableForTransaction(updated.id);
  }

  return updated;
}

export async function buildStatusResponse(identifier: string): Promise<PaymentStatusOutput> {
  const tx = await prisma.transaction.findUnique({
    where: { identifier },
    include: { deliveries: { orderBy: { createdAt: "asc" }, take: 1 } },
  });
  if (!tx) {
    throw new Error("Transaction not found");
  }

  const deliveryRow = tx.deliveries[0];

  return {
    identifier: tx.identifier,
    status: tx.status,
    amountCents: tx.amountCents,
    delivery: deliveryRow
      ? { type: deliveryRow.type as any, content: deliveryRow.content }
      : undefined,
    updatedAt: tx.updatedAt.toISOString(),
  };
}


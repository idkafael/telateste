import { randomUUID } from "crypto";
import { env } from "@/lib/config";
import { prisma } from "@/db/prisma";
import { getValidSyncPayToken } from "./token";
import { syncPayFetch } from "./http";
import {
  syncPayCreateCashInBodySchema,
  syncPayGetTransactionResponseSchema,
  type SyncPayCreateCashInResponse,
  type SyncPayGetCashInResponse,
} from "./types";

function onlyDigits(v: string) {
  return v.replace(/\D/g, "");
}

function buildClientPayload(customer: {
  name: string;
  email: string;
  document?: string;
  phone?: string;
}) {
  const cpf =
    onlyDigits(customer.document ?? "") ||
    (env.SYNCPAY_DEFAULT_CLIENT_CPF ? onlyDigits(env.SYNCPAY_DEFAULT_CLIENT_CPF) : "");
  const phone =
    onlyDigits(customer.phone ?? "") ||
    (env.SYNCPAY_DEFAULT_CLIENT_PHONE ? onlyDigits(env.SYNCPAY_DEFAULT_CLIENT_PHONE) : "");

  if (cpf.length !== 11) {
    throw new Error(
      "CPF obrigatório (11 dígitos): envie customer.document ou SYNCPAY_DEFAULT_CLIENT_CPF no .env (apenas testes).",
    );
  }
  if (phone.length < 10 || phone.length > 11) {
    throw new Error(
      "Telefone obrigatório (10–11 dígitos): envie customer.phone ou SYNCPAY_DEFAULT_CLIENT_PHONE no .env (apenas testes).",
    );
  }

  return { name: customer.name, email: customer.email, cpf, phone };
}

function parseCashInResponse(json: unknown): SyncPayCreateCashInResponse {
  const body = syncPayCreateCashInBodySchema.parse(json);
  const pix = body.pix_code?.trim();
  const id = body.identifier?.trim();
  if (pix && id) {
    return { message: body.message, pix_code: pix, identifier: id };
  }
  const errDetail = body.errors ? ` ${JSON.stringify(body.errors)}` : "";
  throw new Error(
    (body.message ? `${body.message}${errDetail}` : null) ||
      `Resposta cash-in sem pix_code/identifier: ${JSON.stringify(json)}`,
  );
}

export async function createPixCharge(input: {
  amountCents: number;
  description?: string;
  recode?: string;
  webhookUrl: string;
  customer: { name: string; email: string; document?: string; phone?: string };
}): Promise<SyncPayCreateCashInResponse> {
  if (env.SYNCPAY_MOCK) {
    const identifier = `mock_${randomUUID().replace(/-/g, "").slice(0, 20)}`;
    return {
      identifier,
      pix_code:
        "00020126580014br.gov.bcb.pix0136MOCK-LOCALHOST-PIX-CODE-USE-WEBHOOK-TO-CONFIRM5204000053039865802BR5925SYNC PAY MOCK6009SAO PAULO62070503***6304ABCD",
      message: "mock",
    };
  }

  const token = await getValidSyncPayToken();
  const amountReais = Math.round(input.amountCents) / 100;

  const body: Record<string, unknown> = {
    amount: amountReais,
    webhook_url: input.webhookUrl,
    client: buildClientPayload(input.customer),
  };
  const descParts = [input.description, input.recode].filter(Boolean);
  if (descParts.length) body.description = descParts.join(" — ");

  const res = await syncPayFetch("/api/partner/v1/cash-in", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  const json = await res.json();
  return parseCashInResponse(json);
}

export async function getCashInByIdentifier(identifier: string): Promise<SyncPayGetCashInResponse> {
  if (env.SYNCPAY_MOCK) {
    const tx = await prisma.transaction.findUnique({ where: { identifier } });
    if (!tx) {
      return { identifier, status: "not_found" };
    }
    const ext =
      tx.status === "paid"
        ? "paid"
        : tx.status === "failed"
          ? "failed"
          : tx.status === "cancelled"
            ? "cancelled"
            : tx.status === "processing"
              ? "processing"
              : "pending";
    return {
      identifier,
      status: ext,
      pix_code: tx.pixCode ?? undefined,
      qr_code_base64: tx.qrCodeBase64 ?? undefined,
    };
  }

  const token = await getValidSyncPayToken();

  const res = await syncPayFetch(`/api/partner/v1/transaction/${encodeURIComponent(identifier)}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    retries: 1,
  });

  const json = await res.json();
  const parsed = syncPayGetTransactionResponseSchema.parse(json);
  const d = parsed.data;
  return {
    identifier: d.reference_id || identifier,
    status: d.status,
    pix_code: d.pix_code ?? undefined,
  };
}

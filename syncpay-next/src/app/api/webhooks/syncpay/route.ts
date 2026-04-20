import { NextResponse } from "next/server";
import { handleSyncPayWebhook } from "@/lib/payment/webhook";

export async function POST(req: Request) {
  // Responder rápido: parse mínimo e processar de forma idempotente.
  const rawBody = await req.text();
  const headers: Record<string, string | undefined> = {
    authorization: req.headers.get("authorization") ?? undefined,
    event: req.headers.get("event") ?? undefined,
    "x-syncpay-signature": req.headers.get("x-syncpay-signature") ?? undefined, // TODO: CONFIRM WITH SYNCPAY DOC
  };

  try {
    await handleSyncPayWebhook({ rawBody, headers });
  } catch {
    // Sempre 200 para não gerar retries agressivos sem necessidade.
  }

  return NextResponse.json({ ok: true });
}


import { NextResponse } from "next/server";
import { z } from "zod";
import { buildStatusResponse, refreshTransactionFromProvider } from "@/lib/payment/transactions";
import { corsHeaders, withCors } from "@/lib/cors";

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const identifier = z.string().min(1).parse(searchParams.get("identifier"));

    // Fallback: consulta no provider se ainda não estiver paid/cancelled/failed.
    // Para reduzir chamadas, só fazemos refresh quando status ainda não é final.
    const refreshed = await refreshTransactionFromProvider(identifier).catch(() => null);
    if (refreshed && ["paid", "failed", "cancelled"].includes(refreshed.status)) {
      const payload = await buildStatusResponse(identifier);
      return withCors(NextResponse.json(payload));
    }

    const payload = await buildStatusResponse(identifier);
    return withCors(NextResponse.json(payload));
  } catch (err) {
    return withCors(
      NextResponse.json(
        { error: err instanceof Error ? err.message : "Unknown error" },
        { status: 400 },
      ),
    );
  }
}


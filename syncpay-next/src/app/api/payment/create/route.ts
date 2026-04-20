import { NextResponse } from "next/server";
import { z } from "zod";
import { createPayment } from "@/lib/payment/transactions";
import { corsHeaders, withCors } from "@/lib/cors";

const createSchema = z.object({
  amountCents: z.number().int().positive(),
  description: z.string().min(1).optional(),
  recode: z.string().min(1).optional(),
  customer: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    document: z.string().min(1).optional(),
    phone: z.string().min(1).optional(),
  }),
});

export async function OPTIONS(req: Request) {
  return new Response(null, { status: 204, headers: corsHeaders(req) });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = createSchema.parse(body);
    const out = await createPayment(input);
    return withCors(NextResponse.json(out), req);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return withCors(
        NextResponse.json(
          { error: "Payload inválido", details: err.flatten().fieldErrors },
          { status: 400 },
        ),
        req,
      );
    }
    return withCors(
      NextResponse.json(
        { error: err instanceof Error ? err.message : "Unknown error" },
        { status: 400 },
      ),
      req,
    );
  }
}


import { env } from "@/lib/config";

function normalizeOrigin(o: string) {
  return o.trim().replace(/\/$/, "");
}

/** Uma ou mais origens em FRONTEND_ORIGIN, separadas por vírgula. */
function allowedOrigins(): string[] {
  return env.FRONTEND_ORIGIN.split(",")
    .map((s) => normalizeOrigin(s))
    .filter(Boolean);
}

/**
 * CORS para o browser. Se `Origin` da requisição estiver na lista permitida,
 * devolve esse valor (obrigatório para credenciais / preflight).
 */
export function corsHeaders(req?: Request | null): HeadersInit {
  const list = allowedOrigins();
  const raw = req?.headers.get("Origin");
  const normalized = raw ? normalizeOrigin(raw) : "";
  const origin: string =
    normalized && raw && list.includes(normalized) ? raw : (list[0] ?? "*");

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  };
}

export function withCors(res: Response, req?: Request | null): Response {
  const headers = new Headers(res.headers);
  const c = corsHeaders(req);
  Object.entries(c).forEach(([k, v]) => headers.set(k, v));
  return new Response(res.body, { status: res.status, headers });
}

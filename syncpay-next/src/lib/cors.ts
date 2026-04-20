import { env } from "@/lib/config";

export function corsHeaders(): HeadersInit {
  const origin = env.FRONTEND_ORIGIN;
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  };
}

export function withCors(res: Response): Response {
  const headers = new Headers(res.headers);
  const c = corsHeaders();
  Object.entries(c).forEach(([k, v]) => headers.set(k, v));
  return new Response(res.body, { status: res.status, headers });
}

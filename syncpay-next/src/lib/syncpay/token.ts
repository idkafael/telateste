import { env } from "@/lib/config";
import { logger } from "@/lib/logger";
import { syncPayFetch } from "./http";
import { SyncPayAuthResponse, syncPayAuthResponseSchema } from "./types";

type CachedToken = { token: string; expiresAtMs: number };

let cached: CachedToken | null = null;

function nowMs() {
  return Date.now();
}

export async function getValidSyncPayToken(): Promise<string> {
  if (env.SYNCPAY_MOCK) return "mock-access-token";

  // 60s de margem para evitar corrida perto da expiração
  if (cached && cached.expiresAtMs - nowMs() > 60_000) return cached.token;

  const auth = await authenticateSyncPay();
  const ttlSec = auth.expires_in ?? 3600;
  cached = {
    token: auth.access_token,
    expiresAtMs: nowMs() + ttlSec * 1000,
  };
  return cached.token;
}

async function authenticateSyncPay(): Promise<SyncPayAuthResponse> {
  const res = await syncPayFetch("/api/partner/v1/auth-token", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      client_id: env.SYNCPAY_CLIENT_ID,
      client_secret: env.SYNCPAY_CLIENT_SECRET,
    }),
    retries: 1,
  });

  const json = await res.json();
  const parsed = syncPayAuthResponseSchema.parse(json);
  logger.info("SyncPay token obtido", { expires_in: parsed.expires_in, expires_at: parsed.expires_at });
  return parsed;
}

export function _dangerousResetTokenCacheForTests() {
  cached = null;
}


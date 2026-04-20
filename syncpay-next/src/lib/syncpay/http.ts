import { env } from "@/lib/config";
import { logger } from "@/lib/logger";

export class SyncPayHttpError extends Error {
  constructor(
    message: string,
    public status: number,
    public bodyText?: string,
  ) {
    super(message);
    this.name = "SyncPayHttpError";
  }
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function withTimeout(signal: AbortSignal | null | undefined, ms: number) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  if (signal) {
    if (signal.aborted) ctrl.abort();
    else signal.addEventListener("abort", () => ctrl.abort(), { once: true });
  }
  return { signal: ctrl.signal, clear: () => clearTimeout(t) };
}

export async function syncPayFetch(
  path: string,
  init: RequestInit & { timeoutMs?: number; retries?: number } = {},
) {
  const timeoutMs = init.timeoutMs ?? 12_000;
  const retries = init.retries ?? 2;

  const url = `${env.SYNCPAY_BASE_URL.replace(/\/$/, "")}${path.startsWith("/") ? "" : "/"}${path}`;

  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    const { signal, clear } = withTimeout(init.signal, timeoutMs);
    try {
      const res = await fetch(url, { ...init, signal });
      if (!res.ok) {
        const text = await res.text().catch(() => undefined);
        let detail = "";
        if (text) {
          try {
            const j = JSON.parse(text) as { message?: string; errors?: unknown };
            if (j?.message) {
              detail = `: ${j.message}${j.errors != null ? ` ${JSON.stringify(j.errors)}` : ""}`;
            }
          } catch {
            detail = text.length < 400 ? `: ${text}` : "";
          }
        }
        throw new SyncPayHttpError(`SyncPay HTTP ${res.status}${detail}`, res.status, text);
      }
      return res;
    } catch (err) {
      lastErr = err;
      const retryable =
        err instanceof SyncPayHttpError
          ? [408, 409, 425, 429, 500, 502, 503, 504].includes(err.status)
          : true;

      if (attempt < retries && retryable) {
        const backoff = 250 * Math.pow(2, attempt);
        logger.warn("SyncPay request failed, retrying", { attempt, backoff, err });
        await sleep(backoff);
        continue;
      }
      throw err;
    } finally {
      clear();
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error("Unknown SyncPay error");
}


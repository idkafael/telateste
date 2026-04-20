import type { TransactionStatus } from "@/types/payment";

// TODO: CONFIRM WITH SYNCPAY DOC - external status values.
export function mapSyncPayStatus(external: string | undefined): TransactionStatus {
  const s = (external ?? "").toLowerCase();

  if (["paid", "approved", "completed", "concluded", "success"].includes(s)) return "paid";
  if (["pending", "waiting", "created"].includes(s)) return "pending";
  if (["processing", "analyzing", "in_progress", "med"].includes(s)) return "processing";
  if (["failed", "refused", "error", "not_found"].includes(s)) return "failed";
  if (["cancelled", "canceled", "expired", "refunded"].includes(s)) return "cancelled";

  return "pending";
}


import { z } from "zod";

// Documentação partner v1: https://syncpay.apidog.io/

/** POST /api/partner/v1/auth-token */
export const syncPayAuthResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.string().optional(),
  expires_in: z.number().int().positive().optional(),
  expires_at: z.string().optional(),
});
export type SyncPayAuthResponse = z.infer<typeof syncPayAuthResponseSchema>;

/** POST /api/partner/v1/cash-in — corpo 200 (a API pode devolver 200 com message de erro sem pix) */
export const syncPayCreateCashInBodySchema = z
  .object({
    message: z.string().optional(),
    pix_code: z.string().optional(),
    identifier: z.string().optional(),
    errors: z.record(z.string(), z.array(z.string())).optional(),
  })
  .passthrough();
export type SyncPayCreateCashInResponse = {
  message?: string;
  pix_code: string;
  identifier: string;
};

/** GET /api/partner/v1/transaction/{identifier} */
export const syncPayTransactionDataSchema = z.object({
  reference_id: z.string().optional(),
  status: z.string(),
  pix_code: z.string().nullable().optional(),
  amount: z.number().optional(),
  description: z.string().nullable().optional(),
});

export const syncPayGetTransactionResponseSchema = z.object({
  data: syncPayTransactionDataSchema,
});
export type SyncPayGetTransactionResponse = z.infer<typeof syncPayGetTransactionResponseSchema>;

/** Formato normalizado internamente (cash-in + consulta) */
export type SyncPayGetCashInResponse = {
  identifier: string;
  status: string;
  pix_code?: string;
  qr_code_base64?: string;
};

export const syncPayWebhookHeadersSchema = z.object({
  authorization: z.string().optional(),
  event: z.string().optional(),
});

export const syncPayWebhookPayloadSchema = z
  .object({
    identifier: z.string().optional(),
    data: z
      .object({
        identifier: z.string().optional(),
        status: z.string().optional(),
      })
      .optional(),
    status: z.string().optional(),
    event: z.string().optional(),
  })
  .passthrough();

export type SyncPayWebhookPayload = z.infer<typeof syncPayWebhookPayloadSchema>;

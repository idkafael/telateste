import { z } from "zod";

const boolish = z
  .string()
  .optional()
  .transform((v) => v === "1" || v?.toLowerCase() === "true");

const envSchema = z
  .object({
    DATABASE_URL: z.string().min(1),

    APP_BASE_URL: z.string().url(),
    LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),

    /** Uma ou mais origens (site estático), separadas por vírgula — para CORS */
    FRONTEND_ORIGIN: z.string().min(1).default("http://127.0.0.1:5500"),

    SYNCPAY_MOCK: boolish,

    SYNCPAY_BASE_URL: z.string().url().optional(),
    SYNCPAY_CLIENT_ID: z.string().optional(),
    SYNCPAY_CLIENT_SECRET: z.string().optional(),

    /** Fallback só para dev/teste — produção: dados reais do comprador no POST */
    SYNCPAY_DEFAULT_CLIENT_CPF: z.string().optional(),
    SYNCPAY_DEFAULT_CLIENT_PHONE: z.string().optional(),

    SYNCPAY_WEBHOOK_TOKEN: z.string().min(1).optional(),
    SYNCPAY_WEBHOOK_SIGNATURE_SECRET: z.string().min(1).optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.SYNCPAY_MOCK) {
      if (!data.SYNCPAY_BASE_URL) {
        ctx.addIssue({ code: "custom", message: "SYNCPAY_BASE_URL obrigatório quando SYNCPAY_MOCK não está ativo" });
      }
      if (!data.SYNCPAY_CLIENT_ID) {
        ctx.addIssue({ code: "custom", message: "SYNCPAY_CLIENT_ID obrigatório quando SYNCPAY_MOCK não está ativo" });
      }
      if (!data.SYNCPAY_CLIENT_SECRET) {
        ctx.addIssue({ code: "custom", message: "SYNCPAY_CLIENT_SECRET obrigatório quando SYNCPAY_MOCK não está ativo" });
      }
    }
  })
  .transform((data) => ({
    ...data,
    // Satisfaz TypeScript em client HTTP; em SYNCPAY_MOCK as chamadas externas não são usadas.
    SYNCPAY_BASE_URL: data.SYNCPAY_BASE_URL ?? "http://localhost",
    SYNCPAY_CLIENT_ID: data.SYNCPAY_CLIENT_ID ?? "",
    SYNCPAY_CLIENT_SECRET: data.SYNCPAY_CLIENT_SECRET ?? "",
    SYNCPAY_DEFAULT_CLIENT_CPF: data.SYNCPAY_DEFAULT_CLIENT_CPF,
    SYNCPAY_DEFAULT_CLIENT_PHONE: data.SYNCPAY_DEFAULT_CLIENT_PHONE,
  }));

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  APP_BASE_URL: process.env.APP_BASE_URL,
  LOG_LEVEL: process.env.LOG_LEVEL ?? "info",
  FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN,
  SYNCPAY_MOCK: process.env.SYNCPAY_MOCK,
  SYNCPAY_BASE_URL: process.env.SYNCPAY_BASE_URL,
  SYNCPAY_CLIENT_ID: process.env.SYNCPAY_CLIENT_ID,
  SYNCPAY_CLIENT_SECRET: process.env.SYNCPAY_CLIENT_SECRET,
  SYNCPAY_DEFAULT_CLIENT_CPF: process.env.SYNCPAY_DEFAULT_CLIENT_CPF,
  SYNCPAY_DEFAULT_CLIENT_PHONE: process.env.SYNCPAY_DEFAULT_CLIENT_PHONE,
  SYNCPAY_WEBHOOK_TOKEN: process.env.SYNCPAY_WEBHOOK_TOKEN,
  SYNCPAY_WEBHOOK_SIGNATURE_SECRET: process.env.SYNCPAY_WEBHOOK_SIGNATURE_SECRET,
});


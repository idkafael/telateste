export type Provider = "syncpay";

export type TransactionStatus = "pending" | "processing" | "paid" | "failed" | "cancelled";

export type DeliveryType = "link" | "code" | "file" | "message";

export type Delivery = {
  type: DeliveryType;
  content: string;
};

export type CreatePaymentInput = {
  amountCents: number;
  description?: string;
  recode?: string;
  customer: {
    name: string;
    email: string;
    document?: string;
    phone?: string;
  };
};

export type CreatePaymentOutput = {
  identifier: string;
  status: TransactionStatus;
  pixCode: string;
  qrCodeBase64?: string;
};

export type PaymentStatusOutput = {
  identifier: string;
  status: TransactionStatus;
  amountCents: number;
  delivery?: Delivery;
  updatedAt: string;
};


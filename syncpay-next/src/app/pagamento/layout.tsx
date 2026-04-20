import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pagamento PIX",
  description: "Checkout PIX via SyncPay",
};

export default function PagamentoLayout({ children }: { children: React.ReactNode }) {
  return children;
}

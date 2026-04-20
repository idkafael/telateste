"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import PaymentModal from "@/components/PaymentModal";

const PLANOS: Record<string, { id: string; name: string; price: number }> = {
  Mensal: { id: "plano-mensal", name: "Assinatura mensal (31 dias)", price: 19.9 },
  Trimestral: { id: "plano-trimestral", name: "Assinatura trimestral (3 meses)", price: 50.0 },
  Anual: { id: "plano-anual", name: "Assinatura anual (12 meses)", price: 99.9 },
};

function PagamentoInner() {
  const searchParams = useSearchParams();
  const planoKey = searchParams.get("plano") || "Mensal";
  const produto = useMemo(() => PLANOS[planoKey] ?? PLANOS.Mensal, [planoKey]);

  const entregavel = process.env.NEXT_PUBLIC_ENTREGAVEL_URL;

  const product = useMemo(
    () => ({
      id: produto.id,
      name: produto.name,
      entregavel: entregavel || undefined,
    }),
    [produto.id, produto.name, entregavel],
  );

  const [open, setOpen] = useState(true);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-start pt-8 px-4">
      <Link href="/index.html" className="mb-6 text-sm text-zinc-400 hover:text-white underline">
        Voltar ao perfil
      </Link>
      <PaymentModal
        isOpen={open}
        onClose={() => {
          setOpen(false);
          window.location.href = "/index.html";
        }}
        product={product}
        price={produto.price}
        onPaymentConfirmed={() => {}}
      />
    </div>
  );
}

export default function PagamentoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">Carregando…</div>
      }
    >
      <PagamentoInner />
    </Suspense>
  );
}

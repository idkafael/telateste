import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{ plano?: string }>;
};

/** Links antigos: mesma experiência do modal na home. */
export default async function PagamentoRedirect({ searchParams }: Props) {
  const sp = await searchParams;
  const p = sp.plano && ["Mensal", "Trimestral", "Anual"].includes(sp.plano) ? sp.plano : "Mensal";
  redirect(`/?plano=${encodeURIComponent(p)}`);
}

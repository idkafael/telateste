/**
 * Esta aplicação expõe apenas rotas de API para PIX (cash-in SynchPay).
 * O fluxo de pagamento na sua landing usa o modal + script.js chamando POST /api/payment/create.
 */
export default function Home() {
  return (
    <main
      style={{
        fontFamily: "system-ui, sans-serif",
        maxWidth: 640,
        margin: "48px auto",
        padding: 24,
        lineHeight: 1.6,
      }}
    >
      <h1 style={{ fontSize: "1.25rem" }}>Backend PIX (SynchPay)</h1>
      <p>
        Não há checkout nesta URL. O pagamento é feito via <strong>requisições HTTP</strong> para gerar cobrança
        PIX e consultar status.
      </p>
      <ul>
        <li>
          <code>POST /api/payment/create</code> — cria cash-in PIX (retorna <code>identifier</code>,{" "}
          <code>pixCode</code>)
        </li>
        <li>
          <code>GET /api/payment/status?identifier=...</code> — status e entregável após pago
        </li>
        <li>
          <code>POST /api/webhooks/syncpay</code> — webhook da SynchPay
        </li>
      </ul>
      <p style={{ opacity: 0.85 }}>
        Use a sua página estática (ex.: <code>index.html</code>) com o modal de pagamento; ela já consome essas
        rotas.
      </p>
    </main>
  );
}

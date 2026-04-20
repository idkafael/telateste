# Sistema de Pagamento PIX com SyncPay

Este é um sistema completo de pagamento PIX integrado com a API SyncPay, pronto para ser usado em projetos Next.js.

## 📁 Estrutura de Arquivos

```
syncpay/
├── app/
│   └── api/
│       └── syncpay/
│           ├── route.ts          # API route para criar e verificar pagamentos
│           └── webhook/
│               └── route.ts       # Webhook para receber notificações do SyncPay
├── components/
│   └── PaymentModal.tsx          # Componente React para modal de pagamento
├── lib/
│   └── syncpay.ts                # Funções de autenticação e integração SyncPay
├── types/
│   └── syncpay.ts                # Tipos TypeScript para SyncPay
└── README.md                      # Este arquivo
```

## 🚀 Como Usar

### 1. Instalação

Copie os arquivos para seu projeto Next.js mantendo a estrutura de diretórios:

```
seu-projeto/
├── app/
│   └── api/
│       └── syncpay/
├── components/
├── lib/
└── types/
```

### 2. Configuração de Variáveis de Ambiente

Adicione as seguintes variáveis no seu arquivo `.env.local`:

```env
# Credenciais SyncPay
SYNCPAY_CLIENT_ID=seu_client_id
SYNCPAY_CLIENT_SECRET=seu_client_secret
SYNCPAY_BASE_URL=https://api.syncpayments.com.br

# URL base da sua aplicação (para webhook)
NEXT_PUBLIC_APP_URL=https://seu-dominio.com

# Token de segurança do webhook (opcional, mas recomendado)
SYNCPAY_WEBHOOK_TOKEN=seu_token_secreto
```

### 3. Configuração do tsconfig.json

Certifique-se de que seu `tsconfig.json` tenha os paths configurados:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### 4. Uso do Componente PaymentModal

```tsx
import PaymentModal from "@/components/PaymentModal";

// Interface do seu produto
interface Product {
  id: string;
  name: string;
  entregavel?: string; // URL do entregável após pagamento
}

function MyComponent() {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  
  const product: Product = {
    id: "produto-1",
    name: "Meu Produto",
    entregavel: "https://exemplo.com/entregavel"
  };

  return (
    <>
      <button onClick={() => setIsPaymentOpen(true)}>
        Comprar
      </button>
      
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        product={product}
        price={49.90}
        onPaymentConfirmed={(productId) => {
          console.log(`Pagamento confirmado para: ${productId}`);
          // Sua lógica aqui
        }}
      />
    </>
  );
}
```

## 🔧 Funcionalidades

### ✅ Criação de PIX
- Gera código PIX automaticamente
- Gera QR Code para pagamento
- Valida valores mínimos

### ✅ Verificação de Pagamento
- Polling automático a cada 3 segundos
- Verifica status do pagamento
- Libera conteúdo automaticamente quando confirmado

### ✅ Webhook
- Recebe notificações do SyncPay
- Valida tokens de segurança
- Processa confirmações de pagamento

### ✅ LocalStorage
- Salva produtos comprados no localStorage
- Permite verificar se usuário já comprou um produto

## 📝 Customização

### Adicionar Orderbumps

Para adicionar orderbumps (produtos adicionais), modifique o `PaymentModal.tsx`:

```tsx
const [includeOrderbump, setIncludeOrderbump] = useState(false);
const orderbumpPrice = 9.90;

// No handleSubmit, ajuste o valor:
const totalPrice = price + (includeOrderbump ? orderbumpPrice : 0);
```

### Personalizar Estilos

O componente usa classes Tailwind CSS. Ajuste as classes conforme seu tema:

- `purple-primary` - Cor primária
- `dark-card` - Cor de fundo do card
- `dark-border` - Cor das bordas

### Callback de Confirmação

Use o `onPaymentConfirmed` para executar ações quando o pagamento é confirmado:

```tsx
<PaymentModal
  onPaymentConfirmed={(productId) => {
    // Enviar email
    // Salvar no banco de dados
    // Atualizar estado da aplicação
    // etc.
  }}
/>
```

## 🔐 Segurança

1. **Webhook Token**: Configure `SYNCPAY_WEBHOOK_TOKEN` para validar webhooks
2. **HTTPS**: Use sempre HTTPS em produção
3. **Validação**: O sistema valida valores e transações antes de processar

## 📊 Status de Pagamento

O sistema reconhece os seguintes status:

- `created` - Transação criada, aguardando pagamento
- `paid` / `completed` - Pagamento confirmado
- `pending` / `processing` - Pagamento em processamento
- `canceled` / `cancelled` - Pagamento cancelado

## 🐛 Troubleshooting

### Erro ao obter token
- Verifique se `SYNCPAY_CLIENT_ID` e `SYNCPAY_CLIENT_SECRET` estão corretos
- Verifique se a URL base está correta

### Webhook não funciona
- Verifique se `NEXT_PUBLIC_APP_URL` está configurado
- Configure o webhook no painel SyncPay
- Verifique logs do servidor

### QR Code não aparece
- Verifique se o `pix_code` está sendo retornado pela API
- Verifique conexão com api.qrserver.com

## 📚 Documentação SyncPay

Para mais informações sobre a API SyncPay, consulte a documentação oficial.

## 📄 Licença

Este código está pronto para uso em seus projetos.

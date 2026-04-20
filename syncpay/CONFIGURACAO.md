# Configuração - Variáveis de Ambiente

## Arquivo .env.local

Crie um arquivo `.env.local` na raiz do seu projeto Next.js com as seguintes variáveis:

```env
# Credenciais SyncPay
# Obtenha essas credenciais no painel do SyncPay
SYNCPAY_CLIENT_ID=seu_client_id_aqui
SYNCPAY_CLIENT_SECRET=seu_client_secret_aqui

# URL base da API SyncPay (geralmente não precisa alterar)
SYNCPAY_BASE_URL=https://api.syncpayments.com.br

# URL base da sua aplicação (para webhook)
# Exemplo: https://meu-site.com ou http://localhost:3000 (desenvolvimento)
NEXT_PUBLIC_APP_URL=https://seu-dominio.com

# Token de segurança do webhook (opcional, mas recomendado)
# Configure um token secreto para validar webhooks
SYNCPAY_WEBHOOK_TOKEN=seu_token_secreto_aqui
```

## Onde Obter as Credenciais

1. **SYNCPAY_CLIENT_ID e SYNCPAY_CLIENT_SECRET**
   - Acesse o painel do SyncPay
   - Vá em "Configurações" > "API"
   - Copie o Client ID e Client Secret

2. **NEXT_PUBLIC_APP_URL**
   - Em desenvolvimento: `http://localhost:3000`
   - Em produção: `https://seu-dominio.com`

3. **SYNCPAY_WEBHOOK_TOKEN** (Opcional)
   - Gere um token secreto aleatório
   - Use para validar que os webhooks vêm realmente do SyncPay
   - Exemplo: `openssl rand -hex 32`

## Configuração do Webhook no SyncPay

1. Acesse o painel do SyncPay
2. Vá em "Configurações" > "Webhooks"
3. Adicione a URL: `https://seu-dominio.com/api/syncpay/webhook`
4. Configure o token (se estiver usando `SYNCPAY_WEBHOOK_TOKEN`)

## Verificação

Após configurar, teste criando uma transação de teste. Verifique os logs do console para garantir que tudo está funcionando.

# 🚀 CarregadoStore - Sistema de Pagamento PIX

[![Status](https://img.shields.io/badge/status-pronto-success.svg)]()
[![Versão](https://img.shields.io/badge/versão-1.0.0-blue.svg)]()

Sistema completo de vendas estilo OnlyFans com pagamento PIX via PushinPay.

## Vercel (Next + landing em um deploy)

- Toda a aplicação que precisa de **`/api/*`** está em **`syncpay-next/`** (landing em **`syncpay-next/public/`**).
- No painel do projeto: **Settings → General → Root Directory** = **`syncpay-next`** (exatamente essa pasta).
- Se o **Root Directory** for a raiz do repositório e existir **`index.html` na raiz**, a Vercel pode tratar o projeto como **site estático**: a página abre, mas **`POST /api/payment/create` dá 404**. Por isso a landing duplicada na raiz foi removida; use só a cópia em `syncpay-next/public/`.

---

## ⚡ INÍCIO RÁPIDO

### 1. Configure (3 passos)
```javascript
// 1. pushinpay-real.js (linha 6)
token: 'SEU_TOKEN_PUSHINPAY'

// 2. agradecimento.html (linhas 366, 408)
const whatsappUrl = `https://wa.me/SEU_NUMERO?text=...`;

// 3. agradecimento.html (linhas 444-445)
const BOT_TOKEN = 'SEU_BOT_TOKEN';
const CHAT_ID = 'SEU_CHAT_ID';
```

### 2. Abra no navegador
```bash
cd syncpay-next && npm run dev
# depois: http://localhost:3000/  (redireciona para a landing em public/)
```

### 3. Teste
- Clique em "ASSINAR"
- Veja o modal PIX
- Faça um pagamento teste
- ✅ Pronto!

---

## 📂 ESTRUTURA (APENAS CORE)

```
📁 OnlyFans Tela arrumar/
│
├── 📄 index.html                  ⭐ Página principal
├── 📄 agradecimento.html          ⭐ Pós-pagamento
├── 🎨 styles.css                  ⭐ Estilos
├── ⚙️ script.js                   ⭐ Sistema de pagamento
├── 💳 pushinpay-real.js           ⭐ API PushinPay
│
├── 📁 Images/                     🖼️ Mídia
├── 📁 js/                         🔧 Scripts auxiliares
│   ├── database.js
│   ├── lead-tracking.js
│   └── pushinpay-real.js
│
└── 📖 ME_LEIA.md                  📚 DOCUMENTAÇÃO COMPLETA
```

---

## 📚 DOCUMENTAÇÃO

**Leia tudo em:** `ME_LEIA.md`

Inclui:
- ✅ Checklist de configuração
- 🎯 Como usar
- 🐛 Solução de problemas
- 📊 Dashboard de remarketing
- 🔗 Gerador de links UTM
- 💡 Dicas profissionais

---

## 🎯 FUNCIONALIDADES

### 💰 Pagamento PIX
- QR Code dinâmico
- Código copiável
- Timer de 15 minutos
- Verificação automática (5s)
- Notificações WhatsApp/Telegram

### 📊 Dashboard
- Estatísticas em tempo real
- Filtros avançados
- Campanhas de remarketing
- Exportação CSV/JSON

### 🔗 Rastreamento
- Links UTM
- Origem dos clientes
- Tags automáticas
- Segmentação

---

## 🔧 BACKEND (OPCIONAL)

O sistema funciona **100% sem backend**!

Se quiser usar o backend Node.js:
```bash
npm install
npm start
```

Arquivos do backend:
- `server.js`
- `database.js`
- `models/`
- `routes/`

---

## 📱 COMPATIBILIDADE

✅ Desktop (Chrome, Firefox, Safari, Edge)  
✅ Mobile (iOS, Android)  
✅ Tablet  
✅ Todas as resoluções  

---

## 🆘 SUPORTE

**Problemas?** Consulte `ME_LEIA.md` seção "Solução de Problemas"

**APIs:**
- PushinPay: https://pushinpay.com.br
- Telegram Bots: https://core.telegram.org/bots

---

## 📄 LICENÇA

Projeto desenvolvido para uso comercial.

---

**Desenvolvido por:** Assistant AI  
**Data:** 13/10/2025  
**Status:** ✅ Pronto para produção

🚀 **Comece agora:** Abra `ME_LEIA.md`


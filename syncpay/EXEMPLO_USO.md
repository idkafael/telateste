# Exemplo de Uso - Sistema de Pagamento PIX

## Exemplo Básico

```tsx
"use client";

import { useState } from "react";
import PaymentModal from "@/components/PaymentModal";

interface Product {
  id: string;
  name: string;
  entregavel?: string;
}

export default function ProductPage() {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const product: Product = {
    id: "produto-123",
    name: "Curso de Programação",
    entregavel: "https://drive.google.com/drive/folders/abc123"
  };

  return (
    <div>
      <h1>{product.name}</h1>
      <p>Preço: R$ 49,90</p>
      
      <button 
        onClick={() => setIsPaymentOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Comprar Agora
      </button>

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        product={product}
        price={49.90}
        onPaymentConfirmed={(productId) => {
          console.log(`Produto ${productId} comprado com sucesso!`);
          // Aqui você pode:
          // - Enviar email de confirmação
          // - Salvar no banco de dados
          // - Atualizar estado da aplicação
          // - Redirecionar para página de sucesso
        }}
      />
    </div>
  );
}
```

## Exemplo com Múltiplos Produtos

```tsx
"use client";

import { useState } from "react";
import PaymentModal from "@/components/PaymentModal";

interface Product {
  id: string;
  name: string;
  price: number;
  entregavel?: string;
}

const products: Product[] = [
  {
    id: "produto-1",
    name: "Produto 1",
    price: 49.90,
    entregavel: "https://exemplo.com/produto-1"
  },
  {
    id: "produto-2",
    name: "Produto 2",
    price: 99.90,
    entregavel: "https://exemplo.com/produto-2"
  }
];

export default function ProductsPage() {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleBuy = (product: Product) => {
    setSelectedProduct(product);
    setIsPaymentOpen(true);
  };

  return (
    <div>
      <h1>Nossos Produtos</h1>
      
      {products.map((product) => (
        <div key={product.id} className="product-card">
          <h2>{product.name}</h2>
          <p>R$ {product.price.toFixed(2)}</p>
          <button onClick={() => handleBuy(product)}>
            Comprar
          </button>
        </div>
      ))}

      {selectedProduct && (
        <PaymentModal
          isOpen={isPaymentOpen}
          onClose={() => {
            setIsPaymentOpen(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
          price={selectedProduct.price}
          onPaymentConfirmed={(productId) => {
            alert(`Produto ${productId} comprado com sucesso!`);
          }}
        />
      )}
    </div>
  );
}
```

## Exemplo com Verificação de Compra

```tsx
"use client";

import { useState, useEffect } from "react";
import PaymentModal from "@/components/PaymentModal";

interface Product {
  id: string;
  name: string;
  price: number;
  entregavel?: string;
}

export default function ProductPage() {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);

  const product: Product = {
    id: "produto-123",
    name: "Curso Premium",
    price: 199.90,
    entregavel: "https://exemplo.com/curso"
  };

  // Verificar se o produto já foi comprado
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const purchasedProducts = JSON.parse(
        localStorage.getItem('purchasedProducts') || '[]'
      );
      setHasPurchased(purchasedProducts.includes(product.id));
    }
  }, [product.id]);

  if (hasPurchased) {
    return (
      <div>
        <h1>{product.name}</h1>
        <p>✅ Você já possui este produto!</p>
        <a 
          href={product.entregavel} 
          target="_blank"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Acessar Conteúdo
        </a>
      </div>
    );
  }

  return (
    <div>
      <h1>{product.name}</h1>
      <p>Preço: R$ {product.price.toFixed(2)}</p>
      
      <button onClick={() => setIsPaymentOpen(true)}>
        Comprar Agora
      </button>

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        product={product}
        price={product.price}
        onPaymentConfirmed={(productId) => {
          setHasPurchased(true);
          // Atualizar estado
        }}
      />
    </div>
  );
}
```

## Exemplo com Integração de Banco de Dados

```tsx
"use client";

import { useState } from "react";
import PaymentModal from "@/components/PaymentModal";

interface Product {
  id: string;
  name: string;
  price: number;
  entregavel?: string;
}

export default function ProductPage() {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const product: Product = {
    id: "produto-123",
    name: "Assinatura Premium",
    price: 29.90,
    entregavel: "https://exemplo.com/premium"
  };

  const handlePaymentConfirmed = async (productId: string) => {
    try {
      // Salvar no banco de dados
      const response = await fetch('/api/purchases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: productId,
          userId: 'user-123', // Obter do contexto de autenticação
          purchasedAt: new Date().toISOString()
        })
      });

      if (response.ok) {
        console.log('Compra salva no banco de dados!');
        // Atualizar estado da aplicação
        // Redirecionar para página de sucesso
      }
    } catch (error) {
      console.error('Erro ao salvar compra:', error);
    }
  };

  return (
    <div>
      <h1>{product.name}</h1>
      <p>Preço: R$ {product.price.toFixed(2)}</p>
      
      <button onClick={() => setIsPaymentOpen(true)}>
        Assinar Agora
      </button>

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        product={product}
        price={product.price}
        onPaymentConfirmed={handlePaymentConfirmed}
      />
    </div>
  );
}
```

## Exemplo de API Route para Salvar Compra

```typescript
// app/api/purchases/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, userId, purchasedAt } = body;

    // Aqui você salvaria no banco de dados
    // Exemplo com Prisma:
    // const purchase = await prisma.purchase.create({
    //   data: {
    //     productId,
    //     userId,
    //     purchasedAt: new Date(purchasedAt)
    //   }
    // });

    return NextResponse.json({ 
      success: true,
      message: 'Compra registrada com sucesso'
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 });
  }
}
```

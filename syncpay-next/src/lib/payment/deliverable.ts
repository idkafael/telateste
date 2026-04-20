import type { Delivery } from "@/types/payment";
import { prisma } from "@/db/prisma";
import { logger } from "@/lib/logger";

export async function releaseDeliverableForTransaction(transactionId: string): Promise<Delivery> {
  const existing = await prisma.delivery.findFirst({
    where: { transactionId },
    orderBy: { createdAt: "asc" },
  });
  if (existing) {
    return { type: existing.type as Delivery["type"], content: existing.content };
  }

  // Entregável genérico (substitua pelo seu produto real)
  const delivery: Delivery = {
    type: "link",
    content: "https://example.com/acesso-entregavel", // TODO: substitua
  };

  const created = await prisma.delivery.create({
    data: {
      transactionId,
      type: delivery.type,
      content: delivery.content,
    },
  });

  logger.info("Deliverable released", { transactionId, deliveryId: created.id });
  return delivery;
}


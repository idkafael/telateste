-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "provider" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'BRL',
    "description" TEXT,
    "recode" TEXT,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerDoc" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "pixCode" TEXT,
    "qrCodeBase64" TEXT,
    "rawProviderRef" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Delivery" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "transactionId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Delivery_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProcessedEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "provider" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "eventKey" TEXT NOT NULL,
    "eventHash" TEXT NOT NULL,
    "receivedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProcessedEvent_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_identifier_key" ON "Transaction"("identifier");

-- CreateIndex
CREATE INDEX "Transaction_provider_status_idx" ON "Transaction"("provider", "status");

-- CreateIndex
CREATE INDEX "Delivery_transactionId_idx" ON "Delivery"("transactionId");

-- CreateIndex
CREATE INDEX "ProcessedEvent_transactionId_idx" ON "ProcessedEvent"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "ProcessedEvent_provider_eventKey_key" ON "ProcessedEvent"("provider", "eventKey");

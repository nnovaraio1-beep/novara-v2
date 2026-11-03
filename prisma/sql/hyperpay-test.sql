ALTER TABLE "Payment" ADD COLUMN "providerReference" TEXT;
ALTER TABLE "Payment" ADD COLUMN "lastVerifiedAt" TIMESTAMP(3);
CREATE UNIQUE INDEX "Payment_providerReference_key" ON "Payment"("providerReference");

ALTER TABLE "Payment" ADD COLUMN "checkoutIntegrity" TEXT;

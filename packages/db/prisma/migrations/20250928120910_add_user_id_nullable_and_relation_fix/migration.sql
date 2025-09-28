-- AlterTable
ALTER TABLE "public"."Url" ADD COLUMN     "userId" TEXT;

-- CreateIndex
CREATE INDEX "Url_userId_createdAt_idx" ON "public"."Url"("userId", "createdAt");

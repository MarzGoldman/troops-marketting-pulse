-- CreateTable
CREATE TABLE "public"."Url" (
    "id" TEXT NOT NULL,
    "shortCode" VARCHAR(16) NOT NULL,
    "targetUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Url_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Click" (
    "id" TEXT NOT NULL,
    "urlId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip" VARCHAR(45),
    "userAgent" TEXT,
    "referer" TEXT,

    CONSTRAINT "Click_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Url_shortCode_key" ON "public"."Url"("shortCode");

-- CreateIndex
CREATE INDEX "Click_urlId_createdAt_idx" ON "public"."Click"("urlId", "createdAt");

-- AddForeignKey
ALTER TABLE "public"."Click" ADD CONSTRAINT "Click_urlId_fkey" FOREIGN KEY ("urlId") REFERENCES "public"."Url"("id") ON DELETE CASCADE ON UPDATE CASCADE;

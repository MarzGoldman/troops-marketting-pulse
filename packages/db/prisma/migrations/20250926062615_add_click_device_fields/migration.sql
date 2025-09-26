-- AlterTable
ALTER TABLE "public"."Click" ADD COLUMN     "browser" VARCHAR(32),
ADD COLUMN     "deviceType" VARCHAR(32),
ADD COLUMN     "isBot" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "os" VARCHAR(32);

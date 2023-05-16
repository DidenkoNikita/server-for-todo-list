/*
  Warnings:

  - You are about to drop the column `refresh_token` on the `Tokens` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[access_token]` on the table `Tokens` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Tokens_refresh_token_key";

-- AlterTable
ALTER TABLE "Tokens" DROP COLUMN "refresh_token",
ADD COLUMN     "access_token" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Tokens_access_token_key" ON "Tokens"("access_token");

/*
  Warnings:

  - A unique constraint covering the columns `[refresh_token]` on the table `Tokens` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Tokens_refresh_token_key" ON "Tokens"("refresh_token");

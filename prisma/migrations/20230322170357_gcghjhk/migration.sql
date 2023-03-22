/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `Tokens` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Tokens_user_id_key" ON "Tokens"("user_id");

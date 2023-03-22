/*
  Warnings:

  - You are about to drop the column `access_token` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `refresh_token` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "access_token",
DROP COLUMN "refresh_token";

-- CreateTable
CREATE TABLE "Tokens" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "access_token" TEXT,
    "refresh_token" TEXT,

    CONSTRAINT "Tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tokens_user_id_key" ON "Tokens"("user_id");

-- AddForeignKey
ALTER TABLE "Tokens" ADD CONSTRAINT "Tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

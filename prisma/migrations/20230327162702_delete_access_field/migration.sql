/*
  Warnings:

  - You are about to drop the column `access_token` on the `Tokens` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tokens" DROP COLUMN "access_token";

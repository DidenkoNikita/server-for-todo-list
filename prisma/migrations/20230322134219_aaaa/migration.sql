/*
  Warnings:

  - You are about to drop the `Tokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tokens" DROP CONSTRAINT "Tokens_user_id_fkey";

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "access_token" TEXT,
ADD COLUMN     "refresh_token" TEXT;

-- DropTable
DROP TABLE "Tokens";

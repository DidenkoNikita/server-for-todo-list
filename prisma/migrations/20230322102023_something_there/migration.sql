/*
  Warnings:

  - You are about to drop the `Tokens` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `access_token` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refresh_token` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Tokens" DROP CONSTRAINT "Tokens_user_id_fkey";

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "access_token" TEXT NOT NULL,
ADD COLUMN     "refresh_token" TEXT NOT NULL;

-- DropTable
DROP TABLE "Tokens";

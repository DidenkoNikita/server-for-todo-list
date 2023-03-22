/*
  Warnings:

  - You are about to alter the column `access_token` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(150)`.
  - You are about to alter the column `refresh_token` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(150)`.

*/
-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "access_token" SET DATA TYPE VARCHAR(150),
ALTER COLUMN "refresh_token" SET DATA TYPE VARCHAR(150);

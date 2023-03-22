/*
  Warnings:

  - Changed the type of `access_token` on the `Users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `refresh_token` on the `Users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "access_token",
ADD COLUMN     "access_token" JSONB NOT NULL,
DROP COLUMN "refresh_token",
ADD COLUMN     "refresh_token" JSONB NOT NULL;

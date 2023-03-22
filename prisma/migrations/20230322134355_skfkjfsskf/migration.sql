/*
  Warnings:

  - Made the column `access_token` on table `Users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `refresh_token` on table `Users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "access_token" SET NOT NULL,
ALTER COLUMN "refresh_token" SET NOT NULL;

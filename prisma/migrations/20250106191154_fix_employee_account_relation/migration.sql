/*
  Warnings:

  - Added the required column `phone` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rfc` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "phone" INTEGER NOT NULL,
ADD COLUMN     "rfc" VARCHAR(15) NOT NULL;

/*
  Warnings:

  - You are about to drop the column `idModel` on the `ImplicateParty` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ImplicateParty" DROP CONSTRAINT "ImplicateParty_idModel_fkey";

-- AlterTable
ALTER TABLE "ImplicateParty" DROP COLUMN "idModel",
ADD COLUMN     "idBrand" INTEGER,
ADD COLUMN     "plates" VARCHAR(50);

-- AddForeignKey
ALTER TABLE "ImplicateParty" ADD CONSTRAINT "ImplicateParty_idBrand_fkey" FOREIGN KEY ("idBrand") REFERENCES "Brand"("idBrand") ON DELETE SET NULL ON UPDATE CASCADE;

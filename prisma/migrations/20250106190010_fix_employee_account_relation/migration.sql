/*
  Warnings:

  - A unique constraint covering the columns `[idEmployee]` on the table `Account` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_idEmployee_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "Account_idEmployee_key" ON "Account"("idEmployee");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_idEmployee_fkey" FOREIGN KEY ("idEmployee") REFERENCES "Employee"("idEmployee") ON DELETE SET NULL ON UPDATE CASCADE;

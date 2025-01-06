/*
  Warnings:

  - You are about to drop the `_DriverToReport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_EmployeeToReport` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[reportNumber]` on the table `Report` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `driverId` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reportNumber` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_DriverToReport" DROP CONSTRAINT "_DriverToReport_A_fkey";

-- DropForeignKey
ALTER TABLE "_DriverToReport" DROP CONSTRAINT "_DriverToReport_B_fkey";

-- DropForeignKey
ALTER TABLE "_EmployeeToReport" DROP CONSTRAINT "_EmployeeToReport_A_fkey";

-- DropForeignKey
ALTER TABLE "_EmployeeToReport" DROP CONSTRAINT "_EmployeeToReport_B_fkey";

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "assignedEmployeeId" INTEGER,
ADD COLUMN     "driverId" INTEGER NOT NULL,
ADD COLUMN     "reportNumber" VARCHAR(6) NOT NULL;

-- DropTable
DROP TABLE "_DriverToReport";

-- DropTable
DROP TABLE "_EmployeeToReport";

-- CreateIndex
CREATE UNIQUE INDEX "Report_reportNumber_key" ON "Report"("reportNumber");

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("idUser") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_assignedEmployeeId_fkey" FOREIGN KEY ("assignedEmployeeId") REFERENCES "Employee"("idEmployee") ON DELETE SET NULL ON UPDATE CASCADE;

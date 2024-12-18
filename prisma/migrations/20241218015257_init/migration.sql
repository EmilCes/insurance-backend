/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "PolicyPlanStatus" (
    "idPolicyPlanStatus" SERIAL NOT NULL,
    "policyPlanStatusType" TEXT NOT NULL,

    CONSTRAINT "PolicyPlanStatus_pkey" PRIMARY KEY ("idPolicyPlanStatus")
);

-- CreateTable
CREATE TABLE "Service" (
    "idService" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "isCovered" BOOLEAN NOT NULL,
    "coveredCost" DECIMAL(65,30) NOT NULL,
    "idPolicyPlan" TEXT NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("idService")
);

-- CreateTable
CREATE TABLE "PolicyPlan" (
    "idPolicyPlan" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "maxPeriod" INTEGER NOT NULL,
    "basePrice" DECIMAL(65,30) NOT NULL,
    "idPolicyPlanStatus" INTEGER NOT NULL,

    CONSTRAINT "PolicyPlan_pkey" PRIMARY KEY ("idPolicyPlan")
);

-- CreateTable
CREATE TABLE "Brand" (
    "idBrand" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("idBrand")
);

-- CreateTable
CREATE TABLE "Model" (
    "idModel" SERIAL NOT NULL,
    "year" TEXT NOT NULL,
    "idBrand" INTEGER NOT NULL,

    CONSTRAINT "Model_pkey" PRIMARY KEY ("idModel")
);

-- CreateTable
CREATE TABLE "Color" (
    "idColor" SERIAL NOT NULL,
    "vehicleColor" TEXT NOT NULL,

    CONSTRAINT "Color_pkey" PRIMARY KEY ("idColor")
);

-- CreateTable
CREATE TABLE "Type" (
    "idType" SERIAL NOT NULL,
    "vehicleType" TEXT NOT NULL,

    CONSTRAINT "Type_pkey" PRIMARY KEY ("idType")
);

-- CreateTable
CREATE TABLE "ServiceVehicle" (
    "idService" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ServiceVehicle_pkey" PRIMARY KEY ("idService")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "plates" TEXT NOT NULL,
    "serialNumberVehicle" TEXT NOT NULL,
    "occupants" INTEGER NOT NULL,
    "idService" INTEGER NOT NULL,
    "idType" INTEGER NOT NULL,
    "idModel" INTEGER NOT NULL,
    "idColor" INTEGER NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("plates")
);

-- CreateTable
CREATE TABLE "PolicyService" (
    "idPolicyService" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "isCovered" BOOLEAN NOT NULL,
    "coveredCost" DECIMAL(65,30) NOT NULL,
    "serialNumber" TEXT NOT NULL,

    CONSTRAINT "PolicyService_pkey" PRIMARY KEY ("idPolicyService")
);

-- CreateTable
CREATE TABLE "Policy" (
    "serialNumber" TEXT NOT NULL,
    "period" INTEGER NOT NULL,
    "isCanceled" BOOLEAN NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "planType" TEXT NOT NULL,
    "planDescription" TEXT NOT NULL,
    "idUser" TEXT NOT NULL,
    "idPolicyPlan" TEXT NOT NULL,
    "plates" TEXT NOT NULL,

    CONSTRAINT "Policy_pkey" PRIMARY KEY ("serialNumber")
);

-- CreateTable
CREATE TABLE "Driver" (
    "idUser" TEXT NOT NULL,
    "rfc" TEXT NOT NULL,
    "bankAccountNumber" TEXT NOT NULL,
    "expirationDateBankAccount" TIMESTAMP(3) NOT NULL,
    "licenseNumber" TEXT NOT NULL,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("idUser")
);

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_idPolicyPlan_fkey" FOREIGN KEY ("idPolicyPlan") REFERENCES "PolicyPlan"("idPolicyPlan") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PolicyPlan" ADD CONSTRAINT "PolicyPlan_idPolicyPlanStatus_fkey" FOREIGN KEY ("idPolicyPlanStatus") REFERENCES "PolicyPlanStatus"("idPolicyPlanStatus") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Model" ADD CONSTRAINT "Model_idBrand_fkey" FOREIGN KEY ("idBrand") REFERENCES "Brand"("idBrand") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_idService_fkey" FOREIGN KEY ("idService") REFERENCES "ServiceVehicle"("idService") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_idType_fkey" FOREIGN KEY ("idType") REFERENCES "Type"("idType") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_idModel_fkey" FOREIGN KEY ("idModel") REFERENCES "Model"("idModel") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_idColor_fkey" FOREIGN KEY ("idColor") REFERENCES "Color"("idColor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PolicyService" ADD CONSTRAINT "PolicyService_serialNumber_fkey" FOREIGN KEY ("serialNumber") REFERENCES "Policy"("serialNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Policy" ADD CONSTRAINT "Policy_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "Driver"("idUser") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Policy" ADD CONSTRAINT "Policy_idPolicyPlan_fkey" FOREIGN KEY ("idPolicyPlan") REFERENCES "PolicyPlan"("idPolicyPlan") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Policy" ADD CONSTRAINT "Policy_plates_fkey" FOREIGN KEY ("plates") REFERENCES "Vehicle"("plates") ON DELETE RESTRICT ON UPDATE CASCADE;

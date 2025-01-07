-- CreateTable
CREATE TABLE "PolicyPlanStatus" (
    "idPolicyPlanStatus" SERIAL NOT NULL,
    "policyPlanStatusType" VARCHAR(15) NOT NULL,

    CONSTRAINT "PolicyPlanStatus_pkey" PRIMARY KEY ("idPolicyPlanStatus")
);

-- CreateTable
CREATE TABLE "Service" (
    "idService" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "isCovered" BOOLEAN NOT NULL,
    "coveredCost" DECIMAL(10,2) NOT NULL,
    "idPolicyPlan" TEXT NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("idService")
);

-- CreateTable
CREATE TABLE "PolicyPlan" (
    "idPolicyPlan" TEXT NOT NULL,
    "title" VARCHAR(30) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "maxPeriod" INTEGER NOT NULL,
    "basePrice" DECIMAL(10,2) NOT NULL,
    "idPolicyPlanStatus" INTEGER NOT NULL,

    CONSTRAINT "PolicyPlan_pkey" PRIMARY KEY ("idPolicyPlan")
);

-- CreateTable
CREATE TABLE "Brand" (
    "idBrand" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("idBrand")
);

-- CreateTable
CREATE TABLE "Model" (
    "idModel" SERIAL NOT NULL,
    "year" VARCHAR(4) NOT NULL,
    "idBrand" INTEGER NOT NULL,

    CONSTRAINT "Model_pkey" PRIMARY KEY ("idModel")
);

-- CreateTable
CREATE TABLE "Color" (
    "idColor" SERIAL NOT NULL,
    "vehicleColor" VARCHAR(40) NOT NULL,

    CONSTRAINT "Color_pkey" PRIMARY KEY ("idColor")
);

-- CreateTable
CREATE TABLE "Type" (
    "idType" SERIAL NOT NULL,
    "vehicleType" VARCHAR(50) NOT NULL,

    CONSTRAINT "Type_pkey" PRIMARY KEY ("idType")
);

-- CreateTable
CREATE TABLE "ServiceVehicle" (
    "idService" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "ServiceVehicle_pkey" PRIMARY KEY ("idService")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "plates" VARCHAR(15) NOT NULL,
    "serialNumberVehicle" VARCHAR(15) NOT NULL,
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
    "name" VARCHAR(100) NOT NULL,
    "isCovered" BOOLEAN NOT NULL,
    "coveredCost" DECIMAL(10,2) NOT NULL,
    "serialNumber" TEXT NOT NULL,

    CONSTRAINT "PolicyService_pkey" PRIMARY KEY ("idPolicyService")
);

-- CreateTable
CREATE TABLE "Policy" (
    "serialNumber" TEXT NOT NULL,
    "monthsOfPayment" INTEGER NOT NULL,
    "yearsPolicy" INTEGER NOT NULL,
    "isCanceled" BOOLEAN NOT NULL,
    "coveredCost" DECIMAL(10,2) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "planTitle" VARCHAR(30) NOT NULL,
    "planDescription" VARCHAR(255) NOT NULL,
    "idPolicyPlan" TEXT NOT NULL,
    "plates" TEXT NOT NULL,
    "idUser" INTEGER NOT NULL,

    CONSTRAINT "Policy_pkey" PRIMARY KEY ("serialNumber")
);

-- CreateTable
CREATE TABLE "Driver" (
    "rfc" VARCHAR(14) NOT NULL,
    "bankAccountNumber" VARCHAR(100) NOT NULL,
    "expirationDateBankAccount" TIMESTAMP(3) NOT NULL,
    "licenseNumber" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(10) NOT NULL,
    "idUser" SERIAL NOT NULL,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("idUser")
);

-- CreateTable
CREATE TABLE "Account" (
    "idAccount" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(50) NOT NULL,
    "datebirth" TIMESTAMP(3) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(64) NOT NULL,
    "registrationDate" TIMESTAMP(3) NOT NULL,
    "postalCode" VARCHAR(10) NOT NULL,
    "address" VARCHAR(100) NOT NULL,
    "idUser" INTEGER,
    "idEmployee" INTEGER,
    "idMunicipality" INTEGER NOT NULL,
    "secretKey" VARCHAR(100) NOT NULL DEFAULT 'default_secret_key',

    CONSTRAINT "Account_pkey" PRIMARY KEY ("idAccount")
);

-- CreateTable
CREATE TABLE "Municipality" (
    "idMunicipality" SERIAL NOT NULL,
    "municipalityName" VARCHAR(100) NOT NULL,
    "idState" INTEGER NOT NULL,

    CONSTRAINT "Municipality_pkey" PRIMARY KEY ("idMunicipality")
);

-- CreateTable
CREATE TABLE "State" (
    "idState" SERIAL NOT NULL,
    "stateName" VARCHAR(100) NOT NULL,

    CONSTRAINT "State_pkey" PRIMARY KEY ("idState")
);

-- CreateTable
CREATE TABLE "Report" (
    "idReport" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "latitude" DECIMAL(9,6) NOT NULL,
    "longitude" DECIMAL(10,6) NOT NULL,
    "result" TEXT NOT NULL,
    "reportDecisionDate" TIMESTAMP(3) NOT NULL,
    "idStatus" INTEGER NOT NULL,
    "plates" VARCHAR(15) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("idReport")
);

-- CreateTable
CREATE TABLE "Employee" (
    "idEmployee" SERIAL NOT NULL,
    "employeeNumber" INTEGER NOT NULL,
    "idEmployeeType" INTEGER NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("idEmployee")
);

-- CreateTable
CREATE TABLE "EmployeeType" (
    "idEmployeeType" SERIAL NOT NULL,
    "employeeType" VARCHAR(50) NOT NULL,

    CONSTRAINT "EmployeeType_pkey" PRIMARY KEY ("idEmployeeType")
);

-- CreateTable
CREATE TABLE "ImplicateParty" (
    "idImplicateParty" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "idModel" INTEGER NOT NULL,
    "idReport" INTEGER NOT NULL,

    CONSTRAINT "ImplicateParty_pkey" PRIMARY KEY ("idImplicateParty")
);

-- CreateTable
CREATE TABLE "Status" (
    "idStatus" SERIAL NOT NULL,
    "statusType" VARCHAR(15) NOT NULL,

    CONSTRAINT "Status_pkey" PRIMARY KEY ("idStatus")
);

-- CreateTable
CREATE TABLE "Photograph" (
    "idPhotograph" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "url" BYTEA NOT NULL,
    "idReport" INTEGER NOT NULL,

    CONSTRAINT "Photograph_pkey" PRIMARY KEY ("idPhotograph")
);

-- CreateTable
CREATE TABLE "_DriverToReport" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_EmployeeToReport" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_idUser_key" ON "Account"("idUser");

-- CreateIndex
CREATE UNIQUE INDEX "_DriverToReport_AB_unique" ON "_DriverToReport"("A", "B");

-- CreateIndex
CREATE INDEX "_DriverToReport_B_index" ON "_DriverToReport"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EmployeeToReport_AB_unique" ON "_EmployeeToReport"("A", "B");

-- CreateIndex
CREATE INDEX "_EmployeeToReport_B_index" ON "_EmployeeToReport"("B");

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_idPolicyPlan_fkey" FOREIGN KEY ("idPolicyPlan") REFERENCES "PolicyPlan"("idPolicyPlan") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PolicyPlan" ADD CONSTRAINT "PolicyPlan_idPolicyPlanStatus_fkey" FOREIGN KEY ("idPolicyPlanStatus") REFERENCES "PolicyPlanStatus"("idPolicyPlanStatus") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Model" ADD CONSTRAINT "Model_idBrand_fkey" FOREIGN KEY ("idBrand") REFERENCES "Brand"("idBrand") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_idColor_fkey" FOREIGN KEY ("idColor") REFERENCES "Color"("idColor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_idModel_fkey" FOREIGN KEY ("idModel") REFERENCES "Model"("idModel") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_idService_fkey" FOREIGN KEY ("idService") REFERENCES "ServiceVehicle"("idService") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_idType_fkey" FOREIGN KEY ("idType") REFERENCES "Type"("idType") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PolicyService" ADD CONSTRAINT "PolicyService_serialNumber_fkey" FOREIGN KEY ("serialNumber") REFERENCES "Policy"("serialNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Policy" ADD CONSTRAINT "Policy_idPolicyPlan_fkey" FOREIGN KEY ("idPolicyPlan") REFERENCES "PolicyPlan"("idPolicyPlan") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Policy" ADD CONSTRAINT "Policy_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "Driver"("idUser") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Policy" ADD CONSTRAINT "Policy_plates_fkey" FOREIGN KEY ("plates") REFERENCES "Vehicle"("plates") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_idMunicipality_fkey" FOREIGN KEY ("idMunicipality") REFERENCES "Municipality"("idMunicipality") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "Driver"("idUser") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Municipality" ADD CONSTRAINT "Municipality_idState_fkey" FOREIGN KEY ("idState") REFERENCES "State"("idState") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_plates_fkey" FOREIGN KEY ("plates") REFERENCES "Vehicle"("plates") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_idStatus_fkey" FOREIGN KEY ("idStatus") REFERENCES "Status"("idStatus") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_idEmployeeType_fkey" FOREIGN KEY ("idEmployeeType") REFERENCES "EmployeeType"("idEmployeeType") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_idEmployee_fkey" FOREIGN KEY ("idEmployee") REFERENCES "Account"("idAccount") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImplicateParty" ADD CONSTRAINT "ImplicateParty_idModel_fkey" FOREIGN KEY ("idModel") REFERENCES "Model"("idModel") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImplicateParty" ADD CONSTRAINT "ImplicateParty_idReport_fkey" FOREIGN KEY ("idReport") REFERENCES "Report"("idReport") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photograph" ADD CONSTRAINT "Photograph_idReport_fkey" FOREIGN KEY ("idReport") REFERENCES "Report"("idReport") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DriverToReport" ADD CONSTRAINT "_DriverToReport_A_fkey" FOREIGN KEY ("A") REFERENCES "Driver"("idUser") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DriverToReport" ADD CONSTRAINT "_DriverToReport_B_fkey" FOREIGN KEY ("B") REFERENCES "Report"("idReport") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmployeeToReport" ADD CONSTRAINT "_EmployeeToReport_A_fkey" FOREIGN KEY ("A") REFERENCES "Employee"("idEmployee") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmployeeToReport" ADD CONSTRAINT "_EmployeeToReport_B_fkey" FOREIGN KEY ("B") REFERENCES "Report"("idReport") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "Policy" ALTER COLUMN "startDate" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "startDate" SET DATA TYPE TIMESTAMPTZ(6);

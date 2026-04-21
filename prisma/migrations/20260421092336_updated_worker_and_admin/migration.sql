/*
  Warnings:

  - You are about to drop the column `adminId` on the `Worker` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[aadhar]` on the table `Worker` will be added. If there are existing duplicate values, this will fail.
  - Made the column `address` on table `Worker` required. This step will fail if there are existing NULL values in that column.
  - Made the column `aadhar` on table `Worker` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Worker" DROP CONSTRAINT "Worker_adminId_fkey";

-- DropIndex
DROP INDEX "Worker_adminId_idx";

-- AlterTable
ALTER TABLE "Worker" DROP COLUMN "adminId",
ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "aadhar" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Worker_aadhar_key" ON "Worker"("aadhar");

-- CreateIndex
CREATE INDEX "Worker_aadhar_idx" ON "Worker"("aadhar");

/*
  Warnings:

  - A unique constraint covering the columns `[aadhar]` on the table `Supervisor` will be added. If there are existing duplicate values, this will fail.
  - Made the column `aadhar` on table `Supervisor` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Supervisor" ALTER COLUMN "aadhar" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Supervisor_aadhar_key" ON "Supervisor"("aadhar");

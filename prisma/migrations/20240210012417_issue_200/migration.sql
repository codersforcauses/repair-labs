/*
  Warnings:

  - The primary key for the `RepairRequest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `RepairRequest` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `organisationId` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the `Brand` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Organisation` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `repairRequestId` on the `RepairRequestImage` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "RepairRequestImage" DROP CONSTRAINT "RepairRequestImage_repairRequestId_fkey";

-- DropForeignKey
ALTER TABLE "Staff" DROP CONSTRAINT "Staff_organisationId_fkey";

-- AlterTable
ALTER TABLE "RepairRequest" DROP CONSTRAINT "RepairRequest_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "RepairRequest_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "RepairRequestImage" DROP COLUMN "repairRequestId",
ADD COLUMN     "repairRequestId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Staff" DROP COLUMN "organisationId";

-- DropTable
DROP TABLE "Brand";

-- DropTable
DROP TABLE "Organisation";

-- AddForeignKey
ALTER TABLE "RepairRequestImage" ADD CONSTRAINT "RepairRequestImage_repairRequestId_fkey" FOREIGN KEY ("repairRequestId") REFERENCES "RepairRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `open_hours` on the `Orphanages` table. All the data in the column will be lost.
  - Added the required column `opening_hours` to the `Orphanages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Orphanages" DROP COLUMN "open_hours",
ADD COLUMN     "opening_hours" TEXT NOT NULL;

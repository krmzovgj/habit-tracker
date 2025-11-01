/*
  Warnings:

  - You are about to drop the column `recuring` on the `Reminder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Reminder" DROP COLUMN "recuring",
ADD COLUMN     "recurring" BOOLEAN NOT NULL DEFAULT false;

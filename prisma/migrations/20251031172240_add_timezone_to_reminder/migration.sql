/*
  Warnings:

  - Added the required column `timezone` to the `Reminder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `triggerAtUtc` to the `Reminder` table without a default value. This is not possible if the table is not empty.
  - Made the column `message` on table `Reminder` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Reminder" DROP CONSTRAINT "Reminder_habitId_fkey";

-- AlterTable
ALTER TABLE "Reminder" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "recuring" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "timezone" TEXT NOT NULL,
ADD COLUMN     "triggerAtUtc" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "message" SET NOT NULL,
ALTER COLUMN "habitId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "Habit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

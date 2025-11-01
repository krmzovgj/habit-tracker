-- DropForeignKey
ALTER TABLE "public"."Notification" DROP CONSTRAINT "Notification_habitId_fkey";

-- AlterTable
ALTER TABLE "Notification" ALTER COLUMN "habitId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "Habit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

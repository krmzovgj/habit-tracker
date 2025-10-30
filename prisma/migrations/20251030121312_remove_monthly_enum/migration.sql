/*
  Warnings:

  - The values [MONTHLY] on the enum `Frequency` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Frequency_new" AS ENUM ('DAILY', 'WEEKLY');
ALTER TABLE "public"."Habit" ALTER COLUMN "frequency" DROP DEFAULT;
ALTER TABLE "Habit" ALTER COLUMN "frequency" TYPE "Frequency_new" USING ("frequency"::text::"Frequency_new");
ALTER TYPE "Frequency" RENAME TO "Frequency_old";
ALTER TYPE "Frequency_new" RENAME TO "Frequency";
DROP TYPE "public"."Frequency_old";
ALTER TABLE "Habit" ALTER COLUMN "frequency" SET DEFAULT 'DAILY';
COMMIT;

/*
  Warnings:

  - Made the column `brandVoice` on table `SonicMessage` required. This step will fail if there are existing NULL values in that column.
  - Made the column `mode` on table `SonicMessage` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "SonicMessage" ALTER COLUMN "brandVoice" SET NOT NULL,
ALTER COLUMN "mode" SET NOT NULL;

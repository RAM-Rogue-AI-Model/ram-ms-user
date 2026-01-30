/*
  Warnings:

  - You are about to drop the column `registrationDate` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `registrationDate`,
    ADD COLUMN `registration_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

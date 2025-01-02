/*
  Warnings:

  - You are about to drop the column `expired` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the `tokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `tokens` DROP FOREIGN KEY `tokens_user_id_fkey`;

-- AlterTable
ALTER TABLE `sessions` DROP COLUMN `expired`;

-- DropTable
DROP TABLE `tokens`;

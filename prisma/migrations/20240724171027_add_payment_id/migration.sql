/*
  Warnings:

  - Added the required column `payment_id` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "order" ADD COLUMN     "payment_id" TEXT NOT NULL;

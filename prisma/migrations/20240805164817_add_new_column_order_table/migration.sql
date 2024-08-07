/*
  Warnings:

  - Added the required column `payment_status` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "order" ADD COLUMN     "payment_status" TEXT NOT NULL;

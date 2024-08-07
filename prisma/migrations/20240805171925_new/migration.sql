/*
  Warnings:

  - Added the required column `order_batch_id` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "order" ADD COLUMN     "order_batch_id" TEXT NOT NULL;

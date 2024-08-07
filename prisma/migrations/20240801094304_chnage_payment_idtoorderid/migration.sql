/*
  Warnings:

  - You are about to drop the column `payment_id` on the `order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "order" DROP COLUMN "payment_id",
ADD COLUMN     "razo_pay_order_id" TEXT;

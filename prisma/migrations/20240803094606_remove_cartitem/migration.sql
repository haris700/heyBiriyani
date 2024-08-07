/*
  Warnings:

  - You are about to drop the `cart_item` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `item_id` to the `cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_price` to the `cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit_price` to the `cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `cart` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "cart_item" DROP CONSTRAINT "cart_item_cart_id_fkey";

-- DropForeignKey
ALTER TABLE "cart_item" DROP CONSTRAINT "cart_item_item_id_fkey";

-- DropIndex
DROP INDEX "cart_user_id_key";

-- AlterTable
ALTER TABLE "cart" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "item_id" INTEGER NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL,
ADD COLUMN     "total_price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "unit_price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "cart_item";

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "cart_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

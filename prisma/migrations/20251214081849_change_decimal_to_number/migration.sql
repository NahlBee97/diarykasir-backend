/*
  Warnings:

  - You are about to alter the column `unitPrice` on the `orderItems` table. The data in that column could be lost. The data in that column will be cast from `Decimal(15,2)` to `Integer`.
  - You are about to alter the column `totalAmount` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `Decimal(15,2)` to `Integer`.
  - You are about to alter the column `paymentCash` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `Decimal(15,2)` to `Integer`.
  - You are about to alter the column `paymentChange` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `Decimal(15,2)` to `Integer`.
  - You are about to alter the column `price` on the `products` table. The data in that column could be lost. The data in that column will be cast from `Decimal(15,2)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "orderItems" ALTER COLUMN "unitPrice" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "totalAmount" SET DATA TYPE INTEGER,
ALTER COLUMN "paymentCash" SET DATA TYPE INTEGER,
ALTER COLUMN "paymentChange" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "price" SET DATA TYPE INTEGER;

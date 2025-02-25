/*
  Warnings:

  - You are about to alter the column `productPriceSale` on the `orderDetails` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Decimal(65,30)`.

*/
-- AlterTable
ALTER TABLE `orderDetails` MODIFY `productPriceSale` DECIMAL(65, 30) NOT NULL;

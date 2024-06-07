/*
  Warnings:

  - You are about to drop the column `color` on the `CartItem` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `CartItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CartItem" DROP COLUMN "color",
DROP COLUMN "size",
ADD COLUMN     "colorId" TEXT,
ADD COLUMN     "sizeId" TEXT;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "ProductSize"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "ProductColor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

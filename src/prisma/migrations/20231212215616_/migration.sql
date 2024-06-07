/*
  Warnings:

  - You are about to drop the column `color` on the `ProductColor` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `ProductSize` table. All the data in the column will be lost.
  - Added the required column `name` to the `ProductColor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `ProductSize` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductColor" DROP COLUMN "color",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ProductSize" DROP COLUMN "size",
ADD COLUMN     "name" TEXT NOT NULL;

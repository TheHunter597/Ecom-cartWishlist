/*
  Warnings:

  - A unique constraint covering the columns `[owner]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Cart_owner_key" ON "Cart"("owner");

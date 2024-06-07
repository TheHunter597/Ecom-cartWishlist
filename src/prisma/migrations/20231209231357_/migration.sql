-- CreateTable
CREATE TABLE "Cart" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "owner" TEXT NOT NULL,
    "products" TEXT[],

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

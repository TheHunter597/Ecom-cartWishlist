import { Router } from "express";
import { Client } from "../prisma/client";

let router = Router();

async function getAllProducts(req: any, res: any) {
  try {
    let result = await Client.product.findMany();
    res.send(result);
  } catch (err) {
    console.log(err);
  }
}

router.get("/api/v1/cart/products/", getAllProducts);

export { router as getAllProductsRouter };

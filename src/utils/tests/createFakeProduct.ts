import { Client } from "../../prisma/client";
import { randomBytes } from "crypto";
export default async function createFakeProduct(
  data = {
    title: "test",
    price: 15,
    description: "test",
    image: "test",
    id: randomBytes(12).toString("hex"),
  }
) {
  let product = await Client.product.create({
    data,
  });

  return product;
}

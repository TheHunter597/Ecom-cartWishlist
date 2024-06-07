import { Client } from "../../prisma/client";

export default async function createFakeCart(owner = "test_user") {
  let newCart = await Client.cart.create({
    data: {
      owner,
    },
  });
  return newCart;
}

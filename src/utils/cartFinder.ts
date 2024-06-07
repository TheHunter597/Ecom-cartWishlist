import { Client } from "../prisma/client";
import redisClient from "./redisClient";

export default async function cartFinder(user_id: string) {
  let data = await redisClient.get(`${user_id}-cart`);
  let cart = data ? JSON.parse(data) : null;
  if (!cart || cart === "null") {
    cart = await Client.cart.findUnique({
      where: {
        owner: user_id,
      },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });
  }
  if (!cart) {
    cart = await Client.cart.create({
      data: {
        owner: user_id,
      },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });
  }
  return cart;
}

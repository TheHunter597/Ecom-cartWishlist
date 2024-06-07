import { Client } from "../../prisma/client";

beforeAll(async () => {
  process.env.JWTSECRET = "test-secret";
  process.env.REDIS_EXPIRY = "";
  await Client.$connect();
});

beforeEach(async () => {
  let carts = await Client.cart.findMany();
  await Client.cartItem.deleteMany();
  await Client.product.deleteMany();
  await Client.cart.deleteMany();
});

afterAll(async () => {
  await Client.$disconnect();
});

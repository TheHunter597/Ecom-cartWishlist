import request from "supertest";
import app from "../../../app";
import { createFakeUser } from "../../../utils/tests/createFakeUser";
import { Client } from "../../../prisma/client";
describe.skip("deleteCart", () => {
  let url = "/api/v1/cart/";
  test("delete cart fails if user is not authenticated", async () => {
    let response = await request(app).delete(url);
    expect(response.status).toBe(401);
    expect(response.body.message).toBe(
      "Authentication credentials were not provided."
    );
  });
  test("delete cart works correctly", async () => {
    let { token } = await createFakeUser();
    let response = await request(app)
      .delete(url)
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Cart deleted successfully");
    let currentCartItems = await Client.cartItem.findMany();
    expect(currentCartItems).toHaveLength(0);
  });
});

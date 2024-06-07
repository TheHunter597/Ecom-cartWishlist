import request from "supertest";
import app from "../../../app";
import { createFakeUser } from "../../../utils/tests/createFakeUser";

describe("getCart", () => {
  let url = "/api/v1/cart/";
  test("get cart fails if user is not authenticated", async () => {
    let response = await request(app).get(url);
    expect(response.status).toBe(401);
    expect(response.body.message).toBe(
      "Authentication credentials were not provided."
    );
  });
  test("get cart works correctly", async () => {
    let { token } = await createFakeUser();

    let response = await request(app)
      .get(url)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Cart retrieved successfully");
    expect(response.body.cart).toHaveProperty("id");
    expect(response.body.cart).toHaveProperty("owner");
    expect(response.body.cart).toHaveProperty("createdAt");
    let getCartAgain = await request(app)
      .get(url)
      .set("Authorization", `Bearer ${token}`);
    expect(getCartAgain.status).toBe(200);
    expect(getCartAgain.body.message).toBe("Cart retrieved successfully");
    expect(getCartAgain.body.cart).toHaveProperty("id");
    expect(getCartAgain.body.cart).toHaveProperty("owner");
    expect(getCartAgain.body.cart).toHaveProperty("createdAt");
  });
});

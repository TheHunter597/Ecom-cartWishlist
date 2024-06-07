import request from "supertest";
import app from "../../../app";
import { createFakeUser } from "../../../utils/tests/createFakeUser";
import createFakeProduct from "../../../utils/tests/createFakeProduct";

function createUrl(itemId: string) {
  return `/api/v1/cart/${itemId}`;
}

describe.skip("removeProductFromCart", () => {
  let url = "/api/v1/cart/";
  test("if user is not authenticated, it fails", async () => {
    let response = await request(app).post(createUrl("1"));
    expect(response.status).toBe(401);
    expect(response.body.message).toBe(
      "Authentication credentials were not provided."
    );
  });

  it("should return 400 when product is not found in cart", async () => {
    let { token } = await createFakeUser();
    const response = await request(app)
      .post(createUrl("1"))
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Item not found in cart");
  });

  it("should return 200 when product is removed from cart", async () => {
    let { token } = await createFakeUser();
    let product = await createFakeProduct();
    let productCreationresponse = await request(app)
      .post(`/api/v1/cart/`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        productId: product.id,
        quantity: 1,
      });
    console.log({ mangosdf: productCreationresponse.body.cart.products });

    const response = await request(app)
      .post(createUrl(productCreationresponse.body.cart.products[0].id))
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Item removed from cart");
  });
});

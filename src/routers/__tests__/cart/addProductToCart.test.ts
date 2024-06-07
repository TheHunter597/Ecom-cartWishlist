import request from "supertest";
import app from "../../../app";
import { createFakeUser } from "../../../utils/tests/createFakeUser";
import createFakeProduct from "../../../utils/tests/createFakeProduct";

describe("getCart", () => {
  let url = "/api/v1/cart/";
  test("get cart fails if user is not authenticated", async () => {
    let response = await request(app).post(url);
    expect(response.status).toBe(401);
    expect(response.body.message).toBe(
      "Authentication credentials were not provided."
    );
  });
  test("if inputs are not provided, it fails", async () => {
    let { token } = await createFakeUser();
    let response = await request(app)
      .post(url)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Error while adding products to cart");
    expect(response.body.errors.productId[0]).toBe("This field is required.");
    expect(response.body.errors.quantity[0]).toBe("This field is required.");
  });
  test("if product dosent exist error is returned", async () => {
    let { token } = await createFakeUser();
    let response = await request(app)
      .post(url)
      .send({ productId: "1", quantity: 1 })
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("There is not such product");
  });
  test("if quantity is less than 1, it fails", async () => {
    let { token } = await createFakeUser();
    let newProduct = await createFakeProduct();
    let response = await request(app)
      .post(url)
      .send({ productId: newProduct.id, quantity: -1 })
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Error while adding products to cart");
    expect(response.body.errors.quantity[0]).toBe(
      "Quantity must be greater than 0"
    );
  });
  test("if product exist, it is added to cart", async () => {
    let { token } = await createFakeUser();
    let newProduct = await createFakeProduct();
    let response = await request(app)
      .post(url)
      .send({ productId: newProduct.id, quantity: 1 })
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Product added to cart successfully");
    expect(response.body.cart).toHaveProperty("id");
    expect(response.body.cart).toHaveProperty("owner");
    expect(response.body.cart).toHaveProperty("createdAt");
    expect(response.body.cart.products.length).toBe(1);
  });
  test("if product is already in cart error returns", async () => {
    let { token } = await createFakeUser();
    let newProduct = await createFakeProduct();
    let response = await request(app)
      .post(url)
      .send({ productId: newProduct.id, quantity: 1 })
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Product added to cart successfully");
    expect(response.body.cart).toHaveProperty("id");
    expect(response.body.cart).toHaveProperty("owner");
    expect(response.body.cart).toHaveProperty("createdAt");
    expect(response.body.cart.products.length).toBe(1);
    let response2 = await request(app)
      .post(url)
      .send({ productId: newProduct.id, quantity: 1 })
      .set("Authorization", `Bearer ${token}`);
    expect(response2.status).toBe(400);
    expect(response2.body.message).toBe("Error while adding products to cart");
    expect(response2.body.errors.productId[0]).toBe(
      "Product already exist in cart"
    );
  });
});

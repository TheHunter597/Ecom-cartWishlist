import express from "express";
import cors from "cors";
import { ErrorHandler } from "@mainmicro/jscommonlib";
import dotenv from "dotenv";
import { getCartRouter } from "./routers/cart/getCart";
import { addProductToCartRouter } from "./routers/cart/addProductToCart";
import { removeItemFromCartRouter } from "./routers/cart/removeProductFromCart";
import { deleteCartRouter } from "./routers/cart/deleteCart";
import { getAllProductsRouter } from "./routers/getAllProducts";
import { updateCartItemRouter } from "./routers/cart/updateCartItem";
import { addProductToWishlistRouter } from "./routers/wishlist/addProductToWishlist";
import { deleteWishlistRouter } from "./routers/wishlist/deleteWishlist";
import { getWishlistRouter } from "./routers/wishlist/getWishlist";
import { removeItemFromWishlistRouter } from "./routers/wishlist/removeProductFromWishlist";
import { healthCheckRouter } from "./routers/health";

if (process.env.ENV != "PRODUCTION") {
  dotenv.config();
}

let app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://frontend:3000",
  })
);

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not defined");
}

app.use(getAllProductsRouter);
/////
app.use(getCartRouter);
app.use(removeItemFromCartRouter);
app.use(updateCartItemRouter);
app.use(addProductToCartRouter);
app.use(deleteCartRouter);
////
app.use(addProductToWishlistRouter);
app.use(deleteWishlistRouter);
app.use(getWishlistRouter);
app.use(removeItemFromWishlistRouter);

app.use(ErrorHandler);
app.use(healthCheckRouter);

export default app;

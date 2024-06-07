import { NextFunction, Request, Response, Router } from "express";
import { Client } from "../../prisma/client";
import {
  BadRequest,
  NotFound,
  checkUserAuthenticated,
  validateInput,
} from "@mainmicro/jscommonlib";
import setRedisElement from "../../utils/redis/setRedisElement";
import cartFinder from "../../utils/cartFinder";

let router = Router();

async function addProductToCart(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let cart = await cartFinder(req.user.user_id);
    console.log({ cart });

    if (req.body.quantity < 1) {
      return next(
        new BadRequest("Error while adding products to cart", {
          quantity: ["Quantity must be greater than 0"],
        })
      );
    }
    if (req.body.quantity > 20) {
      return next(new BadRequest("Quantity must be less than 20"));
    }
    let product = await Client.product.findUnique({
      where: {
        id: req.body.productId,
      },
      include: {
        colors: true,
        sizes: true,
      },
    });

    if (!product) {
      return next(new NotFound("There is not such product"));
    }
    let colorExist = await Client.productColor.findFirst({
      where: {
        id: req.body.color,
      },
    });
    let sizeExist = await Client.productSize.findFirst({
      where: {
        id: req.body.size,
      },
    });

    if (!colorExist) {
      return next(new BadRequest("There is not such color"));
    }

    let doseCartItemExist = await Client.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: req.body.productId,
      },
    });

    if (doseCartItemExist) {
      return next(new BadRequest("Product already in cart"));
    }
    await Client.cartItem.create({
      data: {
        cartId: cart.id,
        productId: req.body.productId,
        quantity: req.body.quantity,
        sizeId: sizeExist ? req.body.size : undefined,
        colorId: req.body.color,
      },
    });

    cart = await Client.cart.findUnique({
      where: {
        owner: req.user.user_id,
      },
      include: {
        products: {
          include: {
            product: true,
            color: true,
            size: true,
          },
        },
      },
    });
    await setRedisElement({
      name: `${req.user.user_id}-cart`,
      data: cart,
    });
    res
      .status(200)
      .json({ message: "Product added to cart successfully", cart });
  } catch (e) {
    console.log({ e });

    return next(e);
  }
}

router.post(
  "/api/v1/cart/",
  checkUserAuthenticated,
  validateInput(
    ["productId", "quantity"],
    "Error while adding products to cart"
  ),
  addProductToCart
);

export { router as addProductToCartRouter };

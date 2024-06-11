import { NextFunction, Router, Request, Response } from "express";
import { Client } from "../../prisma/client";
import {
  BadRequest,
  NotFound,
  ValidationError,
  checkUserAuthenticated,
  validateInput,
} from "@mainmicro/jscommonlib";
import redisClient from "../../utils/redisClient";
import setRedisElement from "../../utils/redis/setRedisElement";

let router = Router();

async function removeItemFromCart(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let cart: any = await redisClient.get(`${req.user.user_id}-cart`);

    if (!cart || cart === "null") {
      cart = await Client.cart.findUnique({
        where: {
          owner: req.user.user_id,
        },
      });
    }
    if (!cart) {
      return next(new NotFound("No cart found"));
    }
    let item = await Client.cartItem.findUnique({
      where: {
        id: req.params.id,
      },
    });
    if (!item) {
      return next(new NotFound("Item not found in cart"));
    }
    await Client.cartItem.delete({
      where: {
        id: req.params.id,
      },
    });
    let updatedCart = await Client.cart.findUnique({
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
      data: updatedCart,
    });
    return res
      .status(200)
      .json({ message: "Item removed from cart", cart: updatedCart });
  } catch (error: any) {
    return next(new ValidationError(error));
  }
}

router.delete("/api/v1/cart/:id/", checkUserAuthenticated, removeItemFromCart);

export { router as removeItemFromCartRouter };

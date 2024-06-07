import { NextFunction, Router, Request, Response } from "express";
import { Client } from "../../prisma/client";
import {
  BadRequest,
  NotFound,
  checkUserAuthenticated,
} from "@mainmicro/jscommonlib";
import redisClient from "../../utils/redisClient";
import setRedisElement from "../../utils/redis/setRedisElement";
let router = Router();

async function updateCartItem(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.params.id) {
      return next(new BadRequest("Id is required"));
    }
    let data = await redisClient.get(`${req.user.user_id}-cart`);
    let cart = data ? JSON.parse(data) : null;
    if (!cart || cart === "null") {
      cart = await Client.cart.findUnique({
        where: {
          owner: req.user.user_id,
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
      return next(new NotFound("Cart not found"));
    }
    if (req.body.quantity < 1) {
      return next(
        new BadRequest("Error while adding products to cart", {
          quantity: ["Quantity must be greater than 0"],
        })
      );
    }
    if (req.body.quantity > 20) {
      return next(new BadRequest("Quantity must be less than 10"));
    }
    if (req.body.productId) {
      return next(new BadRequest("You cant update product id"));
    }

    let cartItem = await Client.cartItem.findUnique({
      where: {
        id: req.params.id,
      },
    });
    if (!cartItem) {
      return next(new NotFound("Cart item not found"));
    }
    cartItem = await Client.cartItem.update({
      where: {
        id: req.params.id,
      },
      data: req.body,
      include: {
        product: true,
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

    res.status(200).json({
      message: "cart Item updated successfully",
      cartItem,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

router.put("/api/v1/cart/:id/", checkUserAuthenticated, updateCartItem);

export { router as updateCartItemRouter };

import { NextFunction, Router, Request, Response } from "express";
import { Client } from "../../prisma/client";
import { checkUserAuthenticated } from "@mainmicro/jscommonlib";
import redisClient from "../../utils/redisClient";
import setRedisElement from "../../utils/redis/setRedisElement";
let router = Router();

async function getCart(req: Request, res: Response, next: NextFunction) {
  try {
    let redisCart = await redisClient.get(`${req.user.user_id}-cart`);
    if (redisCart) {
      let cart = JSON.parse(redisCart);
      res.status(200).json({ message: "Cart retrieved successfully", cart });
      return;
    }
    let cart = await Client.cart.findUnique({
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

    if (!cart) {
      cart = await Client.cart.create({
        data: {
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
    }
    await setRedisElement({
      name: `${req.user.user_id}-cart`,
      data: cart,
    });
    res.status(200).json({
      message: "Cart retrieved successfully",
      cart,
    });
  } catch (err) {
    console.log({ err });
    res.status(500).json({ message: "Internal server error" });
  }
}

router.get("/api/v1/cart/", checkUserAuthenticated, getCart);

export { router as getCartRouter };

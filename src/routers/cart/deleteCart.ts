import { NextFunction, Request, Response, Router } from "express";
import { Client } from "../../prisma/client";
import {
  BadRequest,
  NotFound,
  checkUserAuthenticated,
} from "@mainmicro/jscommonlib";
import redisClient from "../../utils/redisClient";

let router = Router();

async function deleteCart(req: Request, res: Response, next: NextFunction) {
  try {
    let cart = await Client.cart.findUnique({
      where: {
        owner: req.user.user_id,
      },
    });

    if (!cart) {
      return next(new NotFound("No cart found"));
    }
    await redisClient.del(`${req.user.user_id}-cart`);

    await Client.cart.delete({
      where: {
        id: cart.id,
      },
    });
    await redisClient.del(req.user.user_id);
    return res.status(200).json({ message: "Cart deleted successfully" });
  } catch (error: any) {
    return next(new BadRequest(error));
  }
}

router.delete("/api/v1/cart/", checkUserAuthenticated, deleteCart);

export { router as deleteCartRouter };

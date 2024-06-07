import { NextFunction, Router, Request, Response } from "express";
import { Client } from "../../prisma/client";
import {
  NotFound,
  ValidationError,
  checkUserAuthenticated,
} from "@mainmicro/jscommonlib";
import redisClient from "../../utils/redisClient";

let router = Router();

async function removeItemFromWishlist(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let wishlist: any = await redisClient.get(`${req.user.user_id}-wishlist`);

    if (!wishlist || wishlist === "null") {
      wishlist = await Client.wishlist.findUnique({
        where: {
          owner: req.user.user_id,
        },
      });
    }
    if (!wishlist) {
      return next(new NotFound("No wishlist found"));
    }

    let item = await Client.wishlistItem.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!item) {
      return next(new NotFound("Item not found in wishlist"));
    }
    await Client.wishlistItem.delete({
      where: {
        id: req.params.id,
      },
    });
    let updatedWishlist = await Client.wishlist.findUnique({
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
    await redisClient.set(
      `${req.user.user_id}-wishlist`,
      JSON.stringify(updatedWishlist),
      "EX",
      60 * 60
    );
    return res.status(200).json({
      message: "Item removed from wishlist",
      wishlist: updatedWishlist,
    });
  } catch (error: any) {
    return next(new ValidationError(error));
  }
}

router.post(
  "/api/v1/wishlist/:id/",
  checkUserAuthenticated,
  removeItemFromWishlist
);

export { router as removeItemFromWishlistRouter };

import { NextFunction, Router, Request, Response } from "express";
import { Client } from "../../prisma/client";
import { checkUserAuthenticated } from "@mainmicro/jscommonlib";
import redisClient from "../../utils/redisClient";
let router = Router();

async function getWishList(req: Request, res: Response, next: NextFunction) {
  try {
    let wishlist: any = await redisClient.get(`${req.user.user_id}-wishlist`);

    if (wishlist) {
      wishlist = JSON.parse(wishlist);
      res.status(200).json({
        message: "wishlist retrieved successfully",
        wishlist: wishlist,
      });
      return;
    }

    let populatedwishlist = await Client.wishlist.findUnique({
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

    if (!populatedwishlist) {
      populatedwishlist = await Client.wishlist.create({
        data: {
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

    await redisClient.set(
      `${req.user.user_id}-wishlist`,
      JSON.stringify(populatedwishlist),
      "EX",
      parseInt(process.env.REDIS_EXPIRY as string) || 3600
    );
    let test = await redisClient.get(`${req.user.user_id}-wishlist`);

    res.status(200).json({
      message: "Wishlist retrieved successfully",
      wishlist: populatedwishlist,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

router.get("/api/v1/wishlist/", checkUserAuthenticated, getWishList);

export { router as getWishlistRouter };

import { NextFunction, Request, Response, Router } from "express";
import { Client } from "../../prisma/client";
import {
  BadRequest,
  NotFound,
  checkUserAuthenticated,
  validateInput,
} from "@mainmicro/jscommonlib";
import redisClient from "../../utils/redisClient";

let router = Router();

async function addProductToWishlist(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let wishlist: any = await redisClient.get(`${req.user.user_id}-wishlist`);
    if (wishlist) {
      wishlist = JSON.parse(wishlist);
    }
    if (!wishlist || wishlist === "null") {
      wishlist = await Client.wishlist.findUnique({
        where: {
          owner: req.user.user_id,
        },
      });
    }

    if (!wishlist) {
      wishlist = await Client.wishlist.create({
        data: {
          owner: req.user.user_id,
        },
      });
    }

    let product = await Client.product.findUnique({
      where: {
        id: req.body.productId,
      },
    });

    if (!product) {
      return next(new NotFound("There is not such product"));
    }
    let doesProductExist = await Client.wishlistItem.findFirst({
      where: {
        productId: req.body.productId,
        wishlistId: wishlist.id,
      },
    });
    console.log({ doesProductExist });

    if (doesProductExist != null) {
      return next(new BadRequest("Product already exists in wishlist"));
    }

    await Client.wishlistItem.create({
      data: {
        wishlistId: wishlist.id,
        productId: req.body.productId,
      },
    });
    wishlist = await Client.wishlist.findUnique({
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
      JSON.stringify(wishlist),
      "EX",
      parseInt(process.env.REDIS_EXPIRY as string)
    );
    res
      .status(200)
      .json({ message: "Product added to wishlist successfully", wishlist });
  } catch (e) {
    console.log({ e });

    return next(e);
  }
}

router.post(
  "/api/v1/wishlist/",
  checkUserAuthenticated,
  validateInput(["productId"], "Error while adding products to wishlist"),
  addProductToWishlist
);

export { router as addProductToWishlistRouter };

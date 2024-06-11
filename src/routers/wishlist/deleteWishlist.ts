import { NextFunction, Request, Response, Router } from "express";
import { Client } from "../../prisma/client";
import {
  BadRequest,
  NotFound,
  checkUserAuthenticated,
} from "@mainmicro/jscommonlib";
import redisClient from "../../utils/redisClient";

let router = Router();

async function deleteWishlist(req: Request, res: Response, next: NextFunction) {
  try {
    let wishlist = await Client.wishlist.findUnique({
      where: {
        owner: req.user.user_id,
      },
    });
    if (!wishlist) {
      return next(new NotFound("No wishlist found"));
    }
    await Client.wishlist.delete({
      where: {
        id: wishlist.id,
      },
    });
    await redisClient.del(req.user.user_id);
    return res.status(200).json({ message: "Wishlist deleted successfully" });
  } catch (error: any) {
    return next(new BadRequest(error));
  }
}

router.delete("/api/v1/wishlist/", checkUserAuthenticated, deleteWishlist);

export { router as deleteWishlistRouter };

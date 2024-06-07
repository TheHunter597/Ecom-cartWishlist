import { NextFunction, Request, Response, Router } from "express";

let router = Router();

async function healthCheck(req: Request, res: Response, next: NextFunction) {
  return res.status(200).json({
    message: "Ok.",
  });
}

router.get("/health/", healthCheck);

export { router as healthCheckRouter };

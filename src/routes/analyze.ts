import { Router, Request, Response } from "express";
import { analyzeController } from "../controllers/analyzeController";
import { asyncHandler } from "../middleware";

export const analyzeRouter = Router();

analyzeRouter.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    await analyzeController.analyze(req, res);
  })
);

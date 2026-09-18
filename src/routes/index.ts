import { Router } from "express";
import { analyzeRouter } from "./analyze";
import { healthRouter } from "./health";

const router = Router();

router.use("/health", healthRouter);
router.use("/analyze", analyzeRouter);

export default router;

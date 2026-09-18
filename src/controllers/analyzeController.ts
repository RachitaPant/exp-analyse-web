import { Request, Response } from "express";
import { validateAnalyzeRequest } from "@/utils/validation";
import { AppError } from "@/middleware";
import { analyzeService } from "@/services/analyzeService";
import { logger } from "@/utils/logger";

export const analyzeController = {
  analyze: async (req: Request, res: Response) => {
    const validation = validateAnalyzeRequest(req.body);

    if (!validation.valid) {
      throw new AppError(400, validation.error || "Invalid request");
    }

    const url = validation.url!;
    logger.info("Analyzing URL", { url });

    const result = await analyzeService.analyzeUrl(url);

    logger.info("Analysis complete", { url });
    res.json(result);
  },
};

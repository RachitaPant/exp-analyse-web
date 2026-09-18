import { pageSpeedService } from "./pageSpeedService";
import { transformPageSpeedData } from "./transformPageSpeedData";
import { AnalysisData } from "../types";
import { logger } from "../utils/logger";

export const analyzeService = {
  analyzeUrl: async (url: string): Promise<AnalysisData> => {
    try {
      logger.debug("Fetching PageSpeed data", { url });

      const pageSpeedData = await pageSpeedService.analyzeUrl(url);

      logger.debug("Transforming PageSpeed data", { url });

      const transformedData = transformPageSpeedData(pageSpeedData);

      return {
        ...transformedData,
        url,
      };
    } catch (error) {
      logger.error("Error analyzing URL", error);
      throw error;
    }
  },
};

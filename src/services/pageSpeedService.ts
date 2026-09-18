import axios from "axios";
import { config } from "../config";
import { AppError } from "../middleware";
import { logger } from "../utils/logger";

const PAGESPEED_API_URL =
  "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

interface PageSpeedResponse {
  lighthouseResult: {
    audits: Record<string, any>;
    categories: Record<string, any>;
  };
}

export const pageSpeedService = {
  analyzeUrl: async (url: string): Promise<PageSpeedResponse> => {
    if (!config.googlePageSpeedApiKey) {
      throw new AppError(
        500,
        "Google PageSpeed API key is not configured"
      );
    }

    try {
      const response = await axios.get<PageSpeedResponse>(PAGESPEED_API_URL, {
        params: {
          url,
          key: config.googlePageSpeedApiKey,
          category: ["performance", "accessibility", "best-practices", "seo"],
          strategy: "mobile",
        },
        timeout: 60000,
      });

      return response.data;
    } catch (error) {
      logger.error("PageSpeed API error", error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          throw new AppError(400, "Invalid URL or PageSpeed API error");
        }
        if (error.response?.status === 429) {
          throw new AppError(429, "Rate limit exceeded. Please try again later.");
        }
        if (error.code === "ECONNABORTED") {
          throw new AppError(504, "Request timeout. The URL took too long to analyze.");
        }
      }

      throw new AppError(
        500,
        "Failed to analyze URL with PageSpeed API"
      );
    }
  },
};

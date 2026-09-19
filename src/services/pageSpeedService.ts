import axios from "axios";
import qs from "querystring";
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

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1500;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchPageSpeedData = async (
  url: string,
  attempt = 0
): Promise<PageSpeedResponse> => {
  try {
    const response = await axios.get<PageSpeedResponse>(PAGESPEED_API_URL, {
      params: {
        url,
        key: config.googlePageSpeedApiKey,
        category: ["performance", "accessibility", "best-practices", "seo"],
        strategy: "mobile",
      },
      paramsSerializer: (params) =>
        qs.stringify(params, undefined, undefined, {
          encodeURIComponent: encodeURIComponent,
        }),
      timeout: 60000,
    });

    return response.data;
  } catch (error) {
    const isRateLimited =
      axios.isAxiosError(error) && error.response?.status === 429;

    if (isRateLimited && attempt < MAX_RETRIES) {
      const delay = RETRY_DELAY_MS * (attempt + 1);
      logger.warn(
        `PageSpeed API rate limited, retrying in ${delay}ms (attempt ${
          attempt + 1
        }/${MAX_RETRIES})`
      );
      await sleep(delay);
      return fetchPageSpeedData(url, attempt + 1);
    }

    throw error;
  }
};

export const pageSpeedService = {
  analyzeUrl: async (url: string): Promise<PageSpeedResponse> => {
    if (!config.googlePageSpeedApiKey) {
      throw new AppError(
        500,
        "Analysis service is not configured. Please contact support."
      );
    }

    try {
      return await fetchPageSpeedData(url);
    } catch (error) {
      logger.error("PageSpeed API error", error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          throw new AppError(
            400,
            "We couldn't analyze that URL. Please check it's a valid, publicly accessible website."
          );
        }
        if (error.response?.status === 429) {
          throw new AppError(
            429,
            "We're getting a lot of requests right now. Please wait a moment and try again."
          );
        }
        if (
          error.code === "ECONNABORTED" ||
          error.code === "ETIMEDOUT"
        ) {
          throw new AppError(
            504,
            "This site is taking too long to analyze. It may be slow or unreachable — try again or use a different URL."
          );
        }
        if (error.response?.status === 403) {
          throw new AppError(
            500,
            "Analysis service authentication failed. Please contact support."
          );
        }
      }

      throw new AppError(
        500,
        "Something went wrong while analyzing this website. Please try again in a moment."
      );
    }
  },
};

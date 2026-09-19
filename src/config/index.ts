import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config();

export const config = {
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "8080", 10),
  logLevel: process.env.LOG_LEVEL || "info",
  googlePageSpeedApiKey: process.env.GOOGLE_PAGESPEED_API_KEY,
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  rateLimiting: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100", 10),
  },
};

if (!config.googlePageSpeedApiKey) {
  console.warn(
    "Warning: GOOGLE_PAGESPEED_API_KEY is not set. The API will fail."
  );
}

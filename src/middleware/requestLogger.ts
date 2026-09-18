import morgan from "morgan";
import { logger } from "@/utils/logger";

morgan.token("body", (req: any) => {
  return JSON.stringify(req.body);
});

export const requestLogger = morgan((tokens, req, res) => {
  const status = tokens.status(req, res);
  const method = tokens.method(req, res);
  const url = tokens.url(req, res);
  const responseTime = tokens["response-time"](req, res);

  const logData = {
    method,
    url,
    status,
    responseTime: `${responseTime}ms`,
    timestamp: new Date().toISOString(),
  };

  if (parseInt(status) >= 400) {
    logger.warn(`HTTP ${status}`, logData);
  } else {
    logger.info(`HTTP ${status}`, logData);
  }

  return "";
});

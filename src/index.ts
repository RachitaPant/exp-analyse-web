import express, { Express, Request, Response } from "express";
import { config } from "./config";
import { corsMiddleware, requestLogger, errorHandler } from "./middleware";
import routes from "./routes";
import { logger } from "./utils/logger";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(corsMiddleware);
app.use(requestLogger);

app.use("/api", routes);

app.get("/", (req: Request, res: Response) => {
  res.json({
    name: "Web Performance Backend",
    version: "1.0.0",
    endpoints: {
      health: "GET /api/health",
      analyze: "POST /api/analyze",
    },
  });
});

app.use(errorHandler);

app.listen(config.port, () => {
  logger.info(
    `🚀 Server running on http://localhost:${config.port} (${config.env})`
  );
});

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection", reason);
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception", error);
  process.exit(1);
});

import cors from "cors";
import { config } from "@/config";

export const corsMiddleware = cors({
  origin: config.corsOrigin.split(",").map((o) => o.trim()),
  credentials: true,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
});

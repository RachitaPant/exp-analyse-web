import { config } from "@/config";

type LogLevel = "debug" | "info" | "warn" | "error";

const logLevelMap: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const currentLogLevel =
  logLevelMap[config.logLevel as LogLevel] || logLevelMap.info;

const formatTimestamp = () => new Date().toISOString();

const shouldLog = (level: LogLevel): boolean => {
  return logLevelMap[level] >= currentLogLevel;
};

export const logger = {
  debug: (message: string, data?: unknown) => {
    if (shouldLog("debug")) {
      console.log(`[${formatTimestamp()}] [DEBUG] ${message}`, data || "");
    }
  },

  info: (message: string, data?: unknown) => {
    if (shouldLog("info")) {
      console.log(`[${formatTimestamp()}] [INFO] ${message}`, data || "");
    }
  },

  warn: (message: string, data?: unknown) => {
    if (shouldLog("warn")) {
      console.warn(`[${formatTimestamp()}] [WARN] ${message}`, data || "");
    }
  },

  error: (message: string, error?: unknown) => {
    if (shouldLog("error")) {
      console.error(`[${formatTimestamp()}] [ERROR] ${message}`, error || "");
    }
  },
};

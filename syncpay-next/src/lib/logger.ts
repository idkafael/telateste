import { env } from "./config";

type Level = "debug" | "info" | "warn" | "error";

const order: Record<Level, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

function shouldLog(level: Level) {
  return order[level] >= order[env.LOG_LEVEL];
}

export const logger = {
  debug: (msg: string, meta?: unknown) => shouldLog("debug") && console.log(msg, meta ?? ""),
  info: (msg: string, meta?: unknown) => shouldLog("info") && console.log(msg, meta ?? ""),
  warn: (msg: string, meta?: unknown) => shouldLog("warn") && console.warn(msg, meta ?? ""),
  error: (msg: string, meta?: unknown) => shouldLog("error") && console.error(msg, meta ?? ""),
};


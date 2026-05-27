import winston from "winston"
import { env } from "./env"

type LogLevel = "error" | "warn" | "info" | "http" | "debug"

const levels: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
}

const colors: Record<LogLevel, string> = {
  error: "red",
  warn: "yellow",
  info: "blue",
  http: "magenta",
  debug: "white",
}

const level: LogLevel =
  env.LOG_LEVEL ?? (env.NODE_ENV === "development" ? "debug" : "warn")

winston.addColors(colors)

const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    ({ timestamp, level, message, ...meta }) =>
      `[${timestamp}] ${level}: ${message}${Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : ""}`
  )
)

export const logger = winston.createLogger({
  level,
  levels,
  format,
  transports: [new winston.transports.Console({ format })],
})

export default logger

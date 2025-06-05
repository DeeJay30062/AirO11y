// server/lib/logger.js
import winston from "winston";

const { combine, timestamp, printf, colorize, metadata } = winston.format;

const logFormat = printf(({ level, message, timestamp, metadata }) => {
  return `${timestamp} [${level}] ${message} ${
    metadata && Object.keys(metadata).length ? JSON.stringify(metadata) : ""
  }`;
});

const logger = winston.createLogger({
  level: "info",
  format: combine(
    timestamp(),
    metadata({ fillExcept: ["message", "level", "timestamp"] }), 
    logFormat
  ),
  transports: [
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp(),
        metadata({ fillExcept: ["message", "level", "timestamp"] }), 
        logFormat
      ),
    }),
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

export default logger;


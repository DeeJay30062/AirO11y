// middleware/requestLogger.js
import logger from '../lib/logger.js';

const requestLogger = (req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.originalUrl}`, {
    headers: req.headers,
    body: req.body
  });
  next();
};

export default requestLogger;

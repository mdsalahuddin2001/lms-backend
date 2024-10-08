const logger = require("../../libraries/log/logger");

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch((error) => {
    logger.error(`${error.name || "Error From Async Handler:"}`, error);
    next(error);
  });

module.exports = asyncHandler;

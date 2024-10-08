const createError = require("http-errors");

const logger = require("../../libraries/log/logger");
const { errorResponse } = require("../../libraries/common/sendResponse");

const errorHandlerMiddleware = (err, req, res, next) => {
  let error = { ...err, statusCode: err.HTTPStatus };

  error.message = err.message;
  // Log to console for dev
  logger.error("error", error);

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = `Resource not found`;
    error = {
      ...error,
      statusCode: 404,
      message,
    };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(error.keyValue)[0]; // Extracts the duplicate key (e.g., 'email')
    const message = `Duplicate field value for ${field}`;
    error = {
      ...error,
      statusCode: 400,
      message,
    };
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new createError(400, message);
  }

  errorResponse(res, { statusCode: error.statusCode, message: error.message });
};

module.exports = errorHandlerMiddleware;

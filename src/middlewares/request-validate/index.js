const { errorResponse } = require("../../libraries/common/sendResponse");
const logger = require("../../libraries/log/logger");

function validateRequest({ schema, isParam = false }) {
  return (req, res, next) => {
    const input = isParam ? req.params : req.body;
    const validationResult = schema.validate(input, { abortEarly: false });
    const { error } = validationResult;
    if (validationResult.error) {
      logger.error(`${req.method} ${req.originalUrl} Validation failed`, {
        errors: validationResult.error.details.map((detail) => detail.message),
      });
      const errorMessages = validationResult.error.details.map((detail) => {
        return detail.message;
      });

      // Initialize an empty object for the structured errors
      const errors = {};

      // Loop through each validation error and restructure it
      error.details.forEach((err) => {
        // Split the path (e.g., "test.testName") to handle nested objects
        const path = err.path.join(".");

        // Use reduce to build a nested object from the path
        path.split(".").reduce((acc, part, index, array) => {
          if (index === array.length - 1) {
            // At the last part of the path, set the error message
            acc[part] = err.message;
          } else {
            // If it's not the last part, ensure the object exists
            acc[part] = acc[part] || {};
          }
          return acc[part];
        }, errors);
      });

      errorResponse(res, {
        statusCode: 400,
        message: errorMessages[0],
        errorObj: errors,
      });
    }

    // Validation successful - proceed
    next();
  };
}

module.exports = { validateRequest };

const Joi = require("joi");
const { AppError } = require("../error-handling/AppError");
const logger = require("../log/logger");

/**
 * Creates a standardized getter function for a domain
 * @param {Object} options - Configuration options
 * @returns {Object} Object containing getter function and validation schema
 */
const createDomainGetter = (options) => {
  const {
    model, // Mongoose model
    modelName, // String name of the model (for logging)
    searchFields = [], // Fields to perform text search on
    allowedFilters = [], // Additional filter fields
    defaultSort = "createdAt", // Default sort field
    allowedSortFields = ["createdAt"], // Fields that can be sorted
    transformResult, // Optional function to transform results before returning
    baseQuery = {}, // Base query to apply to all requests
  } = options;

  // Create validation schema
  const createValidationSchema = () => {
    const filterSchemas = {};
    allowedFilters.forEach((filter) => {
      if (typeof filter === "string") {
        filterSchemas[filter] = Joi.any();
      } else if (typeof filter === "object") {
        const { name, schema } = filter;
        filterSchemas[name] = schema;
      }
    });

    return Joi.object({
      search: Joi.string().allow(""),
      sortBy: Joi.string()
        .valid(...allowedSortFields)
        .default(defaultSort),
      sortOrder: Joi.string().valid("asc", "desc").default("desc"),
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(10),
      ...filterSchemas,
    });
  };

  // Create the getter function
  const getter = async (queryParams = {}) => {
    try {
      const {
        search,
        sortBy = defaultSort,
        sortOrder = "desc",
        page = 1,
        limit = 10,
        ...filters
      } = queryParams;

      // Build query
      const query = { isDeleted: false, ...baseQuery };

      // Add search conditions
      if (search && searchFields.length > 0) {
        query.$or = searchFields.map((field) => ({
          [field]: { $regex: search, $options: "i" },
        }));
      }

      // Add filters
      allowedFilters.forEach((filter) => {
        const filterName = typeof filter === "string" ? filter : filter.name;
        if (filters[filterName] !== undefined) {
          query[filterName] = filters[filterName];
        }
      });

      // Calculate skip value for pagination
      const skip = (page - 1) * limit;

      // Prepare sort object
      const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };
      console.log("query", query);
      // Execute query
      const [data, total] = await Promise.all([
        model.find(query).sort(sort).skip(skip).limit(limit).lean(),
        model.countDocuments(query),
      ]);

      // Transform results if transformer function provided
      const transformedData = transformResult ? transformResult(data) : data;

      const result = {
        data: transformedData,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };

      logger.info(`get${modelName}s(): ${modelName}s fetched`, {
        count: data.length,
        total,
        page,
        limit,
      });

      return result;
    } catch (error) {
      logger.error(`get${modelName}s(): Failed to fetch ${modelName}s`, error);
      throw new AppError(`Failed to fetch ${modelName}s`, error.message);
    }
  };

  return {
    getter,
    validationSchema: createValidationSchema(),
  };
};

module.exports = {
  createDomainGetter,
};

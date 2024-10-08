const express = require("express");
const logger = require("../../libraries/log/logger");
const { AppError } = require("../../libraries/error-handling/AppError");
const asyncHandler = require("../../middlewares/async-handler");

const {
  create,
  search,
  getById,
  updateById,
  deleteById,
} = require("./service");

const { createSchema, updateSchema, idSchema } = require("./validation");
const { validateRequest } = require("../../middlewares/request-validate");
const { logRequest } = require("../../middlewares/log");

const model = "Category";

// CRUD for entity
const routes = () => {
  const router = express.Router();
  logger.info(`Setting up routes for model`);

  router.get(
    "/",
    logRequest({}),
    asyncHandler(async (req, res, next) => {
      // TODO: Add pagination and filtering
      const items = await search(req.query);
      res.json(items);
    })
  );

  router.post(
    "/",
    logRequest({}),
    validateRequest({ schema: createSchema }),
    asyncHandler(async (req, res, next) => {
      const item = await create(req.body);
      res.status(201).json(item);
    })
  );

  router.get(
    "/:id",
    logRequest({}),
    validateRequest({ schema: idSchema, isParam: true }),
    asyncHandler(async (req, res, next) => {
      const item = await getById(req.params.id);
      if (!item) {
        throw new AppError(`model not found`, `model not found`, 404);
      }
      res.status(200).json(item);
    })
  );

  router.put(
    "/:id",
    logRequest({}),
    validateRequest({ schema: idSchema, isParam: true }),
    validateRequest({ schema: updateSchema }),
    asyncHandler(async (req, res, next) => {
      const item = await updateById(req.params.id, req.body);
      if (!item) {
        throw new AppError(`model not found`, `model not found`, 404);
      }
      res.status(200).json(item);
    })
  );

  router.delete(
    "/:id",
    logRequest({}),
    validateRequest({ schema: idSchema, isParam: true }),
    asyncHandler(async (req, res, next) => {
      await deleteById(req.params.id);
      res.status(204).json({ message: `model is deleted` });
    })
  );

  return router;
};

module.exports = { routes };

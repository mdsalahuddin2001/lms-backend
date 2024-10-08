const express = require("express");
const logger = require("../../libraries/log/logger");
const { AppError } = require("../../libraries/error-handling/AppError");

const {
  search,
  getById,
  updateById,
  deleteById,
  register,
  loginUserWithEmailAndPassword,
} = require("./service");

const {
  updateSchema,
  idSchema,
  registerSchema,
  loginSchema,
} = require("./validation");
const { validateRequest } = require("../../middlewares/request-validate");
const { logRequest } = require("../../middlewares/log");
const asyncHandler = require("../../middlewares/async-handler");
const { generateAuthTokens } = require("../token/service");

// CRUD for entity
const routes = () => {
  const router = express.Router();
  logger.info(`Setting up routes for model`);

  router.post(
    "/register",
    logRequest({}),
    validateRequest({ schema: registerSchema }),
    asyncHandler(async (req, res, next) => {
      const item = await register(req.body);
      res.status(201).json(item);
    })
  );
  router.post(
    "/login",
    logRequest({}),
    validateRequest({ schema: loginSchema }),
    asyncHandler(async (req, res, next) => {
      const { email, password } = req.body;
      const user = await loginUserWithEmailAndPassword(email, password);
      const tokens = await generateAuthTokens(user);
      res.send({ user, tokens });
    })
  );
  router.get(
    "/:id",
    logRequest({}),
    validateRequest({ schema: idSchema, isParam: true }),
    async (req, res, next) => {
      try {
        const item = await getById(req.params.id);
        if (!item) {
          throw new AppError(`model not found`, `model not found`, 404);
        }
        res.status(200).json(item);
      } catch (error) {
        next(error);
      }
    }
  );

  router.put(
    "/:id",
    logRequest({}),
    validateRequest({ schema: idSchema, isParam: true }),
    validateRequest({ schema: updateSchema }),
    async (req, res, next) => {
      try {
        const item = await updateById(req.params.id, req.body);
        if (!item) {
          throw new AppError(`model not found`, `model not found`, 404);
        }
        res.status(200).json(item);
      } catch (error) {
        next(error);
      }
    }
  );

  router.delete(
    "/:id",
    logRequest({}),
    validateRequest({ schema: idSchema, isParam: true }),
    async (req, res, next) => {
      try {
        await deleteById(req.params.id);
        res.status(204).json({ message: `model is deleted` });
      } catch (error) {
        next(error);
      }
    }
  );

  return router;
};

module.exports = { routes };

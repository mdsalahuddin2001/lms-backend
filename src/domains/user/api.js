const express = require("express");
const logger = require("../../libraries/log/logger");
const { AppError } = require("../../libraries/error-handling/AppError");
const {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getUsers,
} = require("./service");
const {
  createUserSchema,
  updateUserSchema,
  idSchema,
  getUsersSchema,
} = require("./validation");
const { validateRequest } = require("../../middlewares/request-validate");
const { logRequest } = require("../../middlewares/log");
const asyncHandler = require("../../middlewares/async-handler");

const routes = () => {
  const router = express.Router();
  logger.info(`Setting up routes for user`);

  router.get(
    "/",
    logRequest({}),
    validateRequest({ schema: getUsersSchema, isQuery: true }),
    asyncHandler(async (req, res) => {
      const result = await getUsers(req.query);
      res.status(200).json(result);
    })
  );

  router.post(
    "/",
    logRequest({}),
    validateRequest({ schema: createUserSchema }),
    asyncHandler(async (req, res) => {
      const user = await createUser(req.body);
      res.status(201).json(user);
    })
  );

  router.get(
    "/:id",
    logRequest({}),
    validateRequest({ schema: idSchema, isParam: true }),
    asyncHandler(async (req, res) => {
      const user = await getUserById(req.params.id);
      if (!user) {
        throw new AppError("User not found", "User not found", 404);
      }
      res.status(200).json(user);
    })
  );

  router.put(
    "/:id",
    logRequest({}),
    validateRequest({ schema: idSchema, isParam: true }),
    validateRequest({ schema: updateUserSchema }),
    asyncHandler(async (req, res) => {
      const user = await updateUser(req.params.id, req.body);
      if (!user) {
        throw new AppError("User not found", "User not found", 404);
      }
      res.status(200).json(user);
    })
  );

  router.delete(
    "/:id",
    logRequest({}),
    validateRequest({ schema: idSchema, isParam: true }),
    asyncHandler(async (req, res) => {
      await deleteUser(req.params.id);
      res.status(204).json({ message: "User is deleted" });
    })
  );

  return router;
};

module.exports = { routes };

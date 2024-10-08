const Joi = require("joi");
const mongoose = require("mongoose");
const { password, objectId } = require("../../libraries/common/validation");

const createSchema = Joi.object().keys({
  email: Joi.string().required().email(),
  password: Joi.string().required().custom(password),
  name: Joi.string().required(),
});

const searchSchema = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getOneSchema = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateSchema = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
    })
    .min(1),
};

const deleteSchema = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const idSchema = Joi.object().keys({
  id: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    }, "ObjectId validation")
    .required(),
});

module.exports = {
  createSchema,
  updateSchema,
  searchSchema,
  getOneSchema,
  deleteSchema,
  idSchema,
};

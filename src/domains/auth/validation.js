const Joi = require("joi");
const mongoose = require("mongoose");
const { password } = require("../../libraries/common/validation");

const registerSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required().custom(password),
  name: Joi.string().required(),
});
const loginSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required(),
});
const updateSchema = Joi.object().keys({
  name: Joi.string(),
  // other properties
});

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

module.exports = { registerSchema, loginSchema, updateSchema, idSchema };

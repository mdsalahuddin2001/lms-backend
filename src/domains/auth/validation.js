const Joi = require("joi");
const mongoose = require("mongoose");
const { password } = require("../../libraries/common/validation");

const registerSchema = Joi.object({
  email: Joi.string().required().email().messages({
    "string.email": "Please enter a valid email address",
    "any.required": "Email is required",
  }),
  password: password,
  firstName: Joi.string().required().trim().min(2).max(50).messages({
    "string.min": "First name must be at least 2 characters long",
    "string.max": "First name cannot exceed 50 characters",
    "any.required": "First name is required",
  }),
  lastName: Joi.string().required().trim().min(2).max(50).messages({
    "string.min": "Last name must be at least 2 characters long",
    "string.max": "Last name cannot exceed 50 characters",
    "any.required": "Last name is required",
  }),
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

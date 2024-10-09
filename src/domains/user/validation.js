// src/domains/user/validation.js
const Joi = require("joi");
const mongoose = require("mongoose");
const { password } = require("../../libraries/common/validation");

const getUsersSchema = Joi.object({
  search: Joi.string().allow(""),
  role: Joi.string().valid("student", "instructor", "admin"),
  sortBy: Joi.string()
    .valid("firstName", "lastName", "email", "createdAt")
    .default("createdAt"),
  sortOrder: Joi.string().valid("asc", "desc").default("desc"),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});
const createUserSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required().custom(password),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  role: Joi.string().valid("student", "instructor", "admin"),
  profilePicture: Joi.string(),
  bio: Joi.string(),
  socialLinks: Joi.object({
    google: Joi.string(),
    facebook: Joi.string(),
    linkedin: Joi.string(),
  }),
});

const updateUserSchema = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  profilePicture: Joi.string(),
  bio: Joi.string(),
  socialLinks: Joi.object({
    google: Joi.string(),
    facebook: Joi.string(),
    linkedin: Joi.string(),
  }),
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

module.exports = {
  getUsersSchema,
  createUserSchema,
  updateUserSchema,
  idSchema,
};

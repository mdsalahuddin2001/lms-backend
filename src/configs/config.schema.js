const Joi = require("joi");

const schema = Joi.object({
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("development"),
  MONGODB_URI: Joi.string().required(),
  RATE: Joi.number().min(0).required(),
  PORT: Joi.number().min(1000).default(5000),
  JWT_SECRET: Joi.string().required().description("JWT secret key"),
  JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
    .default(30)
    .description("minutes after which access tokens expire"),
  JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
    .default(30)
    .description("days after which refresh tokens expire"),
  JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
    .default(10)
    .description("minutes after which reset password token expires"),
  JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
    .default(10)
    .description("minutes after which verify email token expires"),
  SMTP_HOST: Joi.string().description("server that will send the emails"),
  SMTP_PORT: Joi.number().description("port to connect to the email server"),
  SMTP_USERNAME: Joi.string().description("username for email server"),
  SMTP_PASSWORD: Joi.string().description("password for email server"),
  EMAIL_FROM: Joi.string().description(
    "the from field in the emails sent by the app"
  ),
});

module.exports = schema;

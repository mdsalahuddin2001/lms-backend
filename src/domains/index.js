const authRoutes = require("./auth");
const userRoutes = require("./user");
const defineRoutes = async (expressRouter) => {
  authRoutes(expressRouter);
  userRoutes(expressRouter);
};

module.exports = defineRoutes;

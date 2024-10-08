const { routes } = require("./api");

const defineRoutes = (expressRouter) => {
  expressRouter.use("/auth", routes());
};

module.exports = defineRoutes;

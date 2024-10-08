const logger = require("../../libraries/log/logger");
const { getByEmail } = require("../user/service");
const Model = require("../user/schema");
const { AppError } = require("../../libraries/error-handling/AppError");

const model = "Auth";

const register = async (data) => {
  const item = new Model(data);
  const saved = await item.save();
  logger.info(`create(): model created`, {
    id: saved._id,
  });
  return saved;
};
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await getByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new AppError(
      `Unauthorized loginWithEmailAndPassword()`,
      "Incorrect email or password",
      400
    );
  }
  console.log("user", user);
  return user;
};
const search = async (query) => {
  try {
    const { keyword } = query ?? {};
    const filter = {};
    if (keyword) {
      filter.or = [
        { name: { regex: keyword, options: "i" } },
        { description: { regex: keyword, options: "i" } },
      ];
    }
    const items = await Model.find(filter);
    logger.info("search(): filter and count", {
      filter,
      count: items.length,
    });
    return items;
  } catch (error) {
    logger.error(`search(): Failed to search model`, error);
    throw new AppError(`Failed to search model`, error.message, 400);
  }
};

const getById = async (id) => {
  try {
    const item = await Model.findById(id);
    logger.info(`getById(): model fetched`, { id });
    return item;
  } catch (error) {
    logger.error(`getById(): Failed to get model`, error);
    throw new AppError(`Failed to get model`, error.message);
  }
};

const updateById = async (id, data) => {
  try {
    const item = await Model.findByIdAndUpdate(id, data, { new: true });
    logger.info(`updateById(): model updated`, { id });
    return item;
  } catch (error) {
    logger.error(`updateById(): Failed to update model`, error);
    throw new AppError(`Failed to update model`, error.message);
  }
};

const deleteById = async (id) => {
  try {
    await Model.findByIdAndDelete(id);
    logger.info(`deleteById(): model deleted`, { id });
    return true;
  } catch (error) {
    logger.error(`deleteById(): Failed to delete model`, error);
    throw new AppError(`Failed to delete model`, error.message);
  }
};

module.exports = {
  register,
  loginUserWithEmailAndPassword,
  search,
  getById,
  updateById,
  deleteById,
};

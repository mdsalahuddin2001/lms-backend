const logger = require("../../libraries/log/logger");
const { AppError } = require("../../libraries/error-handling/AppError");
const User = require("./schema");

const createUser = async (userData) => {
  try {
    const user = new User(userData);
    await user.save();
    logger.info(`createUser(): User created`, { id: user._id });
    return user;
  } catch (error) {
    logger.error(`createUser(): Failed to create user`, error);
    throw new AppError("Failed to create user", error.message, 400);
  }
};

const getUserById = async (id) => {
  try {
    const user = await User.findById(id);
    logger.info(`getUserById(): User fetched`, { id });
    return user;
  } catch (error) {
    logger.error(`getUserById(): Failed to get user`, error);
    throw new AppError("Failed to get user", error.message);
  }
};

const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

const updateUser = async (id, updateData) => {
  try {
    const user = await User.findByIdAndUpdate(id, updateData, { new: true });
    logger.info(`updateUser(): User updated`, { id });
    return user;
  } catch (error) {
    logger.error(`updateUser(): Failed to update user`, error);
    throw new AppError("Failed to update user", error.message);
  }
};

const deleteUser = async (id) => {
  try {
    await User.findByIdAndUpdate(id, { isDeleted: true });
    logger.info(`deleteUser(): User marked as deleted`, { id });
    return true;
  } catch (error) {
    logger.error(`deleteUser(): Failed to delete user`, error);
    throw new AppError("Failed to delete user", error.message);
  }
};

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
};

const httpStatus = require('http-status');
// MIDDLEWARE
const { ApiError } = require('../middleware/apiError');
// MODELS
const { User } = require('../models/user');
// SERVICES
const userService = require('./user.service');

const createUser = async (email, password) => {
  try {
    if (await User.emailTaken(email)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Sorry email taken');
    }

    const user = new User({
      email,
      password,
    });

    await user.save();

    return user;
  } catch (error) {
    throw error;
  }
};

const genAuthToken = (user) => {
  const token = user.generateAuthToken();
  return token;
};

const signInWithEmailAndPassword = async (email, password) => {
  try {
    const user = await userService.findUserByEmail(email);
    if (!user) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Email doesn't exist");
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid password');
    }

    return user;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createUser,
  genAuthToken,
  signInWithEmailAndPassword,
};

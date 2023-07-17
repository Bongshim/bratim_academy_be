const Joi = require('joi');
const { password } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    email: Joi.string().trim().required().email(),
    password: Joi.string().trim().required().custom(password),
    firstName: Joi.string().trim().required(),
    lastName: Joi.string().trim().required(),
    phoneNumber: Joi.string().trim().required(),
    role: Joi.string().valid('user', 'lecturer').required(),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
};

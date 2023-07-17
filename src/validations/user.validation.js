const Joi = require('joi');
const { password } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().trim().required().email(),
    password: Joi.string().trim().required().custom(password),
    firstName: Joi.string().trim().required(),
    lastName: Joi.string().trim().required(),
    phoneNumber: Joi.string().required(),
    about: Joi.string().trim(),
    profileImage: Joi.string().trim(),
    role: Joi.string().valid('user', 'admin').required(),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    userName: Joi.string(),
    email: Joi.string(),
    page: Joi.string(),
    limit: Joi.number().integer(),
    startDate: Joi.date(),
    endDate: Joi.date().greater(Joi.ref('startDate')),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string(),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required(),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().trim().email(),
      password: Joi.string().custom(password),
      userName: Joi.string().trim(),
      firstName: Joi.string().trim(),
      lastName: Joi.string().trim(),
      middleName: Joi.string().trim(),
      phoneNumber: Joi.string(),
      profileImage: Joi.string().trim(),
      isEmailVerified: Joi.boolean(),
      about: Joi.string().trim(),
      role: Joi.array().items(Joi.string().valid('admin', 'user')),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string(),
  }),
};

const updatePassword = {
  body: Joi.object().keys({
    oldPassword: Joi.string().required().custom(password),
    newPassword: Joi.string().required().custom(password),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updatePassword,
};

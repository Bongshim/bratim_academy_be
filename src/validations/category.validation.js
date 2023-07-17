const Joi = require('joi');

const createCategory = {
  body: Joi.object().keys({
    name: Joi.string().trim().required(),
    description: Joi.string().trim().required(),
    icon: Joi.string().required(),
    parentId: Joi.number(),
  }),
};

const getCategory = {
  params: Joi.object().keys({
    categoryId: Joi.string().required(),
  }),
};

const getCategories = {
  query: Joi.object().keys({
    name: Joi.string(),
    page: Joi.number(),
    limit: Joi.number(),
    sortby: Joi.string().valid('ASC', 'DESC').default('DESC'),
  }),
};

const getSessionCategories = {
  query: Joi.object().keys({
    page: Joi.number(),
    limit: Joi.number(),
  }),
};

const updateCategory = {
  params: Joi.object().keys({
    categoryId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    name: Joi.string().trim(),
    description: Joi.string().trim(),
    icon: Joi.string(),
    parentId: Joi.number(),
  }),
};

const deleteCategory = {
  params: Joi.object().keys({
    categoryId: Joi.string().required(),
  }),
};

module.exports = {
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  getCategories,
  getSessionCategories,
};

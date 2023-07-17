const Joi = require('joi');

const createTag = {
  body: Joi.object().keys({
    name: Joi.string().trim().required(),
  }),
};

const getTags = {
  query: Joi.object().keys({
    name: Joi.string(),
  }),
};

const deleteTag = {
  params: Joi.object().keys({
    tagId: Joi.string().required(),
  }),
};

module.exports = {
  createTag,
  getTags,
  deleteTag,
};

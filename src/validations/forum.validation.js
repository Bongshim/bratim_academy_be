const Joi = require('joi');

const createForum = {
  body: Joi.object().keys({
    title: Joi.string(),
    description: Joi.string(),
  }),
};

const getForums = {
  query: Joi.object().keys({
    page: Joi.number(),
    limit: Joi.number(),
    title: Joi.string(),
  }),
};

const getForumById = {
  params: Joi.object().keys({
    forumId: Joi.string().required(),
  }),
};

const updateForum = {
  params: Joi.object().keys({
    forumId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    title: Joi.string(),
    description: Joi.string(),
  }),
};

const getForumsByPurchasedCourseSessions = {
  query: Joi.object().keys({
    page: Joi.number(),
    limit: Joi.number(),
  }),
};

module.exports = {
  createForum,
  getForums,
  updateForum,
  getForumById,
  getForumsByPurchasedCourseSessions,
};

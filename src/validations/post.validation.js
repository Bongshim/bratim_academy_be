const Joi = require('joi');

const createPost = {
  body: Joi.object().keys({
    title: Joi.string().trim().required(),
    body: Joi.string().trim().required(),
    forumId: Joi.number().required(),
    tags: Joi.array().items(Joi.number()),
  }),
};

const getPostById = {
  params: Joi.object().keys({
    postId: Joi.string().required(),
  }),
};

const updatePostById = {
  params: Joi.object().keys({
    postId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    title: Joi.string().trim(),
    body: Joi.string().trim(),
    tags: Joi.array().items(Joi.number()),
  }),
};

const deletePostById = {
  params: Joi.object().keys({
    postId: Joi.string().required(),
  }),
};

const getAllPostsByForumId = {
  params: Joi.object().keys({
    forumId: Joi.string().required(),
  }),
  query: Joi.object().keys({
    page: Joi.number().min(1),
    limit: Joi.number().min(1).max(100),
  }),
};

const reportPostById = {
  params: Joi.object().keys({
    postId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    reportReason: Joi.string().trim().lowercase().required(),
    isReported: Joi.boolean().required(),
  }),
};

module.exports = {
  createPost,
  getPostById,
  updatePostById,
  deletePostById,
  getAllPostsByForumId,
  reportPostById,
};

const Joi = require('joi');

const createComment = {
  body: Joi.object().keys({
    comment: Joi.string().trim().required(),
    postId: Joi.number().required(),
  }),
};

const getCommentById = {
  params: Joi.object().keys({
    commentId: Joi.string().required(),
  }),
};

const getAllCommentsByPostId = {
  params: Joi.object().keys({
    postId: Joi.string().required(),
  }),
  query: Joi.object().keys({
    page: Joi.number().min(1),
    limit: Joi.number().min(1).max(100),
  }),
};

const updateCommentById = {
  params: Joi.object().keys({
    commentId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    comment: Joi.string().trim(),
  }),
};

const deleteCommentById = {
  params: Joi.object().keys({
    commentId: Joi.string().required(),
  }),
};

const reportCommentById = {
  params: Joi.object().keys({
    commentId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    reportReason: Joi.string().trim().lowercase().required(),
    isReported: Joi.boolean().required(),
  }),
};

module.exports = {
  createComment,
  getCommentById,
  updateCommentById,
  deleteCommentById,
  reportCommentById,
  getAllCommentsByPostId,
};

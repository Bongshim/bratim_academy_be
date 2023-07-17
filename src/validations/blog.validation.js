const Joi = require('joi');

const createBlogPost = {
  body: Joi.object().keys({
    title: Joi.string().trim().required(),
    content: Joi.string().trim().required(),
    image: Joi.string().required(),
    slug: Joi.string().trim().required(),
    status: Joi.valid('draft', 'published').default('draft'),
  }),
};

const getBlogPost = {
  params: Joi.object().keys({
    blogId: Joi.string().required(),
  }),
};

const getBlogPosts = {
  query: Joi.object().keys({
    title: Joi.string(),
    page: Joi.number(),
    limit: Joi.number(),
    sortby: Joi.string().valid('ASC', 'DESC').default('DESC'),
    status: Joi.valid('draft', 'published'),
  }),
};

const updateBlogPost = {
  params: Joi.object().keys({
    blogId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    title: Joi.string().trim(),
    content: Joi.string().trim(),
    image: Joi.string(),
    slug: Joi.string().trim(),
    status: Joi.valid('draft', 'published').default('draft'),
  }),
};

const deleteBlogPost = {
  params: Joi.object().keys({
    blogId: Joi.string().required(),
  }),
};

const getBlogPublishedPosts = {
  query: Joi.object().keys({
    title: Joi.string(),
    page: Joi.number(),
    limit: Joi.number(),
    sortby: Joi.string().valid('ASC', 'DESC').default('DESC'),
  }),
};

module.exports = {
  createBlogPost,
  getBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getBlogPosts,
  getBlogPublishedPosts,
};

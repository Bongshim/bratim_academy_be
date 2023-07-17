const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { blogService } = require('../services');
const pick = require('../utils/pick');

const createBlogPost = catchAsync(async (req, res) => {
  const blog = await blogService.createBlogPost(req.body, req.user.dataValues.id);
  res.status(httpStatus.CREATED).send(blog);
});

const getAllBlogPosts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['title', 'status']);
  const options = pick(req.query, ['page', 'limit', 'sortby']);
  const blogs = await blogService.getAllBlogPosts(filter, options);
  res.status(httpStatus.OK).send(blogs);
});

const getBlogPostById = catchAsync(async (req, res) => {
  const blog = await blogService.getBlogPostById(req.params.blogId);
  if (!blog) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Blog not found');
  }

  res.status(httpStatus.OK).send(blog);
});

const updateBlogPostById = catchAsync(async (req, res) => {
  await blogService.updateBlogPostById(req.params.blogId, req.body);
  res.status(httpStatus.ACCEPTED).send({
    status: 'success',
    message: 'Blog post updated successfully',
  });
});

const deleteBlogPostById = catchAsync(async (req, res) => {
  await blogService.deleteBlogPostById(req.params.blogId);
  res.status(httpStatus.OK).send({
    status: 'success',
    message: 'Blog post deleted successfully',
  });
});

const getAllPublishedBlogPosts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['title']);
  const options = pick(req.query, ['page', 'limit', 'sortby']);
  const blogs = await blogService.getAllPublishedBlogPosts(filter, options);
  res.status(httpStatus.OK).send(blogs);
});

module.exports = {
  createBlogPost,
  getAllBlogPosts,
  getBlogPostById,
  updateBlogPostById,
  deleteBlogPostById,
  getAllPublishedBlogPosts,
};

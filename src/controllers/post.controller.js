const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { postService } = require('../services');
const pick = require('../utils/pick');

const createPost = catchAsync(async (req, res) => {
  const post = await postService.createPost(req.body, req.user);
  res.status(httpStatus.CREATED).send(post);
});

const getPostById = catchAsync(async (req, res) => {
  const post = await postService.getPostById(req.params.postId);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
  }
  res.status(httpStatus.OK).send(post);
});

const updatePostById = catchAsync(async (req, res) => {
  const post = await postService.updatePostById(req.params.postId, req.body, req.user);
  res.status(httpStatus.OK).send(post);
});

const deletePostById = catchAsync(async (req, res) => {
  await postService.deletePostById(req.params.postId, req.user);
  res.status(httpStatus.NO_CONTENT).send();
});

const getAllPostsByForumId = catchAsync(async (req, res) => {
  const options = pick(req.query, ['page', 'limit']);
  const posts = await postService.getAllPostsByForumId(req.params.forumId, options);
  res.status(httpStatus.OK).send(posts);
});

const reportPostById = catchAsync(async (req, res) => {
  const response = await postService.reportPostById(req.params.postId, req.body);
  res.status(httpStatus.OK).send(response);
});

const reportedPosts = catchAsync(async (req, res) => {
  const reported = await postService.allReportedPost();
  res.send(reported);
});

module.exports = {
  createPost,
  getPostById,
  updatePostById,
  deletePostById,
  getAllPostsByForumId,
  reportPostById,
  reportedPosts,
};

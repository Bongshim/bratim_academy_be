const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { commentService } = require('../services');
const pick = require('../utils/pick');

const createComment = catchAsync(async (req, res) => {
  const comment = await commentService.createComment(req.body, req.user);
  res.status(httpStatus.CREATED).send(comment);
});

const getCommentById = catchAsync(async (req, res) => {
  const comment = await commentService.getCommentById(req.params.commentId);
  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
  }
  res.status(httpStatus.OK).send(comment);
});

const updateCommentById = catchAsync(async (req, res) => {
  const comment = await commentService.updateCommentById(req.params.commentId, req.body, req.user);
  res.status(httpStatus.OK).send(comment);
});

const deleteCommentById = catchAsync(async (req, res) => {
  await commentService.deleteCommentById(req.params.commentId, req.user);
  res.status(httpStatus.NO_CONTENT).send();
});

const reportCommentById = catchAsync(async (req, res) => {
  const response = await commentService.reportCommentById(req.params.commentId, req.body);
  res.status(httpStatus.OK).send(response);
});

const reportedComments = catchAsync(async (req, res) => {
  const reported = await commentService.allReportedComments();
  res.send(reported);
});

const getCommentsByPostId = catchAsync(async (req, res) => {
  const options = pick(req.query, ['page', 'limit']);
  const comments = await commentService.getCommentsByPostId(req.params.postId, options);
  res.status(httpStatus.OK).send(comments);
});

module.exports = {
  createComment,
  getCommentById,
  updateCommentById,
  deleteCommentById,
  reportCommentById,
  reportedComments,
  getCommentsByPostId,
};

const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { forumService } = require('../services');
const pick = require('../utils/pick');

const createForum = catchAsync(async (req, res) => {
  const forum = await forumService.createForum(req.body);
  res.status(httpStatus.CREATED).send(forum);
});

const getForum = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['title']);
  const options = pick(req.query, ['page', 'limit']);
  const result = await forumService.getAllForum(filter, options);
  res.send(result);
});

const getForumById = catchAsync(async (req, res) => {
  const forum = await forumService.getForumById(req.params.forumId);
  if (!forum) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Forum not found');
  }
  res.send(forum);
});

const updateForum = catchAsync(async (req, res) => {
  const forum = await forumService.updateForumById(req.params.forumId, req.body);
  res.send(forum);
});

const getForumsByPurchasedCourseSessions = catchAsync(async (req, res) => {
  const options = pick(req.query, ['page', 'limit']);
  const result = await forumService.getForumsByPurchasedCourseSessions(req.user.id, options);
  res.send(result);
});

module.exports = {
  createForum,
  updateForum,
  getForum,
  getForumById,
  getForumsByPurchasedCourseSessions,
};

const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { courseResourceService } = require('../services');
const pick = require('../utils/pick');

const createBatchCourseResource = catchAsync(async (req, res) => {
  const courseResource = await courseResourceService.createBatchCourseResources(req.body, req.params.courseSessionId);
  res.status(httpStatus.CREATED).send(courseResource);
});

const getCourseResourceById = catchAsync(async (req, res) => {
  const courseResource = await courseResourceService.getCourseResourceById(req.params.courseResourceId);
  if (!courseResource) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course Resource not found');
  }
  res.status(httpStatus.OK).send(courseResource);
});

const getAllCourseResources = catchAsync(async (req, res) => {
  const pagination = pick(req.query, ['page', 'limit', 'orderBy']);
  const filter = pick(req.query, ['title']);
  const result = await courseResourceService.getAllCourseResources(pagination, filter);
  res.send(result);
});

const viewCourseResourceLink = catchAsync(async (req, res) => {
  const courseResource = await courseResourceService.viewCourseResourceLink(req.params.courseResourceId, req.user);
  res.status(httpStatus.OK).send(courseResource);
});

const updateBatchCourseResources = catchAsync(async (req, res) => {
  const courseResource = await courseResourceService.updateBatchCourseResources(req.body, req.params.courseSessionId);
  res.status(httpStatus.OK).send(courseResource);
});

const updateCourseResourceById = catchAsync(async (req, res) => {
  const courseResource = await courseResourceService.updateCourseResourceById(req.params.courseResourceId, req.body);
  res.status(httpStatus.OK).send(courseResource);
});

const deleteCourseResourceById = catchAsync(async (req, res) => {
  await courseResourceService.deleteCourseResourceById(req.params.courseResourceId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createBatchCourseResource,
  getCourseResourceById,
  updateBatchCourseResources,
  deleteCourseResourceById,
  viewCourseResourceLink,
  getAllCourseResources,
  updateCourseResourceById,
};

const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { courseSessionService } = require('../services');
const pick = require('../utils/pick');
const { checkAdminOrLecturer } = require('../utils/checkIsAdmin');

const createCourseSession = catchAsync(async (req, res) => {
  const courseSession = await courseSessionService.createCourseSession(req.body);
  res.status(httpStatus.CREATED).send(courseSession);
});

const viewSessionLink = catchAsync(async (req, res) => {
  const courseSession = await courseSessionService.viewCourseSessionLink(req.params.courseSessionId, req.user);
  res.status(httpStatus.OK).send(courseSession);
});

const getCourseSessionById = catchAsync(async (req, res) => {
  const isAdminOrLecturer = checkAdminOrLecturer(req);
  const courseSession = await courseSessionService.getCourseSessionById(req.params.courseSessionId, isAdminOrLecturer);
  if (!courseSession) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course Session not found');
  }
  res.status(httpStatus.OK).send(courseSession);
});

const getAllCourseSessions = catchAsync(async (req, res) => {
  const isAdminOrLecturer = checkAdminOrLecturer(req);
  const filter = pick(req.query, ['title', 'startDate', 'endDate', 'lecturerId']);
  const options = pick(req.query, ['page', 'limit']);
  const result = await courseSessionService.getAllCourseSessions(filter, options, isAdminOrLecturer);
  res.send(result);
});

const updateCourseSessionById = catchAsync(async (req, res) => {
  const courseSession = await courseSessionService.updateCourseSessionById(req.params.courseSessionId, req.body);
  res.status(httpStatus.OK).send(courseSession);
});

const deleteCourseSessionById = catchAsync(async (req, res) => {
  await courseSessionService.deleteCourseSessionById(req.params.courseSessionId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createCourseSession,
  getCourseSessionById,
  updateCourseSessionById,
  deleteCourseSessionById,
  viewSessionLink,
  getAllCourseSessions,
};

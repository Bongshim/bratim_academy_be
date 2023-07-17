const catchAsync = require('../utils/catchAsync');
const { reportService } = require('../services');
const pick = require('../utils/pick');

const getSubscribedCourseReport = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['startDate', 'endDate', 'title', 'description']);
  const pagination = pick(req.query, ['page', 'limit', 'orderBy']);
  const reports = await reportService.getSubscribedCourseReport(filter, pagination);
  res.send(reports);
});

const getSubscribedCourseReportById = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['payment_reference', 'payment_method', 'email', 'startDate', 'endDate']);
  const pagination = pick(req.query, ['page', 'limit', 'orderBy']);
  const reports = await reportService.getSubscribedCourseReportById(req.params.courseSessionId, filter, pagination);
  res.send(reports);
});

module.exports = {
  getSubscribedCourseReport,
  getSubscribedCourseReportById,
};

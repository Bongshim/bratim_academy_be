const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { purchaseService } = require('../services');

const getAllPurchasedCourseSession = catchAsync(async (req, res) => {
  const { user } = req;
  const courseSessionPurchase = await purchaseService.getAllPurchasedCourseSession(user.dataValues.id);
  res.status(httpStatus.OK).send(courseSessionPurchase);
});

module.exports = {
  getAllPurchasedCourseSession,
};

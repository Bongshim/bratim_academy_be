const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { dashboardService } = require('../services');

const getDashboardData = catchAsync(async (req, res) => {
  const dashboard = await dashboardService.getDashboardData();
  res.status(httpStatus.OK).send(dashboard);
});

const getUserDashboard = catchAsync(async (req, res) => {
  const { id } = req.user.dataValues;
  const userDashboard = await dashboardService.userDashboard(id);
  res.status(httpStatus.OK).send(userDashboard);
});

module.exports = {
  getDashboardData,
  getUserDashboard,
};

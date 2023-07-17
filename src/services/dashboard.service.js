const httpStatus = require('http-status');
const { db } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Get admin dashboard data
 * @returns {Promise<Dashboard>}
 */
const getDashboardData = async () => {
  const totalUsers = await db.user.count();
  const totalCourses = await db.course.count();
  const totalCourseSessions = await db.course_session.count();
  const totalCourseSubscription = await db.course_subscription.count();

  // get total course subscription group by course id referenced by course session id
  const totalCourseSubscriptionGroupByCourse = await db.course_subscription.findAll({
    attributes: ['course_session_id', [db.sequelize.fn('COUNT', db.sequelize.col('course_session_id')), 'total']],
    group: ['course_session_id'],
  });

  return {
    totalUsers,
    totalCourses,
    totalCourseSessions,
    totalCourseSubscription,
    totalCourseSubscriptionGroupByCourse,
  };
};

const userDashboard = async (userId) => {
  const userExist = await db.user.findByPk(userId);
  if (!userExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const totalUserCourseSessionPurchase = await db.course_subscription.count({
    where: {
      userId,
      status: 'success',
    },
  });

  return {
    totalUserCourseSessionPurchase,
  };
};

module.exports = {
  getDashboardData,
  userDashboard,
};

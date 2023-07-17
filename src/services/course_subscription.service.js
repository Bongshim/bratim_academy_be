const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { db } = require('../models');

/**
 * Get all course subscription by user id
 * @param {ObjectId} userId
 * @returns {Promise<CourseSubscription>}
 */
const getCourseSubscriptionByUserId = async (userId) => {
  return db.course_subscription.findAll({ where: { userId, status: 'success' } });
};

/**
 * Get course subscription by userId AND course session ID
 * @param {ObjectId} userId
 * @param {ObjectId} courseSessionId
 * @returns {Promise<CourseSubscription>}
 */
const getCourseSubscriptionByUserIdAndCourseSessionId = async (userId, courseSessionId) => {
  const sessionRecord = await db.course_subscription.findOne({ where: { userId, course_session_Id: courseSessionId } });

  if (!sessionRecord) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You have not purchased this resource');
  }

  return sessionRecord;
};

module.exports = {
  getCourseSubscriptionByUserId,
  getCourseSubscriptionByUserIdAndCourseSessionId,
};

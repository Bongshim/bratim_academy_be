const httpStatus = require('http-status');
const { Op } = require('sequelize');
const ApiError = require('../utils/ApiError');
const { db } = require('../models');
const { getCourseSubscriptionByUserIdAndCourseSessionId } = require('./course_subscription.service');

/**
 * check if course session exists
 * @param {string} courseSessionId - The course session's id
 * @returns {Promise<boolean>}
 */
const courseSessionIdExists = async function (courseSessionId) {
  const courseSession = await db.course_session.findByPk(courseSessionId);
  return !!courseSession;
};

/**
 * Check if course exists
 * @param {string} courseId - The course session's courseId
 * @returns {Promise<boolean>}
 */
const courseIdExists = async function (courseId) {
  const course = await db.course.findByPk(courseId);
  return !course;
};

/**
 * Get course session by Id
 * @param {ObjectId} id
 * @param {Boolean} isAdmin - Is admin
 * @returns {Promise<CourseSession>}
 */
const getCourseSessionById = async (id, isAdmin) => {
  return db.course_session.findByPk(id, {
    attributes: isAdmin.isAdmin || isAdmin.isLecturer ? { exclude: [] } : { exclude: ['link'] },
    include: [
      {
        model: db.user,
        as: 'Lecturers',
        attributes: ['id', 'firstName', 'lastName', 'profileImage'],
        through: { attributes: [] },
      },
      {
        model: db.course_resource,
        attributes: ['id', 'title', 'description', 'resource_type', 'courseSessionId', 'createdAt'],
      },
    ],
  });
};

/**
 * Get course session Id from lecturers table
 * @param {number} lecturerId
 * @returns {Promise<CourseSession[]>}
 */
const getCourseSessionIdFromLecturers = async (lecturerId) => {
  if (!lecturerId) return [];

  const courseSessions = await db.lecturer.findAll({
    where: { lecturerId },
  });

  return courseSessions.map((courseSession) => courseSession.courseSessionId);
};

/**
 * Get all course sessions
 * @param {Object} filter - Sequelize filter
 * @param {object} filter.title - Sequelize filter
 * @param {number} [filter.startDate] - The date to start from
 * @param {number} [filter.endDate] - The date to end
 * @param {Object} current - Sequelize pagination
 * @param {Boolean} isAdmin - Is admin
 * @returns {Promise<CourseSession[]>}
 */
const getAllCourseSessions = async (filter, current, isAdmin) => {
  const { startDate, endDate, title, lecturerId = null } = filter;

  const courseSessionIds = await getCourseSessionIdFromLecturers(lecturerId);

  // get all course sessions excluding the link
  const options = {
    page: current.page, // Default 1
    paginate: current.limit, // Default 25
    attributes: isAdmin ? { exclude: [] } : { exclude: ['link'] },
    where: {
      ...(courseSessionIds.length && { id: { [Op.in]: courseSessionIds } }),
      ...(title && { title: { [Op.like]: `%${title}%` } }),
      ...(startDate && endDate && { createdAt: { [Op.between]: [startDate, endDate] } }),
      enrollment_deadline: {
        [Op.gte]: isAdmin.isAdmin || isAdmin.isLecturer ? '1970-01-01' : new Date(),
      },
    },
    include: [
      {
        model: db.user,
        as: 'Lecturers',
        attributes: ['id', 'firstName', 'lastName', 'profileImage'],
        through: { attributes: [] },
      },
      {
        model: db.course_resource,
        attributes: { exclude: ['updatedAt'] },
      },
    ],
  };

  const { docs, pages, total } = await db.course_session.paginate(options);

  return { docs, limit: options.paginate, totalPages: pages, totalResults: total };
};

/**
 * View course session link
 * @param {ObjectId} sessionId
 * @param {ObjectId} userId
 * @returns {Promise<CourseSession>}
 */
const viewCourseSessionLink = async (sessionId, userId) => {
  // get course session
  const courseSession = await db.course_session.findByPk(sessionId);
  if (!courseSession) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course Session not found');
  }

  // check course subscription to see if user has purchased the course
  await getCourseSubscriptionByUserIdAndCourseSessionId(userId.dataValues.id, sessionId);

  return courseSession.dataValues.link;
};

/**
 * Crate a course session
 * @param {Object} courseSessionBody
 * @returns {Promise<CourseSession>}
 */
const createCourseSession = async (courseSessionBody) => {
  const { courseId, lecturersIds, ...courseSession } = courseSessionBody;

  // TODO: update to course service
  // check if course exist
  if (await courseIdExists(courseId)) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }

  // check if lecturers exist
  const lecturers = await db.user.findAll({ where: { id: lecturersIds } });
  if (lecturers.length !== lecturersIds.length) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Lecturer not found');
  }

  // create course session
  const courseSessionCreated = await db.course_session.create({ courseId, ...courseSession });

  // add lecturers to course session
  await courseSessionCreated.setLecturers(lecturers);

  return getCourseSessionById(courseSessionCreated.dataValues.id);
};

/**
 * Update course session by id
 * @param {ObjectId} courseSessionId
 * @param {Object} updateBody
 * @returns {Promise<CourseSession>}
 */
const updateCourseSessionById = async (courseSessionId, updateBody) => {
  const { courseId, lecturersIds, ...courseSessionBody } = updateBody;
  const courseSession = await getCourseSessionById(courseSessionId);
  if (!courseSession) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course Session not found');
  }

  // check of courseId exists
  if (courseId) {
    if (await courseIdExists(courseId)) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
    }
  }

  // check if lecturers exist
  if (lecturersIds) {
    const lecturers = await db.user.findAll({ where: { id: lecturersIds } });
    if (lecturers.length !== lecturersIds.length) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Lecturer not found');
    }

    // remove all lecturers
    await courseSession.removeLecturers();

    // add lecturers to course session
    await courseSession.setLecturers(lecturers);
  }

  Object.assign(courseSession, courseSessionBody);
  await courseSession.save();

  return getCourseSessionById(courseSessionId);
};

/**
 * Delete course session by id
 * @param {ObjectId} courseSessionId
 * @returns {Promise<CourseSession>}
 */
const deleteCourseSessionById = async (courseSessionId) => {
  const courseSession = await getCourseSessionById(courseSessionId);
  if (!courseSession) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course Session not found');
  }
  await courseSession.destroy();
  return courseSession;
};

module.exports = {
  getCourseSessionById,
  createCourseSession,
  updateCourseSessionById,
  courseSessionIdExists,
  deleteCourseSessionById,
  viewCourseSessionLink,
  getAllCourseSessions,
};

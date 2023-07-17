const httpStatus = require('http-status');
const { Op } = require('sequelize');
const ApiError = require('../utils/ApiError');
const { db } = require('../models');
const { courseSessionIdExists } = require('./course_session.service');
const { getCourseSubscriptionByUserIdAndCourseSessionId } = require('./course_subscription.service');

/**
 * Get course resource by Id
 * @param {ObjectId} id
 * @returns {Promise<CourseResource>}
 */
const getCourseResourceById = async (id) => {
  return db.course_resource.findByPk(id, {
    exclude: ['url'],
  });
};

/**
 * View course resource link
 * @param {ObjectId} resourceId
 * @param {ObjectId} userId
 * @returns {Promise<CourseSession>}
 */
const viewCourseResourceLink = async (resourceId, userId) => {
  // get course session
  const resource = await db.course_resource.findByPk(resourceId);
  if (!resource) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course resource not found');
  }

  // check course subscription to see if user has purchased the course
  await getCourseSubscriptionByUserIdAndCourseSessionId(userId.dataValues.id, resource.dataValues.courseSessionId);

  return resource.dataValues.url;
};

/**
 * Get all course resources
 * @param {Object} pagination
 * @param {Object} filter
 * @param {number} pagination.page
 * @param {number} pagination.limit
 * @param {string} pagination.title
 */
const getAllCourseResources = async (pagination, filter) => {
  const options = {
    page: pagination.page,
    pagination: pagination.limit,
    where: {
      ...(filter.title && { title: { [Op.like]: `%${filter.title}%` } }),
    },
    order: [['createdAt', pagination.orderBy || 'DESC']],
  };
  const { docs, pages, total } = await db.course_resource.paginate(options);
  return { resources: docs, limit: pagination.limit, page: pagination.page, totalResults: total, totalPages: pages };
};

/**
 * Batch create course resources
 * @param {Object[]} courseResources
 * @param {number} courseSessionId
 * @returns {Promise<CourseResource>}
 */
const createBatchCourseResources = async (courseResources, courseSessionId) => {
  // check if course session exists
  const courseSession = await courseSessionIdExists(courseSessionId);
  if (!courseSession) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course session not found');
  }

  // bulk create course resources
  const createdCourseResources = await db.course_resource.bulkCreate(
    courseResources.map((courseResource) => ({ ...courseResource, courseSessionId }))
  );

  return createdCourseResources;
};

/**
 * Batch update course resources
 * @param {ObjectId} courseSessionId
 * @param {Object} updateBody
 * @returns {Promise<CourseResource>}
 */
const updateBatchCourseResources = async (updateBody, courseSessionId) => {
  // check if course session exists
  const courseSession = await courseSessionIdExists(courseSessionId);
  if (!courseSession) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course session not found');
  }

  //  remove existing course resources by courseSessionId
  await db.course_resource.destroy({ where: { courseSessionId } });

  // bulk create course resources
  const createdCourseResources = await db.course_resource.bulkCreate(
    updateBody.map((courseResource) => ({ ...courseResource, courseSessionId }))
  );

  return createdCourseResources;
};

/**
 * Update course resource by id
 * @param {ObjectId} courseResourceId
 * @param {Object} updateBody
 * @returns {Promise<CourseResource>}
 */
const updateCourseResourceById = async (courseResourceId, updateBody) => {
  const { courseSessionId, ...courseResourceBody } = updateBody;
  const courseResource = await getCourseResourceById(courseResourceId);
  if (!courseResource) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course Resource not found');
  }

  // check if course session exist
  if (courseSessionId) {
    if (await courseSessionIdExists(courseSessionId)) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Course session not found');
    }
  }

  Object.assign(courseResource, courseResourceBody);
  await courseResource.save();

  return getCourseResourceById(courseResourceId);
};

/**
 * Delete course resource by id
 * @param {ObjectId} courseResourceId
 * @returns {Promise<CourseResource>}
 */
const deleteCourseResourceById = async (courseResourceId) => {
  const courseResource = await getCourseResourceById(courseResourceId);
  if (!courseResource) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course Resource not found');
  }
  await courseResource.destroy();
  return courseResource;
};

module.exports = {
  getCourseResourceById,
  createBatchCourseResources,
  updateBatchCourseResources,
  deleteCourseResourceById,
  viewCourseResourceLink,
  getAllCourseResources,
  updateCourseResourceById,
};

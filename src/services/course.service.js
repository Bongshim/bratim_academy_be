const httpStatus = require('http-status');
const { Op } = require('sequelize');
const { db } = require('../models');
const ApiError = require('../utils/ApiError');
const { createForum } = require('./forum.service');
const { getCategoryById } = require('./category.service');

/**
 * Get course by title
 * @param {string} title
 * @returns {Promise<Course>}
 */
const getCourseByTitle = async (title) => {
  return db.course.findOne({
    where: { title: title.toLowerCase({ [Op.like]: `%${title.toLowerCase}%` }) },
  });
};

/**
 * gets course by Id
 * @param {*} courseId
 * @returns
 */
const getCourseById = async (courseId) => {
  return db.course.findByPk(courseId, {
    include: [
      {
        model: db.forum,
        attributes: ['title', 'description'],
      },
    ],
  });
};

/**
 * creates a course
 * @param {Object} courseBody
 * @param {Object} user
 * @returns {Promise<Object>}
 */
const createCourse = async (courseBody, user) => {
  const { title, description, categoryId } = courseBody;

  const categoryExist = await getCategoryById(categoryId);
  // check to see if category exists
  if (!categoryExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Category does not exist');
  }

  const courseExist = await getCourseByTitle(title);
  if (courseExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course with the title already exists');
  }
  const createdCourse = await db.course.create({ ...courseBody, createdBy: user.id });

  const forum = await createForum({ title, description });

  // set course to forum
  await createdCourse.setForum(forum);
  return getCourseById(createdCourse.dataValues.id);
};

/**
 * Get course category by Id
 * @param {string} courseCategoryId
 * @returns {Promise<Course>}
 */
const getCourseCeategoryById = async (courseCategoryId) => {
  const result = await db.course.findByPk(courseCategoryId);
  return result;
};

/**
 * Get all course sessions
 * @param {Object} filter - Sequelize filter
 * @param {object} filter.title - Sequelize filter
 * @param {number} [filter.startDate] - The date to start from
 * @param {number} [filter.endDate] - The date to end
 * @param {Object} current - Sequelize pagination
 * @param {number} current.page - Sequelize pagination
 * @param {number} current.limit - Sequelize pagination
 * @returns {Promise<CourseSession[]>}
 */
const getAllCourses = async (filter, current) => {
  const { title, startDate, endDate } = filter;
  const options = {
    page: current.page,
    paginate: current.limit,
    where: {
      ...(title && { title: { [Op.like]: `%${title}%` } }),
      ...(startDate && endDate && { createdAt: { [Op.between]: [startDate, endDate] } }),
    },
    include: [
      {
        model: db.forum,
        attributes: ['title', 'description'],
      },
      {
        model: db.course_session,
        attributes: ['title', 'description', 'cost', 'start_date', 'end_date'],
        include: [
          {
            model: db.user,
            as: 'Lecturers',
            attributes: ['firstName', 'lastName'],
          },
        ],
      },
    ],
  };

  const { docs, pages, total } = await db.course.paginate(options);

  return { docs, limit: options.paginate, totalPages: pages, totalResults: total };
};
/**
 * Update course by id
 * @param {ObjectId} courseId
 * @param {Object} updateBody
 * @returns {Promise<Course>}
 */
const updateCourseById = async (courseId, updateBody) => {
  const { categoryId } = updateBody;

  // check if cost exists
  const courseExists = await getCourseById(courseId);
  if (!courseExists) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }

  // Check of category exist
  if (categoryId || categoryId === 0) {
    const categoryExist = await getCategoryById(categoryId);
    if (!categoryExist) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Category does not exist');
    }
  }

  Object.assign(courseExists, updateBody);
  await courseExists.save();
  return getCourseById(courseId);
};

/**
 * Delete course by id
 * @param {ObjectId} courseId
 * @returns {Promise<course>}
 */
const deleteCourseById = async (courseId) => {
  const course = await getCourseById(courseId);
  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'course not found');
  }

  // check if there are course sessions under the course
  const courseSessions = await course.getCourse_sessions();
  if (courseSessions.length > 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot delete. Course has course sessions');
  }

  await course.destroy();
  return course;
};

module.exports = {
  deleteCourseById,
  updateCourseById,
  createCourse,
  getCourseById,
  getAllCourses,
  getCourseCeategoryById,
};

const httpStatus = require('http-status');
const { Op } = require('sequelize');
const { db } = require('../models');
const ApiError = require('../utils/ApiError');
/**
 * creates a forum
 * @param {Object} forumBody
 * @returns {Promise<Object>}
 */
const createForum = async (forumBody) => {
  return db.forum.create(forumBody);
};

/**
 * gets forum by Id
 * @param {*} forumId
 * @returns
 */
const getForumById = async (forumId) => {
  const result = await db.forum.findByPk(forumId, {
    include: [
      {
        model: db.post,
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: db.user,
            attributes: ['firstName', 'lastName'],
          },
          {
            model: db.comment,
            attributes: ['comment'],
            order: [['createdAt', 'DESC']],
            include: [
              {
                model: db.user,
                attributes: ['firstName', 'lastName'],
              },
            ],
          },
        ],
      },
    ],
  });
  return result;
};

/**
 * gets all forum
 *
 * @returns
 */
const getAllForum = async (filter, current) => {
  const options = {
    page: current.page,
    paginate: current.limit,
    where: {
      title: {
        [Op.like]: `%${filter.title || ''}%`,
      },
    },
    include: [
      {
        model: db.course,
        attributes: ['title', 'description'],
      },
    ],
  };

  const { docs, pages, total } = await db.forum.paginate(options);

  return { docs, limit: options.paginate, totalPages: pages, totalResults: total };
};

/**
 * Update Forum by id
 * @param {ObjectId} forumId
 * @param {Object} updateBody
 * @returns {Promise<forum>}
 */
const updateForumById = async (forumId, updateBody) => {
  await getForumById(forumId);
  // check if forum exists
  const forumExists = await getForumById(forumId);
  if (!forumExists) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Forum not found');
  }

  Object.assign(forumExists, updateBody);
  await forumExists.save();
  return getForumById(forumId);
};

/**
 * Get forums by  purchased course sessions
 * @param {ObjectId} userId
 * @param {Object} current
 * @param {number} curremt.page
 * @param {number} current.limit
 * @returns {Promise<QueryResult>}
 */
const getForumsByPurchasedCourseSessions = async (userId, current) => {
  const purchasedCourseSessions = await db.course_subscription.findAll({
    where: {
      userId,
    },
    attributes: ['course_session_id'],
    include: [
      {
        model: db.course_session,
        include: [
          {
            model: db.course,
          },
        ],
      },
    ],
  });

  // get course ids
  const courseIds = purchasedCourseSessions.map((courseSession) => courseSession.course_session.course.id);

  // get only unique course ids
  const uniqueCourseIds = [...new Set(courseIds)];

  // get courses forums
  const options = {
    page: current.page,
    paginate: current.limit,
    where: {
      id: uniqueCourseIds,
    },
    attributes: [],
    include: [
      {
        model: db.forum,
      },
    ],
  };

  const { docs, pages, total } = await db.course.paginate(options);

  return { docs: docs.map((item) => item.forum), limit: options.paginate, totalPages: pages, totalResults: total };
};

module.exports = {
  createForum,
  updateForumById,
  getForumById,
  getAllForum,
  getForumsByPurchasedCourseSessions,
};

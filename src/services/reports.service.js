const { literal } = require('sequelize');
const httpStatus = require('http-status');
const { Op } = require('sequelize');
const { db } = require('../models');
const ApiError = require('../utils/ApiError');
const { getUserByEmail } = require('./user.service');

/**
 * Get summary report of all subscribed courses
 * @returns {Promise<import('sequelize').FindAndCountOptions>}
 */
const getSubscribedCourseReport = async (filter, pagination) => {
  const options = {
    page: pagination.page,
    paginate: pagination.limit,
    where: {
      ...(filter.startDate !== undefined &&
        filter.endDate !== undefined && {
          [Op.and]: [
            {
              createdAt: {
                [Op.gte]: filter.startDate,
              },
            },
            {
              createdAt: {
                [Op.lte]: filter.endDate,
              },
            },
          ],
        }),
    },
    attributes: [
      'course_session_Id',
      [literal("COUNT(CASE WHEN `course_subscription`.`status` = 'success' THEN 1 END)"), 'totalCompletedPurchase'],
      [literal("COUNT(CASE WHEN `course_subscription`.`status` = 'pending' THEN 1 END)"), 'totalPending'],
      [
        literal("SUM(CASE WHEN `course_subscription`.`status` = 'success' THEN `course_subscription`.`amount` END)"),
        'totalAmountSuccess',
      ],
    ],
    group: ['course_session_Id'],
    include: [
      {
        model: db.course_session,
        attributes: ['title', 'cost', 'description'],
        where: {
          ...(filter.title !== undefined && {
            title: {
              [Op.like]: `%${filter.title}%`,
            },
          }),
          ...(filter.description !== undefined && {
            description: {
              [Op.like]: `%${filter.description}%`,
            },
          }),
        },
      },
    ],
  };

  const { count, rows: docs, pages } = await db.course_subscription.findAndCountAll(options);
  const totalResult = count > pagination.limit ? count : docs.length;

  return {
    data: docs,
    totalPage: pages,
    totalResult,
    limit: pagination.limit,
    page: pagination.page,
  };
};

/**
 * Get report for subscribed course by course session id, including all course session data and user data
 * @param {number} course_session_Id
 * @returns {Promise<import('sequelize').FindAndCountOptions>}
 */
const getSubscribedCourseReportById = async (courseSessionId, filter, pagination) => {
  let userId;

  if (filter.email) {
    const user = await getUserByEmail(filter.email);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    userId = user.id;
  }
  const options = {
    page: pagination.page,
    paginate: pagination.limit,
    where: {
      course_session_id: courseSessionId,
      ...(filter.payment_reference !== undefined && {
        payment_reference: {
          [Op.like]: `%${filter.payment_reference}%`,
        },
      }),
      ...(filter.payment_method !== undefined && {
        payment_method: {
          [Op.like]: `%${filter.payment_method}`,
        },
      }),
      ...(filter.startDate !== undefined &&
        filter.endDate !== undefined && {
          [Op.and]: [
            {
              createdAt: {
                [Op.gte]: filter.startDate,
              },
            },
            {
              createdAt: {
                [Op.lte]: filter.endDate,
              },
            },
          ],
        }),
      ...(userId !== undefined && {
        userId,
      }),
    },
    include: [
      {
        model: db.user,
        as: 'user',
        attributes: ['id', 'email'],
      },
      {
        model: db.course_session,
        attributes: ['title', 'cost'],
      },
    ],
  };

  const { docs, pages, total } = await db.course_subscription.paginate(options);

  return {
    data: docs,
    totalPage: pages,
    totalResult: total,
    limit: filter.limit,
    page: filter.page,
  };
};
module.exports = {
  getSubscribedCourseReport,
  getSubscribedCourseReportById,
};

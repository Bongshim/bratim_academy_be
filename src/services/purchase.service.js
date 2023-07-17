const { db } = require('../models');

/**
 * Get all purchased courses
 * @param {ObjectId} userId
 * @returns {Promise<Courses>}
 */
const getAllPurchasedCourseSession = async (userId) => {
  // get all course session purchase that are still available to the user
  const courseSessionPurchase = await db.course_subscription.findAll({
    where: {
      userId,
      status: 'success',
    },
    attributes: ['id', 'createdAt'],
    include: [
      {
        model: db.course_session,
        include: [
          {
            model: db.user,
            as: 'Lecturers',
            attributes: ['id', 'firstName', 'lastName', 'profileImage', 'about'],
          },
          {
            model: db.course,
            include: [
              {
                model: db.forum,
                attributes: ['id', 'title', 'description'],
              },
            ],
          },
          {
            model: db.course_resource,
          },
        ],
      },
    ],
  });

  return courseSessionPurchase;
};

module.exports = {
  getAllPurchasedCourseSession,
};

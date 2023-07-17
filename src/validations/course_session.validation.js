const Joi = require('joi');

const createCourseSession = {
  body: Joi.object().keys({
    title: Joi.string().trim().required(),
    description: Joi.string().trim().required(),
    cost: Joi.number().required(),
    image: Joi.string().trim().required(),
    link: Joi.string().trim().required(),
    enrollment_deadline: Joi.date(),
    start_date: Joi.date().required(),
    end_date: Joi.date().required(),
    courseId: Joi.number().required(),
    lecturersIds: Joi.array().items(Joi.number()),
  }),
};

const getCourseSessionById = {
  params: Joi.object().keys({
    courseSessionId: Joi.string().required(),
  }),
};

const getCourseSessions = {
  query: Joi.object().keys({
    title: Joi.string(),
    page: Joi.number(),
    limit: Joi.number(),
    startDate: Joi.date(),
    endDate: Joi.date().greater(Joi.ref('startDate')),
    lecturerId: Joi.number(),
  }),
};

const updateCourseSession = {
  params: Joi.object().keys({
    courseSessionId: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      title: Joi.string().trim(),
      description: Joi.string().trim(),
      cost: Joi.number(),
      image: Joi.string().trim(),
      link: Joi.string().trim(),
      enrollment_deadline: Joi.date(),
      start_date: Joi.date(),
      end_date: Joi.date(),
      courseId: Joi.number(),
      lecturersIds: Joi.array().items(Joi.number()),
    })
    .min(1),
};

const deleteCourseSessionById = {
  params: Joi.object().keys({
    courseSessionId: Joi.string().required(),
  }),
};

module.exports = {
  createCourseSession,
  getCourseSessionById,
  updateCourseSession,
  deleteCourseSessionById,
  getCourseSessions,
};

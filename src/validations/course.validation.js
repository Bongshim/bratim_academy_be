const Joi = require('joi');

const createCourse = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    slug: Joi.string().required(),
    image: Joi.string().required(),
    categoryId: Joi.number().required(),
  }),
};

const getCourse = {
  params: Joi.object().keys({
    courseId: Joi.string().required(),
  }),
};

const getAllCourses = {
  query: Joi.object().keys({
    title: Joi.string(),
    page: Joi.number(),
    limit: Joi.number(),
    startDate: Joi.date(),
    endDate: Joi.date().greater(Joi.ref('startDate')),
  }),
};

const updateCourse = {
  params: Joi.object().keys({
    courseId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    title: Joi.string(),
    description: Joi.string(),
    slug: Joi.string(),
    image: Joi.string(),
    categoryId: Joi.number(),
  }),
};

const deleteCourse = {
  params: Joi.object().keys({
    courseId: Joi.string().required(),
  }),
};

module.exports = {
  createCourse,
  getCourse,
  updateCourse,
  deleteCourse,
  getAllCourses,
};

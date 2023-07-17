const Joi = require('joi');

const createBatchCourseResource = {
  params: Joi.object().keys({
    courseSessionId: Joi.number(),
  }),
  body: Joi.array().items(
    Joi.object().keys({
      title: Joi.string().trim().required(),
      description: Joi.string().trim().required(),
      resource_type: Joi.string().trim().required(),
      url: Joi.string().required(),
    })
  ),
};

const getCourseResourceById = {
  params: Joi.object().keys({
    courseResourceId: Joi.string().required(),
  }),
};

const updateBatchCourseResources = {
  params: Joi.object().keys({
    courseSessionId: Joi.number(),
  }),
  body: Joi.array().items(
    Joi.object().keys({
      title: Joi.string().trim(),
      description: Joi.string().trim(),
      resource_type: Joi.string().trim(),
      url: Joi.string(),
    })
  ),
};

const queryCourseResources = {
  query: Joi.object().keys({
    title: Joi.string().trim().lowercase(),
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(20),
  }),
};

const updateCourseResource = {
  params: Joi.object().keys({
    courseResourceId: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      title: Joi.string().trim(),
      description: Joi.string().trim(),
      resource_type: Joi.string().trim(),
      url: Joi.string(),
      courseSessionId: Joi.number(),
    })
    .min(1),
};

const deleteCourseResourceById = {
  params: Joi.object().keys({
    courseResourceId: Joi.number().required(),
  }),
};

module.exports = {
  createBatchCourseResource,
  getCourseResourceById,
  updateBatchCourseResources,
  deleteCourseResourceById,
  queryCourseResources,
  updateCourseResource,
};

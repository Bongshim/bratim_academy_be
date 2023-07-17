const moment = require('moment');
const Joi = require('joi');

const getReports = {
  query: Joi.object().keys({
    page: Joi.number().default(1),
    limit: Joi.number().default(10),
    startDate: Joi.date().optional().default('1970-10-17'),
    endDate: Joi.date()
      .optional()
      .default(moment())
      .when('startDate', {
        is: Joi.exist(),
        then: Joi.date().greater(Joi.ref('startDate')).messages({
          'date.greater': 'End date must be greater than the start date.',
        }),
      }),
    title: Joi.string(),
    description: Joi.string(),
  }),
};

const getSubscriptions = {
  query: Joi.object().keys({
    page: Joi.number().default(1),
    limit: Joi.number().default(10),
    startDate: Joi.date().optional().default('1970-10-17'),
    endDate: Joi.date()
      .optional()
      .default(moment())
      .when('startDate', {
        is: Joi.exist(),
        then: Joi.date().greater(Joi.ref('startDate')).messages({
          'date.greater': 'End date must be greater than the start date.',
        }),
      }),
    title: Joi.string(),
    description: Joi.string(),
  }),
};

const getSubscribedCourseReportById = {
  query: Joi.object().keys({
    page: Joi.number().default(1),
    limit: Joi.number().default(10),
    payment_reference: Joi.string(),
    payment_method: Joi.string(),
    email: Joi.string().email(),
    startDate: Joi.date().optional().default('1970-10-17'),
    endDate: Joi.date()
      .optional()
      .default(moment())
      .when('startDate', {
        is: Joi.exist(),
        then: Joi.date().greater(Joi.ref('startDate')).messages({
          'date.greater': 'End date must be greater than the start date.',
        }),
      }),
  }),
  params: Joi.object().keys({
    courseSessionId: Joi.number(),
  }),
};

module.exports = {
  getReports,
  getSubscriptions,
  getSubscribedCourseReportById,
};

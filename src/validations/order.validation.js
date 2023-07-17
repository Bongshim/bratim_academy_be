const Joi = require('joi');

const createOrder = {
  body: Joi.object().keys({
    course: Joi.array().items(Joi.number()),
    paymentMethod: Joi.string().valid('paystack').required(),
  }),
};

module.exports = {
  createOrder,
};

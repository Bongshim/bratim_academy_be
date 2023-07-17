const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { db } = require('../models');
const { initializePaystackTransaction } = require('./paystack.service');

/**
 * Handle course subscription order
 * @param {Object} courseOrderBody
 * @param {String} paymentMethod
 * @param {Object} currentUser
 * @returns {Promise<Subscription>}
 */
const handleCourseSubscriptionOrder = async (courseOrderBody, paymentMethod, currentUser) => {
  if (!courseOrderBody) return { createSubscription: [], totalCourseAmount: 0 };
  const createSubscription = [];
  const courseSessionExists = [];
  let totalCourseAmount = 0;

  // check if course exists
  await Promise.all(
    courseOrderBody.map(async (id) => {
      // TODO: change to course service
      const courseSession = await db.course_session.findByPk(id);
      if (courseSession) {
        courseSessionExists.push(courseSession);
      }
    })
  );

  // check if the course exists
  if (courseOrderBody.length !== courseSessionExists.length) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }

  // create the subscription array of objects with the course session id, amount and payment method
  courseSessionExists.map((courseSession) => {
    const courseSubscription = {};

    courseSubscription.amount = courseSession.dataValues.cost;
    courseSubscription.course_session_Id = courseSession.dataValues.id;
    courseSubscription.payment_method = paymentMethod;
    courseSubscription.userId = currentUser.dataValues.id;

    totalCourseAmount += courseSession.dataValues.cost;

    return createSubscription.push(courseSubscription);
  });

  return { createSubscription, totalCourseAmount };
};

/**
 * Handle orders
 * @param {Object} orderBody
 * @returns {Promise<Order>}
 */
const handleOrder = async (orderBody, currentUser) => {
  // TODO: handle course order
  const { course, paymentMethod } = orderBody;

  // handle course subscription order
  const { createSubscription, totalCourseAmount } = await handleCourseSubscriptionOrder(course, paymentMethod, currentUser);

  // handle payment
  if (paymentMethod === 'paystack') {
    // call paystack service to handle payment
    const initializedPayment = await initializePaystackTransaction(totalCourseAmount * 100, currentUser.dataValues.email);

    // create a course subscription record and save the payment reference
    await Promise.all(
      createSubscription.map(async (subscription) => {
        Object.assign(subscription, { payment_reference: initializedPayment.data.reference });
        return db.course_subscription.create(subscription);
      })
    );
    return initializedPayment.data.authorization_url;
  }
};

/**
 * Get all amount
 * @param {String} reference
 * @returns {Promise<Number>}
 */
const getAllAmount = async (reference) => {
  const courseSubscription = await db.course_subscription.findAll({ where: { payment_reference: reference } });

  const courseAmount = courseSubscription.reduce((acc, curr) => acc + curr.dataValues.amount, 0);

  return courseAmount;
};

/**
 * Update order
 * @param {Object} orderBody
 * @returns {Promise<Order>}
 */
const updateOrder = async (orderBody) => {
  const {
    message,
    data: { reference, id, status, amount },
  } = orderBody;

  // resolve amount received and amount expected
  const expectedAmount = await getAllAmount(reference);

  if (expectedAmount === amount / 100) {
    // update course subscription
    await db.course_subscription.update(
      { status, transaction_id: id, reason: message },
      { where: { payment_reference: reference } }
    );

    return orderBody;
  }

  // update course subscription with failed status
  await db.course_subscription.update(
    { status: 'failed', transaction_id: id, reason: 'Amount received does not match amount expected' },
    { where: { payment_reference: reference } }
  );

  throw new ApiError(httpStatus.BAD_REQUEST, 'Amount received does not match amount expected');
};

module.exports = {
  handleOrder,
  updateOrder,
};

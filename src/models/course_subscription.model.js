const sequelizePaginate = require('sequelize-paginate');
/**
 * @typedef {import('sequelize').Model} SequelizeModel
 * @typedef {import('sequelize').DataTypes} DataTypes
 * @typedef {import('sequelize').Sequelize} Sequelize
 *
 * @typedef {Object} CourseSubscriptionAttributes
 * @property {number} transaction_id
 * @property {'pending' | 'success' | 'failed'} status
 * @property {number} amount
 * @property {'paystack' | 'bank'} payment_method
 * @property {string} payment_reference
 * @property {string} reason
 */

/**
 * @param {Sequelize} sequelize
 * @param {DataTypes} dataType
 * @returns {SequelizeModel & CourseSubscriptionAttributes}
 */
module.exports = (sequelize, dataType) => {
  const courseSubscription = sequelize.define('course_subscription', {
    transaction_id: {
      type: dataType.BIGINT({
        unsigned: true,
      }),
    },
    status: {
      type: dataType.ENUM('pending', 'success', 'failed'),
      defaultValue: 'pending',
    },
    amount: {
      type: dataType.INTEGER(200),
    },
    payment_method: {
      type: dataType.ENUM('paystack', 'bank'),
      defaultValue: 'paystack',
    },
    payment_reference: {
      type: dataType.STRING,
    },
    reason: {
      type: dataType.STRING,
    },
  });
  sequelizePaginate.paginate(courseSubscription);
  return courseSubscription;
};

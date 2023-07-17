const sequelizePaginate = require('sequelize-paginate');

/**
 * @typedef {import('sequelize').Model} SequelizeModel
 * @typedef {import('sequelize').DataTypes} DataTypes
 * @typedef {import('sequelize').Sequelize} Sequelize
 *
 * @typedef {Object} PostAttributes
 * @property {string} title
 * @property {string} body
 * @property {boolean} isReported
 * @property {string} reportReason
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @param {Sequelize} sequelize
 * @param {DataTypes} dataType
 * @returns {SequelizeModel & PostAttributes}
 */
module.exports = (sequelize, dataType) => {
  const post = sequelize.define('post', {
    title: {
      type: dataType.STRING,
      allowNull: false,
    },
    body: {
      type: dataType.STRING,
      allowNull: false,
    },
    isReported: {
      type: dataType.BOOLEAN,
      defaultValue: false,
    },
    reportReason: {
      type: dataType.STRING,
    },
  });

  sequelizePaginate.paginate(post);
  return post;
};

const sequelizePaginate = require('sequelize-paginate');

/**
 * @typedef {import('sequelize').Model} SequelizeModel
 * @typedef {import('sequelize').DataTypes} DataTypes
 * @typedef {import('sequelize').Sequelize} Sequelize
 *
 * @typedef {Object} CommentAttributes
 * @property {string} comment
 * @property {boolean} isReported
 * @property {string} reportReason
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @param {Sequelize} sequelize
 * @param {DataTypes} dataType
 * @returns {SequelizeModel & CommentAttributes}
 */
module.exports = (sequelize, dataType) => {
  const comment = sequelize.define('comment', {
    comment: {
      type: dataType.STRING,
      allowNull: false,
      trim: true,
    },
    isReported: {
      type: dataType.BOOLEAN,
      defaultValue: false,
    },
    reportReason: {
      type: dataType.STRING,
    },
  });

  sequelizePaginate.paginate(comment);

  return comment;
};

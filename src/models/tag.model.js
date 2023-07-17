const sequelizePaginate = require('sequelize-paginate');

/**
 * @typedef {import('sequelize').Model} SequelizeModel
 * @typedef {import('sequelize').DataTypes} DataTypes
 * @typedef {import('sequelize').Sequelize} Sequelize
 *
 * @typedef {Object} TagAttributes
 * @property {number} id
 * @property {string} name
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @param {Sequelize} sequelize
 * @param {DataTypes} dataType
 * @returns {SequelizeModel & TagAttributes}
 */
module.exports = (sequelize, dataType) => {
  const tag = sequelize.define('tag', {
    name: {
      type: dataType.STRING,
      allowNull: false,
    },
    isDeleted: {
      type: dataType.BOOLEAN,
      defaultValue: false,
    },
  });
  sequelizePaginate.paginate(tag);

  return tag;
};

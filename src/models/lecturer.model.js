const sequelizePaginate = require('sequelize-paginate');

/**
 * @typedef {import('sequelize').Model} SequelizeModel
 * @typedef {import('sequelize').DataTypes} DataTypes
 * @typedef {import('sequelize').Sequelize} Sequelize
 *
 * @typedef {Object} LecturerAttributes
 * @property {number} lecturerId
 * @property {string} courseSessionId
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @param {Sequelize} sequelize
 * @param {DataTypes} dataType
 * @returns {SequelizeModel & LecturerAttributes}
 */
module.exports = (sequelize, dataType) => {
  const lecturer = sequelize.define('lecturer', {
    id: {
      type: dataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
  });
  sequelizePaginate.paginate(lecturer);

  return lecturer;
};

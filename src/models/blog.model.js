const sequelizePaginate = require('sequelize-paginate');

/**
 * @typedef {import('sequelize').Model} SequelizeModel
 * @typedef {import('sequelize').DataTypes} DataTypes
 * @typedef {import('sequelize').Sequelize} Sequelize
 *
 * @typedef {Object} BlogAttributes
 * @property {number} id
 * @property {string} title
 * @property {string} content
 * @property {string} image
 * @property {string} slug
 * @property {'draft' | 'published'} status
 * @property {number} authorId
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @param {Sequelize} sequelize
 * @param {DataTypes} dataType
 * @returns {SequelizeModel & BlogAttributes}
 */
module.exports = (sequelize, dataType) => {
  const blog = sequelize.define('blog', {
    title: {
      type: dataType.STRING,
      allowNull: false,
      trim: true,
    },
    content: {
      type: dataType.STRING(5000),
      allowNull: false,
      trim: true,
    },
    image: {
      type: dataType.STRING,
      allowNull: false,
      trim: true,
    },
    slug: {
      type: dataType.STRING,
      allowNull: false,
      trim: true,
    },
    status: {
      type: dataType.ENUM,
      values: ['draft', 'published'],
      defaultValue: 'draft',
    },
  });
  sequelizePaginate.paginate(blog);

  return blog;
};

const { Op } = require('sequelize');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { db } = require('../models');

/**
 * Get tags
 * @param {Object} filter - Sequelize filter
 * @param {string} filter.name
 * @returns {Promise<Tag[]>}
 */
const getAllTags = async (filter) => {
  const options = {
    where: {
      name: {
        [Op.like]: `%${filter.name || ''}%`,
      },
      isDeleted: false,
    },
  };
  const tags = await db.tag.findAll(options);

  return tags;
};

/**
 * Create a tag
 * @param {Object} tagBody
 * @returns {Promise<Tag>}
 */
const createTag = async (tagBody) => {
  // check if the tag already exists
  const tagExist = await db.tag.findOne({ where: { name: tagBody.name } });

  if (tagExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Tag already exists');
  }

  return db.tag.create(tagBody);
};

/**
 * Delete tag by ID
 * @param {ObjectId} id
 * @returns {Promise<Tag>}
 */
const deleteTagById = async (id) => {
  const tagExist = await db.tag.findByPk(id);
  if (!tagExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Tag not found');
  }

  tagExist.isDeleted = true;
  await tagExist.save();
};

module.exports = {
  getAllTags,
  createTag,
  deleteTagById,
};

const { Op } = require('sequelize');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { db } = require('../models');
const { deleteUploadedFile } = require('./upload.service');

/**
 * Get blog posts
 * @param {Object} filter - Sequelize filter
 * @param {string} filter.title
 * @param {string} filter.status
 * @Param {Object} current
 * @param {number} current.page - current page
 * @param {number} current.limit - current limit
 * @param {string} current.sortby - sortby
 * @returns {Promise<Blog[]>}
 */
const getAllBlogPosts = async (filter, current) => {
  const options = {
    page: current.page, // Default 1
    paginate: current.limit, // Default 25
    where: {
      title: {
        [Op.like]: `%${filter.title || ''}%`,
      },
      status: {
        [Op.like]: `%${filter.status || ''}%`,
      },
    },
    include: [
      {
        model: db.user,
        attributes: ['id', 'firstName', 'lastName', 'profileImage'],
      },
    ],
    order: [['createdAt', current.sortby]],
  };
  const { docs, pages, total } = await db.blog.paginate(options);

  return { docs, limit: options.paginate, totalPages: pages, totalResults: total };
};

/**
 * Get blog post by ID
 * @param {ObjectId} id
 * @returns {Promise<Blog>}
 */
const getBlogPostById = async (id) => {
  return db.blog.findByPk(id, {
    include: [
      {
        model: db.user,
        attributes: ['id', 'firstName', 'lastName', 'profileImage'],
      },
    ],
  });
};

/**
 * Create a blog post
 * @param {Object} blogBody
 * @param {string} blogBody.title
 * @param {string} blogBody.content
 * @param {string} blogBody.image
 * @param {string} blogBody.slug
 * @param {ObjectId} authorId
 * @returns {Promise<Blog>}
 */
const createBlogPost = async (blogBody, authorId) => {
  // check if slug already exists
  const slugExists = await db.blog.findOne({ where: { slug: blogBody.slug } });
  if (slugExists) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Slug already exists');
  }
  return db.blog.create({ ...blogBody, authorId });
};

/**
 * Delete blog post by ID
 * @param {ObjectId} id
 * @returns {Promise<Blog>}
 */
const deleteBlogPostById = async (id) => {
  const blog = await getBlogPostById(id);
  if (!blog) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Blog post not found');
  }

  // delete image from cloudinary
  if (blog.dataValues.image) await deleteUploadedFile(blog.dataValues.image);

  await blog.destroy();
  return blog;
};

/**
 * Update blog post by ID
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @param {string} updateBody.title
 * @param {string} updateBody.content
 * @param {string} updateBody.image
 * @param {string} updateBody.slug
 * @returns {Promise<Blog>}
 */
const updateBlogPostById = async (id, updateBody) => {
  const blog = await getBlogPostById(id);
  if (!blog) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Blog post not found');
  }

  const oldImage = blog.dataValues.image;
  // if image is in updateBody, delete the old image
  if (updateBody.image && updateBody.image !== oldImage && oldImage) {
    await deleteUploadedFile(oldImage);
  }

  Object.assign(blog, updateBody);
  await blog.save();
};

/**
 * Get all published blog posts
 * @param {Object} filter - Sequelize filter
 * @param {string} filter.title
 * @Param {Object} current
 * @param {number} current.page - current page
 * @param {number} current.limit - current limit
 * @param {string} current.sortby - sortby
 * @returns {Promise<Blog[]>}
 */
const getAllPublishedBlogPosts = async (filter, current) => {
  const options = {
    page: current.page, // Default 1
    paginate: current.limit, // Default 25
    where: {
      status: 'published',
      title: {
        [Op.like]: `%${filter.title || ''}%`,
      },
    },
    include: [
      {
        model: db.user,
        attributes: ['id', 'firstName', 'lastName', 'profileImage'],
      },
    ],
    order: [['createdAt', current.sortby]],
  };
  const { docs, pages, total } = await db.blog.paginate(options);

  return { docs, limit: options.paginate, totalPages: pages, totalResults: total };
};

module.exports = {
  getAllBlogPosts,
  getBlogPostById,
  createBlogPost,
  deleteBlogPostById,
  updateBlogPostById,
  getAllPublishedBlogPosts,
};

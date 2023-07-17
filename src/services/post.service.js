const httpStatus = require('http-status');
const { literal } = require('sequelize');
const ApiError = require('../utils/ApiError');
const { db } = require('../models');

/**
 * Get post by Id
 * @param {ObjectId} id
 * @returns {Promise<Post>}
 */
const getPostById = async (id) => {
  return db.post.findByPk(id, {
    include: [
      {
        model: db.user,
        attributes: ['id', 'username', 'email', 'firstName', 'lastName'],
      },
      {
        model: db.tag,
        attributes: ['id', 'name'],
      },
    ],
  });
};

/**
 * Create a post
 * @param {Object} postBody
 * @param {ObjectId} currentUser
 * @returns {Promise<Post>}
 */
const createPost = async (postBody, currentUser) => {
  const { forumId, tags = null } = postBody;

  // check if the forum exists
  // TODO: Update to forum service
  const forumExist = await db.forum.findByPk(forumId);

  if (!forumExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Forum does not exist');
  }

  // create the post
  const createdPost = await db.post.create({ ...postBody, senderId: currentUser.dataValues.id });

  // link the tags to the post
  createdPost.setTags(tags);

  return getPostById(createdPost.dataValues.id);
};

/**
 * Update post by id
 * @param {ObjectId} postId
 * @param {Object} updateBody
 * @param {ObjectId} currentUser
 * @returns {Promise<Post>}
 */
const updatePostById = async (postId, updateBody, currentUser) => {
  const postExist = await getPostById(postId);
  if (!postExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
  }
  const isAdmin = currentUser.dataValues.roles.includes('admin');
  // check if the user owns the post or if they are an admin
  if (postExist.dataValues.senderId !== currentUser.dataValues.id && !isAdmin) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized to update this post');
  }

  // update post
  Object.assign(postExist, updateBody);
  await postExist.save();

  // link the tags to the post
  if (updateBody.tags) {
    // remove all tags from the post
    await postExist.removeTags();
    // add the new tags to the post
    postExist.setTags(updateBody.tags);
  }

  return getPostById(postExist.dataValues.id);
};

/**
 * Delete post by id
 * @param {ObjectId} postId
 * @param {ObjectId} currentUser
 * @returns {Promise<Post>}
 */
const deletePostById = async (postId, currentUser) => {
  const postExist = await getPostById(postId);
  if (!postExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
  }

  const isAdmin = currentUser.dataValues.roles.includes('admin');
  // check if the user owns the post or if they are an admin
  if (postExist.dataValues.senderId !== currentUser.dataValues.id && !isAdmin) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized to delete this post');
  }

  await postExist.destroy();
  return postExist;
};

/**
 * Get all posts by forum id
 * @param {ObjectId} forumId
 * @param {number} curremt.page
 * @param {number} current.limit
 * @returns {Promise<Posts>}
 */
const getAllPostsByForumId = async (forumId, current) => {
  const options = {
    page: current.page,
    paginate: current.limit,
    where: {
      forumId,
    },
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: db.user,
        attributes: ['id', 'firstName', 'lastName'],
      },
      {
        model: db.tag,
        attributes: ['id', 'name'],
      },
    ],
  };

  const { docs, pages, total } = await db.post.paginate(options);

  const postIds = docs.map((post) => post.id);

  // get the number of comments for each post
  const commentsCount = await db.comment.findAll({
    attributes: ['postId', [literal('COUNT(*)'), 'count']],
    where: {
      postId: postIds,
    },
    group: ['postId'],
  });

  // add the number of comments to each post
  docs.forEach((post) => {
    const commentCount = commentsCount.find((comment) => comment.postId === post.id);
    Object.assign(post.dataValues, { commentsCount: commentCount ? commentCount.dataValues.count : 0 });
  });

  return { docs, pages, total, page: current.page, limit: options.paginate, totalPages: pages, totalResults: total };
};

/**
 * Report a post
 * @param {ObjectId} postId
 * @param {Object} reportBody
 * @param {boolean} reportBody.isReported
 * @param {string} reportBody.reportReason
 * @returns {Promise<Post>}
 */
const reportPostById = async (postId, reportBody) => {
  const postExist = await getPostById(postId);
  if (!postExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
  }

  // update post
  Object.assign(postExist, reportBody);
  await postExist.save();

  return {
    success: true,
    message: 'Post reported successfully',
  };
};

const allReportedPost = async () => {
  const reportedPost = await db.post.findAll({ where: { isReported: true } });
  return reportedPost;
};

module.exports = {
  getPostById,
  createPost,
  updatePostById,
  deletePostById,
  getAllPostsByForumId,
  reportPostById,
  allReportedPost,
};

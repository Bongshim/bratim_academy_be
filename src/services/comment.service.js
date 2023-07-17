const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { db } = require('../models');
const { getPostById } = require('./post.service');

/**
 * Get comment by Id
 * @param {ObjectId} id
 * @returns {Promise<Comment>}
 */
const getCommentById = async (id) => {
  return db.comment.findByPk(id, {
    include: [
      {
        model: db.user,
        attributes: ['id', 'username', 'email', 'firstName', 'lastName'],
      },
    ],
  });
};

/**
 * Get comments by post ID
 * @param {ObjectId} postId
 * @param {number} curremt.page
 * @param {number} current.limit
 * @returns {Promise<Comment>}
 */
const getCommentsByPostId = async (postId, current) => {
  const options = {
    page: current.page,
    paginate: current.limit,
    order: [['createdAt', 'DESC']],
    where: { postId },
    include: [
      {
        model: db.user,
        attributes: ['id', 'firstName', 'lastName'],
      },
    ],
  };

  const { docs, pages, total } = await db.comment.paginate(options);
  return { docs, pages, total, page: current.page, limit: options.paginate, totalPages: pages, totalResults: total };
};

/**
 * Create a comment
 * @param {Object} commentBody
 * @param {ObjectId} currentUser
 * @returns {Promise<Comment>}
 */
const createComment = async (commentBody, currentUser) => {
  const { postId } = commentBody;

  // check if the post exists
  const postExist = await getPostById(postId);

  if (!postExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Post does not exist');
  }

  // create the comment
  const createdComment = await db.comment.create({ ...commentBody, senderId: currentUser.dataValues.id });
  return getCommentById(createdComment.dataValues.id);
};

/**
 * Update comment by id
 * @param {ObjectId} commentId
 * @param {Object} updateBody
 * @param {ObjectId} currentUser
 * @returns {Promise<Comment>}
 */
const updateCommentById = async (commentId, updateBody, currentUser) => {
  const commentExist = await getCommentById(commentId);
  if (!commentExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
  }

  const isAdmin = currentUser.dataValues.roles.includes('admin');
  // check if the user owns the comment or if they are an admin
  if (commentExist.dataValues.senderId !== currentUser.dataValues.id && !isAdmin) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized to update this comment');
  }

  // update the comment
  await db.comment.update(updateBody, { where: { id: commentId } });
  return getCommentById(commentId);
};

/**
 * Delete comment by id
 * @param {ObjectId} commentId
 * @param {ObjectId} currentUser
 * @returns {Promise<Comment>}
 */
const deleteCommentById = async (commentId, currentUser) => {
  const commentExist = await getCommentById(commentId);
  if (!commentExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
  }

  const isAdmin = currentUser.dataValues.roles.includes('admin');
  // check if the user owns the comment or if they are an admin
  if (commentExist.dataValues.senderId !== currentUser.dataValues.id && !isAdmin) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized to delete this comment');
  }

  // delete the comment
  await commentExist.destroy();
  return commentExist;
};

/**
 * Report a comment
 * @param {ObjectId} commentId
 * @param {Object} reportBody
 * @param {boolean} reportBody.isReported
 * @param {string} reportBody.reportReason
 * @returns {Promise<Comment>}
 */
const reportCommentById = async (commentId, reportBody) => {
  const commentExist = await getCommentById(commentId);
  if (!commentExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
  }

  // update the comment
  Object.assign(commentExist, reportBody);
  await commentExist.save();

  return {
    status: 'success',
    message: 'Comment reported successfully',
  };
};

const allReportedComments = async () => {
  const reportedComments = await db.comment.findAll({
    where: { isReported: true },
  });
  return reportedComments;
};

module.exports = {
  getCommentById,
  createComment,
  updateCommentById,
  deleteCommentById,
  reportCommentById,
  allReportedComments,
  getCommentsByPostId,
};

const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { postValidation } = require('../../validations');
const { postController } = require('../../controllers');

const router = express.Router();

router.route('/').post(auth('posts.manage'), validate(postValidation.createPost), postController.createPost);

router
  .route('/forums/:forumId')
  .get(auth('posts.view'), validate(postValidation.getAllPostsByForumId), postController.getAllPostsByForumId);

router.route('/allReportedPost').get(auth(), postController.reportedPosts);

router
  .route('/:postId')
  .get(auth('posts.view'), validate(postValidation.getPostById), postController.getPostById)
  .patch(auth('posts.manage'), validate(postValidation.updatePostById), postController.updatePostById)
  .delete(auth('posts.manage'), validate(postValidation.deletePostById), postController.deletePostById);

router.route('/:postId/report').post(auth(), validate(postValidation.reportPostById), postController.reportPostById);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Post management and retrieval
 */

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a post
 *     description: Only signed in users can create posts.
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - body
 *               - forumId
 *             properties:
 *               title:
 *                 type: string
 *               body:
 *                 type: string
 *               forumId:
 *                 type: integer
 *               tags:
 *                 type: array
 *                 items:
 *                   type: integer
 *             example:
 *               title: Announcement
 *               body: Welcome to this course. You can ask questions here.
 *               forumId: 1
 *               tags: [1, 2]
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Post'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get a post
 *     description: Logged in users can fetch posts by Id.
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Post'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a post
 *     description: Only owners can update posts.
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               body:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: integer
 *             example:
 *               title: Announcement
 *               body: Welcome to this course. You can ask questions here.
 *               tags: [1, 2]
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Post'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a post
 *     description: Only admins and owners can delete a post.
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post id
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /posts/forums/{forumId}:
 *   get:
 *     summary: Get posts by forumId
 *     description: Logged in users can fetch posts by forumId.
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: forumId
 *         required: true
 *         schema:
 *           type: string
 *         description: forum id
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 25
 *         description: Maximum number of forums
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/PostList'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /posts/{id}/report:
 *   post:
 *     summary: Report a post
 *     description: Only admins can moderate posts
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reportReason:
 *                 type: string
 *               isReported:
 *                 type: boolean
 *             example:
 *               reportReason: This post is inappropriate
 *               isReported: true
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  success: boolean
 *                  message: string
 *                example:
 *                   success: true
 *                   message: Post reported successfully
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /posts/allReportedPost:
 *   get:
 *     summary: Get all reported posts
 *     description: Logged in users can fetch all reported posts
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Post'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

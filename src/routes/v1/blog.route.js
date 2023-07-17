const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { blogValidation } = require('../../validations');
const { blogController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('blog.manage'), validate(blogValidation.createBlogPost), blogController.createBlogPost)
  .get(validate(blogValidation.getBlogPosts), blogController.getAllBlogPosts);

router.route('/published').get(validate(blogValidation.getBlogPublishedPosts), blogController.getAllPublishedBlogPosts);

router
  .route('/:blogId')
  .get(validate(blogValidation.getBlogPost), blogController.getBlogPostById)
  .patch(auth('blog.manage'), validate(blogValidation.updateBlogPost), blogController.updateBlogPostById)
  .delete(auth('blog.manage'), validate(blogValidation.deleteBlogPost), blogController.deleteBlogPostById);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Blogs
 *   description: Blog management and retrieval
 */

/**
 * @swagger
 * /blogs:
 *   post:
 *     summary: Create a blog post
 *     description: Only admins can create blogs.
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Blog'
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Blog'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all blog posts
 *     description: All users can get blog posts.
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Blog title
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, published]
 *         description: Blog status
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *         description: page number
 *       - in: query
 *         name: sortby
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 25
 *         description: Maximum number of categories to return. Default is 25.
 *
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BlogList'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /blogs/published:
 *   get:
 *     summary: Get all blog posts
 *     description: All users can get blog posts.
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Blog title
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *         description: page number
 *       - in: query
 *         name: sortby
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 25
 *         description: Maximum number of categories to return. Default is 25.
 *
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BlogList'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /blogs/{id}:
 *   get:
 *     summary: Get a blog post
 *     description: All users can get blog post.
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Blog'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a blog post
 *     description: Only admins can update blog posts.
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Blog'
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Blog'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a blog
 *     description: Only admins can delete a blog post.
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog post id
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

const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { categoryValidation } = require('../../validations');
const { categoryController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('categories.manage'), validate(categoryValidation.createCategory), categoryController.createCategory)
  .get(categoryController.getCategories);

router.route('/courses').get(validate(categoryValidation.getCategories), categoryController.getAllCourseCategories);

router
  .route('/session/:categoryId')
  .get(validate(categoryValidation.getCategories), categoryController.getCourseSessionByCategory);

router
  .route('/:categoryId')
  .get(validate(categoryValidation.getCategory), categoryController.getCategoryById)
  .patch(auth('categories.manage'), validate(categoryValidation.updateCategory), categoryController.updateCategoryById)
  .delete(auth('categories.manage'), validate(categoryValidation.deleteCategory), categoryController.deleteCategoryById);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management and retrieval
 */

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a category
 *     description: Only admins can create categories.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - icon
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               icon:
 *                 type: string
 *               parentId:
 *                 type: integer
 *             example:
 *               name: Courses
 *               description: All courses
 *               icon: http://iconImg
 *               parentId: 0
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Category'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all categories
 *     description: All users can get categories.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
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
 *                     $ref: '#/components/schemas/Category'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /categories/courses:
 *   get:
 *     summary: Get all course categories
 *     description: Only signed in users can get categories.
 *     tags: [Categories]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: name of the category
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
 *                     $ref: '#/components/schemas/Category'
 *                 limit:
 *                   type: integer
 *                   example: 25
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /categories/session/{id}:
 *   get:
 *     summary: Get all course session by category id
 *     description: All users can get course session by category id.
 *     tags: [Categories]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: category id
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *         description: page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 25
 *         description: Maximum number of categories to return. Default is 25.
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
 *                     $ref: '#/components/schemas/CourseSession'
 *                 limit:
 *                   type: integer
 *                   example: 25
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get a category
 *     description: All users can get categories.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Category'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a category
 *     description: Only admins can update categories.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               icon:
 *                 type: string
 *               parentId:
 *                 type: integer
 *             example:
 *               name: Courses
 *               description: All courses
 *               icon: http://iconImg
 *               parentId: 0
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Category'
 *       "400":
 *         $ref: '#/components/responses/DuplicateCategory'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a category
 *     description: Only admins can delete a category.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category id
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

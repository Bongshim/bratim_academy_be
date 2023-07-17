const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { courseValidation } = require('../../validations');
const { courseController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('courses.manage'), validate(courseValidation.createCourse), courseController.createCourse)
  .get(validate(courseValidation.getAllCourses), courseController.getCourses);

router
  .route('/:courseId')
  .get(validate(courseValidation.getCourse), courseController.getCourseById)
  .patch(auth('courses.manage'), validate(courseValidation.updateCourse), courseController.updateCourse)
  .delete(auth('courses.manage'), validate(courseValidation.deleteCourse), courseController.deleteCourse);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Course management and retrieval
 */

/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Create a course
 *     description: Only admins can create courses.
 *     tags: [Courses]
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
 *               - description
 *               - slug
 *               - image
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               slug:
 *                 type: string
 *               image:
 *                 type: string
 *               categoryId:
 *                 type: integer
 *             example:
 *               title: Courses
 *               description: All courses
 *               slug: http://www.
 *               image: http://Img
 *               categoryId: 0
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Course'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all courses
 *     description: Only signed in users can get courses.
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: title
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *         description: Start date (date created) in the form of YYYY-MM-DD
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *         description: End date (date created) in the form of YYYY-MM-DD
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
 *         description: Maximum number of courses
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
 *                     $ref: '#/components/schemas/Course'
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
 */

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: Get a course
 *     description: Logged in users can fetch courses by Id.
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Course'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a course
 *     description: Only admins can update courses.
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               slug:
 *                 type: string
 *               image:
 *                 type: string
 *               categoryId:
 *                 type: integer
 *             example:
 *               title: Courses
 *               description: All courses
 *               slug: http://www.
 *               image: http:/www.
 *               categoryId: 0
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Course'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a course
 *     description: Only admins can delete a course.
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course id
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

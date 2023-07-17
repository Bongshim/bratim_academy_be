const express = require('express');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const { courseResourceValidation } = require('../../validations');
const { courseResourceController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .get(
    auth('course_resource.view'),
    validate(courseResourceValidation.queryCourseResources),
    courseResourceController.getAllCourseResources
  );

router
  .route('/batch/:courseSessionId')
  .post(
    auth('course_resource.manage'),
    validate(courseResourceValidation.createBatchCourseResource),
    courseResourceController.createBatchCourseResource
  )
  .put(
    auth('course_resource.manage'),
    validate(courseResourceValidation.updateBatchCourseResources),
    courseResourceController.updateBatchCourseResources
  );

router
  .route('/:courseResourceId')
  .get(
    auth('course_resource.view'),
    validate(courseResourceValidation.getCourseResourceById),
    courseResourceController.getCourseResourceById
  )
  .patch(
    auth('course_resource.manage'),
    validate(courseResourceValidation.updateCourseResource),
    courseResourceController.updateCourseResourceById
  )
  .delete(
    auth('course_resource.view'),
    validate(courseResourceValidation.deleteCourseResourceById),
    courseResourceController.deleteCourseResourceById
  );

router.route('/:courseResourceId/view').get(auth('course_resource.view'), courseResourceController.viewCourseResourceLink);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Course Resources
 *   description: Course resource management and retrieval
 */

/**
 * @swagger
 * /course-resources/:
 *   get:
 *     summary: Get all course resources
 *     description: Only admins can get all course resources.
 *     tags: [Course Resources]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Resource title
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Results per page
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CourseResource'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 * components:
 *   schemas:
 *     CourseResource:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the course resource.
 *         description:
 *           type: string
 *           description: The description of the course resource.
 *         resource_type:
 *           type: string
 *           description: The type of the course resource.
 *         url:
 *           type: string
 *           description: The URL of the course resource.
 *         courseSessionId:
 *           type: integer
 *           description: The ID of the course session related to the resource.
 *       required:
 *         - title
 *         - description
 *         - resource_type
 *         - url
 *         - courseSessionId
 *   responses:
 *     Unauthorized:
 *       description: Unauthorized
 *     Forbidden:
 *       description: Forbidden
 */

/**
 * @swagger
 * /course-resources/{id}:
 *   get:
 *     summary: Get a course resource
 *     description: Only paid users can get course resource.
 *     tags: [Course Resources]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course resource id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/CourseResource'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update course resource
 *     description: Only admins can update a course resource.
 *     tags: [Course Resources]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course resource id
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
 *               resource_type:
 *                 type: string
 *               url:
 *                 type: string
 *               courseSessionId:
 *                 type: number
 *             example:
 *               title: Class
 *               description: link to class
 *               resource_type: link
 *               url: http://example.com
 *               courseSessionId: 1
 *
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/CourseResource'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a course resource
 *     description: Only admins can delete course resource.
 *     tags: [Course Resources]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course resource id
 *     responses:
 *       "204":
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
 * /course-resources/batch/{courseSessionId}:
 *   post:
 *     summary: Create course resources
 *     description: Only admins can create course resources. Allows batch creation of course resources.
 *     tags: [Course Resources]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseSessionId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Course session id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/CreateCourseResource'
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CourseResource'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   put:
 *     summary: Update course resources
 *     description: Only admins can update course resources. Allows bulk update of course resources.
 *     tags: [Course Resources]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseSessionId
 *         required: false
 *         schema:
 *           type: string
 *         description: Course session id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/CreateCourseResource'
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CourseResource'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /course-resources/{id}/view:
 *   get:
 *     summary: View a course resource link
 *     description: Only subscribers can view a course resource link.
 *     tags: [Course Resources]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course resource id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

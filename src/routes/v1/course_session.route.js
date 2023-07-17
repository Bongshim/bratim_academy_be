const express = require('express');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const { courseSessionValidation } = require('../../validations');
const { courseSessionController } = require('../../controllers');
const { canGetAllRecords } = require('../../middlewares/access');

const router = express.Router();

router
  .route('/')
  .post(
    auth('course_session.manage'),
    validate(courseSessionValidation.createCourseSession),
    courseSessionController.createCourseSession
  )
  .get(validate(courseSessionValidation.getCourseSessions), canGetAllRecords, courseSessionController.getAllCourseSessions);

router
  .route('/:courseSessionId')
  .get(
    validate(courseSessionValidation.getCourseSessionById),
    canGetAllRecords,
    courseSessionController.getCourseSessionById
  )
  .patch(
    auth('course_session.manage'),
    validate(courseSessionValidation.updateCourseSession),
    courseSessionController.updateCourseSessionById
  )
  .delete(
    auth('course_session.manage'),
    validate(courseSessionValidation.deleteCourseSessionById),
    courseSessionController.deleteCourseSessionById
  );

router.route('/:courseSessionId/view').get(auth('course_session.view'), courseSessionController.viewSessionLink);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Course Sesions
 *   description: Course session management and retrieval
 */

/**
 * @swagger
 * /course-sessions:
 *   post:
 *     summary: Create a course sesion
 *     description: Only admins can create course sesions.
 *     tags: [Course Sesions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CourseSession'
 *           example:
 *             title: CS 101
 *             description: Introduction to Computer Science
 *             cost: 2000
 *             enrollment_deadline: 2023-01-12T16:18:04.793Z
 *             start_date: 2023-02-12T16:18:04.793Z
 *             end_date: 2023-05-12T16:18:04.793Z
 *             image: http://example.com
 *             link: http://example.com
 *             courseId: 1
 *             lecturersIds: [1, 5]
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/CourseSession'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *   get:
 *     summary: Get all course sessions
 *     description: Only admins can retrieve all course sessions.
 *     tags: [Course Sesions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: lecturerId
 *         schema:
 *           type: number
 *         description: lecturerId
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
 *         description: Maximum number of course sessions to return.
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
 */

/**
 * @swagger
 * /course-sessions/{id}:
 *   get:
 *     summary: Get a course session
 *     description: Only admins can fetch a course session.
 *     tags: [Course Sesions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course session id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/CourseSession'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update course session
 *     description: Only admins can update a course session.
 *     tags: [Course Sesions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course session id
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
 *               cost:
 *                 type: number
 *               image:
 *                 type: string
 *               link:
 *                 type: string
 *               enrollment_deadline:
 *                 type: string
 *               start_date:
 *                 type: string
 *               end_date:
 *                 type: string
 *               courseId:
 *                 type: number
 *               lecturersIds:
 *                 type: array
 *                 items:
 *                   type: number
 *             example:
 *               title: CS 101
 *               description: Introduction to Computer Science
 *               cost: 2000
 *               enrollment_deadline: 2023-01-12T16:18:04.793Z
 *               start_date: 2023-02-12T16:18:04.793Z
 *               end_date: 2023-05-12T16:18:04.793Z
 *               image: http://example.com
 *               link: http://example.com
 *               courseId: 1
 *               lecturersIds: [1, 5]
 *
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/CourseSession'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a course session
 *     description: Only admins can delete course session.
 *     tags: [Course Sesions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course session id
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
 * /course-sessions/{id}/view:
 *   get:
 *     summary: View a course session link
 *     description: Only subscribers can view a course session link.
 *     tags: [Course Sesions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course session id
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

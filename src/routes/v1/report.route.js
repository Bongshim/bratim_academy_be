const express = require('express');
const auth = require('../../middlewares/auth');
const { reportController } = require('../../controllers');
const { reportValidation } = require('../../validations');
const validate = require('../../middlewares/validate');

const router = express.Router();

router.get(
  '/subscribed-course',
  auth(),
  validate(reportValidation.getSubscriptions),
  reportController.getSubscribedCourseReport
);
router.get(
  '/subscribed-course/:courseSessionId',
  auth(),
  validate(reportValidation.getSubscribedCourseReportById),
  reportController.getSubscribedCourseReportById
);

module.exports = router;

/**
 * @swagger
 * /reports/subscribed-course:
 *   get:
 *     summary: Get course purchase summarized report
 *     description: All course purchase summarized report.
 *     tags: [Report]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date YYYY/MM/DD
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date YYYY/MM/DD
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Enter title of course session
 *       - in: query
 *         name: description
 *         schema:
 *           type: string
 *         description: Enter description of course session
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
 */

/**
 * @swagger
 * /reports/subscribed-course/{id}:
 *   get:
 *     summary: Get report by course session id
 *     description: Get report of a course session
 *     tags: [Report]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         description: enter course session id
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date YYYY/MM/DD
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date YYYY/MM/DD
 *       - in: query
 *         name: payment_reference
 *         schema:
 *           type: string
 *         description: enter payment ref
 *       - in: query
 *         name: payment_method
 *         schema:
 *           type: string
 *         description: enter payment method
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *           format: email
 *         description: enter your email
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
 */

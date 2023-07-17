const express = require('express');
const auth = require('../../middlewares/auth');
const { purchaseController } = require('../../controllers');

const router = express.Router();

router.route('/course').get(auth(), purchaseController.getAllPurchasedCourseSession);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Purchase
 *   description: Purchase data retrieval
 */

/**
 * @swagger
 * /purchase/course:
 *   get:
 *     summary: Get all purchased courses
 *     description: Only signed in users and owners can get purchased courses.
 *     tags: [Purchase]
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
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 createdAt:
 *                   type: string
 *                   example: 2021-01-01T00:00:00.000Z
 *                 course_session:
 *                   $ref: '#/components/schemas/CourseSession'
 *                 course_resource:
 *                   $ref: '#/components/schemas/CourseResource'
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

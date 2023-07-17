const express = require('express');
const auth = require('../../middlewares/auth');
const { dashboardController } = require('../../controllers');

const router = express.Router();

router.route('/').get(auth(), dashboardController.getDashboardData);
router.route('/userdashboard/').get(auth(), dashboardController.getUserDashboard);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard management and retrieval
 */

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Get dashboard data
 *     description: All dashboard data.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /dashboard/userdashboard/:
 *   get:
 *     summary: Get user dashboard information
 *     description: Retrieve user dashboard information
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

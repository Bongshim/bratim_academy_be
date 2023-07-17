const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { orderValidation } = require('../../validations');
const { orderController } = require('../../controllers');

const router = express.Router();

router.route('/').post(auth(), validate(orderValidation.createOrder), orderController.handleOrder);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management and retrieval
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create an order
 *     description: Users can create orders.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - payment_method
 *             properties:
 *               course:
 *                 type: array
 *                 items:
 *                   type: integer
 *               paymentMethod:
 *                 type: string
 *             example:
 *               course: [1, 2]
 *               paymentMethod: paystack
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Order'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

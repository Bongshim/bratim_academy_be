const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');
const { canModifyUser } = require('../../middlewares/access');

const router = express.Router();

router
  .route('/')
  .post(auth('users.manage'), validate(userValidation.createUser), userController.createUser)
  .get(auth('users.view'), validate(userValidation.getUsers), userController.getUsers);

router.route('/me').get(auth('users.view'), userController.getMe);
router
  .route('/password')
  .patch(auth('users.manage'), validate(userValidation.updatePassword), userController.updateUserPassword);

router
  .route('/:userId')
  .get(auth('users.view'), validate(userValidation.getUser), userController.getUser)
  .patch(auth('users.manage'), canModifyUser, validate(userValidation.updateUser), userController.updateUser)
  .delete(auth('users.manage'), canModifyUser, validate(userValidation.deleteUser), userController.deleteUser);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and retrieval
 */

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get signed in user details
 *     description: Get currently signed in user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /users/password/:
 *   patch:
 *     summary: Update a user's password
 *     description: Logged in users can update their passwords.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *             example:
 *               oldPassword: password1
 *               newPassword: password2
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: boolean
 *                    example: true
 *                  message:
 *                    type: string
 *                    example: Password updated
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a user
 *     description: Only admins can create other users.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - phoneNumber
 *               - email
 *               - password
 *               - role
 *             properties:
 *               userName:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               middleName:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *               role:
 *                  type: string
 *                  enum: [user, admin]
 *             example:
 *               firstName: John
 *               lastName: Doe
 *               email: fake@example.com
 *               password: password1
 *               phoneNumber: 12345678
 *               role: user
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all users
 *     description: Only admins can retrieve all users.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userName
 *         schema:
 *           type: string
 *         description: Username
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: User email
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
 *         description: sort by query in the form of field
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 25
 *         description: Maximum number of users
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
 *                     $ref: '#/components/schemas/User'
 *                 limit:
 *                   type: integer
 *                   example: 10
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
 * /users/{id}:
 *   get:
 *     summary: Get a user
 *     description: Logged in users can fetch only their own user information. Only admins can fetch other users.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a user
 *     description: Logged in users can only update their own information. Only admins can update other users.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               middleName:
 *                 type: string
 *               profileImage:
 *                 type: string
 *               phoneNumber:
 *                 type: integer
 *               about:
 *                 type: string
 *               isEmailVerified:
 *                 type: boolean
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               role:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [user, admin]
 *             example:
 *               firstName: John
 *               lastName: Doe
 *               middleName: John
 *               userName: John
 *               profileImage: John
 *               about: I am a software developer
 *               isEmailVerified: true
 *               email: fake@example.com
 *               phoneNumber: 12345678
 *               role:
 *                 - user
 *                 - admin
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a user
 *     description: Logged in users can delete only themselves. Only admins can delete other users.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
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

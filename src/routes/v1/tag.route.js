const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { tagValidation } = require('../../validations');
const { tagController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(tagValidation.createTag), tagController.createTag)
  .get(validate(tagValidation.getTags), tagController.getAllTags);

router.route('/:tagId').delete(auth(), validate(tagValidation.deleteTag), tagController.deleteTagById);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Tags
 *   description: Tags management and retrieval
 */

/**
 * @swagger
 * /tags:
 *   post:
 *     summary: Create a tag post
 *     description: Only admins can create tags.
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tag'
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Tag'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all tags
 *     description: All users can get tags.
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: tag name
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TagList'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /tags/{id}:
 *   delete:
 *     summary: Delete a tag
 *     description: Only admins can delete a tag.
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: tag id
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

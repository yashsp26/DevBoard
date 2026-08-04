import { Router } from "express";

import authMiddleware from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";

import {
  createLabel,
  getLabels,
  updateLabel,
  deleteLabel,
} from "../controllers/label.controller.js";

import {
  createLabelSchema,
  updateLabelSchema,
  projectLabelsSchema,
  labelIdSchema,
} from "../validations/label.validation.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Labels
 *   description: Project label management APIs
 */

router.use(authMiddleware);

/**
 * @swagger
 * /projects/{projectId}/labels:
 *   post:
 *     summary: Create a label
 *     tags: [Labels]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/projects/:projectId/labels",
  validate(createLabelSchema),
  createLabel
);

/**
 * @swagger
 * /projects/{projectId}/labels:
 *   get:
 *     summary: Get all labels for a project
 *     tags: [Labels]
 *     security:
 *       - bearerAuth: []
 */
router.get(
  "/projects/:projectId/labels",
  validate(projectLabelsSchema),
  getLabels
);

/**
 * @swagger
 * /labels/{id}:
 *   patch:
 *     summary: Update a label
 *     tags: [Labels]
 *     security:
 *       - bearerAuth: []
 */
router.patch(
  "/labels/:id",
  validate(updateLabelSchema),
  updateLabel
);

/**
 * @swagger
 * /labels/{id}:
 *   delete:
 *     summary: Delete a label
 *     tags: [Labels]
 *     security:
 *       - bearerAuth: []
 */
router.delete(
  "/labels/:id",
  validate(labelIdSchema),
  deleteLabel
);

export default router;
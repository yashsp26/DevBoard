import { Router } from "express";

import authMiddleware from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";

import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  toggleFavorite,
  archiveProject,
  unarchiveProject,
} from "../controllers/project.controller.js";

import {
  createProjectSchema,
  updateProjectSchema,
  listProjectsSchema,
  projectIdSchema,
} from "../validations/project.validation.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Project management APIs
 */

router.use(authMiddleware);

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/",
  validate(createProjectSchema),
  createProject
);

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Get all projects
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 */
router.get(
  "/",
  validate(listProjectsSchema),
  getProjects
);

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Get project by id
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 */
router.get(
  "/:id",
  validate(projectIdSchema),
  getProjectById
);

/**
 * @swagger
 * /projects/{id}:
 *   patch:
 *     summary: Update project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 */
router.patch(
  "/:id",
  validate(updateProjectSchema),
  updateProject
);

/**
 * @swagger
 * /projects/{id}:
 *   delete:
 *     summary: Delete project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 */
router.delete(
  "/:id",
  validate(projectIdSchema),
  deleteProject
);

/**
 * @swagger
 * /projects/{id}/favorite:
 *   patch:
 *     summary: Toggle project favorite
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 */
router.patch(
  "/:id/favorite",
  validate(projectIdSchema),
  toggleFavorite
);

/**
 * @swagger
 * /projects/{id}/archive:
 *   patch:
 *     summary: Archive project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 */
router.patch(
  "/:id/archive",
  validate(projectIdSchema),
  archiveProject
);

/**
 * @swagger
 * /projects/{id}/unarchive:
 *   patch:
 *     summary: Unarchive project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 */
router.patch(
  "/:id/unarchive",
  validate(projectIdSchema),
  unarchiveProject
);

export default router;
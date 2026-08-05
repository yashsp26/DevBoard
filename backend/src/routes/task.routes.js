import { Router } from "express";

import authMiddleware from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";

import {
  createTask,
  getTasks,
  getTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from "../controllers/task.controller.js";

import {
  createTaskSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
  taskIdSchema,
  getTasksSchema,
} from "../validations/task.validation.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management APIs
 */

router.use(authMiddleware);

/**
 * @swagger
 * /projects/{projectId}/tasks:
 *   post:
 *     summary: Create a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/projects/:projectId/tasks",
  validate(createTaskSchema),
  createTask
);

/**
 * @swagger
 * /projects/{projectId}/tasks:
 *   get:
 *     summary: Get all tasks for a project
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 */
router.get(
  "/projects/:projectId/tasks",
  validate(getTasksSchema),
  getTasks
);

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 */
router.get(
  "/tasks/:id",
  validate(taskIdSchema),
  getTask
);

/**
 * @swagger
 * /tasks/{id}:
 *   patch:
 *     summary: Update a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 */
router.patch(
  "/tasks/:id",
  validate(updateTaskSchema),
  updateTask
);

/**
 * @swagger
 * /tasks/{id}/status:
 *   patch:
 *     summary: Update task status
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 */
router.patch(
  "/tasks/:id/status",
  validate(updateTaskStatusSchema),
  updateTaskStatus
);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 */
router.delete(
  "/tasks/:id",
  validate(taskIdSchema),
  deleteTask
);

export default router;
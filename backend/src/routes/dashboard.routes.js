import { Router } from "express";

import authMiddleware from "../middleware/auth.middleware.js";

import {
  getDashboard,
} from "../controllers/dashboard.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard APIs
 */

router.use(authMiddleware);

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Get dashboard data
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 */
router.get("/", getDashboard);

export default router;
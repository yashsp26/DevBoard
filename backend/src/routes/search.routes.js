import { Router } from "express";

import authMiddleware from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";

import { search } from "../controllers/search.controller.js";
import { searchSchema } from "../validations/search.validation.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Search
 *   description: Global search APIs
 */

router.use(authMiddleware);

/**
 * @swagger
 * /search:
 *   get:
 *     summary: Search across DevLupo resources
 *     tags: [Search]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: type
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - all
 *             - projects
 *             - tasks
 *             - notes
 *             - snippets
 *             - labels
 *         description: Resource type to search
 */
router.get("/", validate(searchSchema), search);

export default router;

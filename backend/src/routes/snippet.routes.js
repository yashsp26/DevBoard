import { Router } from "express";

import authMiddleware from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";

import {
  createSnippet,
  getSnippets,
  getSnippet,
  updateSnippet,
  deleteSnippet,
  toggleFavorite,
} from "../controllers/snippet.controller.js";

import {
  createSnippetSchema,
  getSnippetsSchema,
  updateSnippetSchema,
  snippetIdSchema,
  toggleFavoriteSchema,
} from "../validations/snippet.validation.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Snippets
 *   description: Code snippet management APIs
 */

router.use(authMiddleware);

/**
 * @swagger
 * /snippets:
 *   post:
 *     summary: Create a snippet
 *     tags: [Snippets]
 *     security:
 *       - bearerAuth: []
 */
router.post("/", validate(createSnippetSchema), createSnippet);

/**
 * @swagger
 * /snippets:
 *   get:
 *     summary: Get all snippets
 *     tags: [Snippets]
 *     security:
 *       - bearerAuth: []
 */
router.get("/", validate(getSnippetsSchema), getSnippets);

/**
 * @swagger
 * /snippets/{id}:
 *   get:
 *     summary: Get snippet by id
 *     tags: [Snippets]
 *     security:
 *       - bearerAuth: []
 */
router.get("/:id", validate(snippetIdSchema), getSnippet);

/**
 * @swagger
 * /snippets/{id}:
 *   patch:
 *     summary: Update snippet
 *     tags: [Snippets]
 *     security:
 *       - bearerAuth: []
 */
router.patch("/:id", validate(updateSnippetSchema), updateSnippet);

/**
 * @swagger
 * /snippets/{id}:
 *   delete:
 *     summary: Delete snippet
 *     tags: [Snippets]
 *     security:
 *       - bearerAuth: []
 */
router.delete("/:id", validate(snippetIdSchema), deleteSnippet);

/**
 * @swagger
 * /snippets/{id}/favorite:
 *   patch:
 *     summary: Toggle favorite snippet
 *     tags: [Snippets]
 *     security:
 *       - bearerAuth: []
 */
router.patch("/:id/favorite", validate(toggleFavoriteSchema), toggleFavorite);

export default router;

import { Router } from "express";

import authMiddleware from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";

import {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
} from "../controllers/note.controller.js";

import {
  createNoteSchema,
  updateNoteSchema,
  noteIdSchema,
  getNotesSchema,
} from "../validations/note.validation.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Notes
 *   description: Personal and project notes APIs
 */

router.use(authMiddleware);

/**
 * @swagger
 * /notes:
 *   post:
 *     summary: Create a note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/notes",
  validate(createNoteSchema),
  createNote
);

/**
 * @swagger
 * /notes:
 *   get:
 *     summary: Get all notes
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 */
router.get(
  "/notes",
  validate(getNotesSchema),
  getNotes
);

/**
 * @swagger
 * /notes/{id}:
 *   get:
 *     summary: Get note by id
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 */
router.get(
  "/notes/:id",
  validate(noteIdSchema),
  getNote
);

/**
 * @swagger
 * /notes/{id}:
 *   patch:
 *     summary: Update note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 */
router.patch(
  "/notes/:id",
  validate(updateNoteSchema),
  updateNote
);

/**
 * @swagger
 * /notes/{id}:
 *   delete:
 *     summary: Delete note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 */
router.delete(
  "/notes/:id",
  validate(noteIdSchema),
  deleteNote
);

export default router;
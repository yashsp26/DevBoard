import { Router } from "express";

import authMiddleware from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";

import * as avatarController from "../controllers/avatar.controller.js";

import {
  generateUploadUrlSchema,
  updateAvatarSchema,
} from "../validations/avatar.validation.js";

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Avatar
 *   description: Avatar APIs
 */

/**
 * @swagger
 * /user/avatar/upload-url:
 *   post:
 *     summary: Generate signed upload URL
 *     tags: [Avatar]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/upload-url",
  validate(generateUploadUrlSchema),
  avatarController.generateUploadUrl
);

/**
 * @swagger
 * /user/avatar:
 *   get:
 *     summary: Get avatar
 *     tags: [Avatar]
 *     security:
 *       - bearerAuth: []
 */
router.get("/", avatarController.getAvatar);

/**
 * @swagger
 * /user/avatar:
 *   patch:
 *     summary: Update avatar
 *     tags: [Avatar]
 *     security:
 *       - bearerAuth: []
 */
router.patch(
  "/",
  validate(updateAvatarSchema),
  avatarController.updateAvatar
);

/**
 * @swagger
 * /user/avatar:
 *   delete:
 *     summary: Delete avatar
 *     tags: [Avatar]
 *     security:
 *       - bearerAuth: []
 */
router.delete("/", avatarController.deleteAvatar);

export default router;
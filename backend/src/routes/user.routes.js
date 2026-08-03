import { Router } from "express";

import authMiddleware from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";

import * as userController from "../controllers/user.controller.js";

import {
  updateProfileSchema,
  changePasswordSchema,
} from "../validations/user.validation.js";

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User Profile APIs
 */

/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: Get current user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.get("/profile", userController.getProfile);

/**
 * @swagger
 * /user/profile:
 *   patch:
 *     summary: Update profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.patch(
  "/profile",
  validate(updateProfileSchema),
  userController.updateProfile
);

/**
 * @swagger
 * /user/change-password:
 *   patch:
 *     summary: Change password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.patch(
  "/change-password",
  validate(changePasswordSchema),
  userController.changePassword
);

/**
 * @swagger
 * /user/profile:
 *   delete:
 *     summary: Delete account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.delete(
  "/profile",
  userController.deleteProfile
);

export default router;
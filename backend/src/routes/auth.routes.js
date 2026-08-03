import { Router } from "express";

import {
  register,
  login,
  refresh,
  logout,
  getCurrentUser,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";

import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validations/auth.validation.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Authentication APIs
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 */
router.post(
  "/register",
  validate(registerSchema),
  register
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 */
router.post(
  "/login",
  validate(loginSchema),
  login
);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 */
router.post("/refresh", refresh);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 */
router.post("/logout", logout);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current authenticated user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 */
router.get("/me", authMiddleware, getCurrentUser);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Send password reset email
 *     tags: [Authentication]
 */
router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  forgotPassword
);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password
 *     tags: [Authentication]
 */
router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  resetPassword
);


export default router;
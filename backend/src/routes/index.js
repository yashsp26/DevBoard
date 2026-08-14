import { Router } from "express";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Health
 *   description: Health Check
 */

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Check API status
 *     tags: [Health]
 */
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "DevLupo API is running",
  });
});

export default router;

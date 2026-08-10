import { Router } from "express";

import authMiddleware from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";

import { runCode } from "./execution.controller.js";

import { runCodeSchema } from "./execution.validation.js";

const router = Router();

router.use(authMiddleware);

router.post(
  "/run",
  validate(runCodeSchema),
  runCode
);

export default router;
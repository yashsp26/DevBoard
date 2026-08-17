import { Router } from "express";

import authMiddleware from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";

import { runCode, runProject } from "./execution.controller.js";

import { runCodeSchema, runProjectSchema } from "./execution.validation.js";

const router = Router();

router.use(authMiddleware);

router.post(
  "/run",
  validate(runCodeSchema),
  runCode
);

router.post(
  "/projects/:projectId/run",
  validate(runProjectSchema),
  runProject,
);

export default router;

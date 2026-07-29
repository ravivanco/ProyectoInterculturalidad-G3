import { Router } from "express";

import {
  createExerciseTracking,
  getExerciseTracking,
} from "../controllers/exerciseTracking.controller";

const router = Router();

router.post("/", createExerciseTracking);
router.get("/", getExerciseTracking);

export default router;
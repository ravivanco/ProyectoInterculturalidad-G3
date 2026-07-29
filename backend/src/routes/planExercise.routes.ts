import { Router } from "express";

import {
  assignExerciseToDay,
  getAssignedExercises,
} from "../controllers/planExercise.controller";

const router = Router({
  mergeParams: true,
});

router.post("/", assignExerciseToDay);
router.get("/", getAssignedExercises);

export default router;
import { Router } from "express";
import {
  createPlanWeek,
  getPlanWeeks,
} from "../controllers/nutritionPlanWeekController";

const router = Router();

router.post("/:planId/weeks", createPlanWeek);
router.get("/:planId/weeks", getPlanWeeks);

export default router;
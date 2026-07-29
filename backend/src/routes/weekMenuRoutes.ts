import { Router } from "express";
import {
  assignMenuToDay,
  getDayMenus,
} from "../controllers/nutritionPlanWeekController";

const router = Router();

router.post("/:weekId/days/:day/menus", assignMenuToDay);
router.get("/:weekId/days/:day/menus", getDayMenus);

export default router;

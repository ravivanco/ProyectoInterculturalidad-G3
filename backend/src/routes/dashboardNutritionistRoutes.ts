import { Router } from "express";

import {
  getNutritionistDashboard,
} from "../controllers/dashboardNutritionist.controller";

const router = Router();

router.get(
  "/nutritionist",
  getNutritionistDashboard
);

export default router;
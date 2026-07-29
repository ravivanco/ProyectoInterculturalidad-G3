import { Router } from "express";

import {
  evaluateAlerts,
  getAlerts,
  markAlertAsRead,
  resolveAlert,
} from "../controllers/alert.controller";

const router = Router();

router.get("/", getAlerts);
router.post("/evaluate", evaluateAlerts);
router.patch("/:id/read", markAlertAsRead);
router.patch("/:id/resolve", resolveAlert);

export default router;
import { Router } from "express";

import {
  createAppointment,
  deleteAppointment,
  getAppointments,
  linkAppointmentEvaluation,
  updateAppointmentStatus,
} from "../controllers/appointment.controller";

const router = Router();

router.post("/", createAppointment);

router.get("/", getAppointments);

router.patch(
  "/:id/status",
  updateAppointmentStatus
);

router.patch(
  "/:id/link-evaluation",
  linkAppointmentEvaluation
);

router.delete(
  "/:id",
  deleteAppointment
);

export default router;
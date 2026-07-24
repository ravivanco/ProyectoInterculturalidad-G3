import { Router } from "express";
import { getApiInfo, getHealth } from "../controllers/health.controller";

const router = Router();

router.get("/", getApiInfo);
router.get("/health", getHealth);

export default router;
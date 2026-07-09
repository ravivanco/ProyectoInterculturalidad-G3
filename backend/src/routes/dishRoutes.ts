import { Router } from "express";
import {
  createDish,
  getDishes,
  getDishById,
  updateDish,
} from "../controllers/dishController";

const router = Router();

router.post("/", createDish);
router.get("/", getDishes);
router.get("/:id", getDishById);
router.put("/:id", updateDish);

export default router;
import express from "express";
import { verifyToken } from "../middlware/auth.middleware";
import * as habitController from "../controllers/habit.controller";

const router = express.Router();

router.post("/", verifyToken, habitController.createHabit)
router.get("/", verifyToken, habitController.getHabits);
router.get("/:id", verifyToken, habitController.getHabitById)
router.put("/:id", verifyToken, habitController.updateHabit)
router.delete("/:id", verifyToken, habitController.deleteHabit)

export default router;

import express from "express";
import { verifyToken } from "../middlware/auth.middleware";
import * as habitController from "../controllers/habit.controller";

const router = express.Router();

router.post("/", verifyToken, habitController.createHabit)
router.get("/", verifyToken, habitController.getHabits);

export default router;

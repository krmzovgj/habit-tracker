import { NextFunction, Request, Response } from "express";
import * as habitLogService from "../services/habit-log.services";

// @desc Create Habit log
// @route POST /:habitId

export const completeHabit = async (req: Request, res: Response, next: NextFunction) => {
    const habitId = req.params.habitId;
    const { completed } = req.body;

    try {
        const { message, streak } = await habitLogService.completeHabit(habitId, completed);

        res.status(201).json({ message: message, streak });
    } catch (error: any) {
        next(error)
    }
};

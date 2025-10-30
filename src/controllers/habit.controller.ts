import { Request, Response } from "express";
import * as habitService from "../services/habit.services";

interface HabitRequest extends Request {
    user?: {
        id: number;
    };
}

// @desc Create Habit
// @route POST /

export const createHabit = async (req: HabitRequest, res: Response) => {
    const userId = req.user?.id;
    const { title, frequency } = req.body;

    try {
        const habit = await habitService.createHabit(userId!, title, frequency);
        res.status(201).json({ habit });
    } catch (error: any) {
        if (error.message) {
            return res.status(error.status).json({
                message: error.message,
            });
        }
    }
};

// @desc Get all habits
// @route GET /

export const getHabits = async (req: HabitRequest, res: Response) => {
    const userId = req.user?.id;

    try {
        const habits = await habitService.getHabits(userId!);

        res.status(200).json(habits);
    } catch (error: any) {
        if (error.message) {
            return res.status(error.status).json({
                message: error.message,
            });
        }
    }
};

// @desc Get habit by id
// @route GET /:id

export const getHabitById = async (req: Request, res: Response) => {
    const habitId = req.params.id;

    try {
        const habit = await habitService.getHabitById(habitId);

        res.status(200).json({habit})
    } catch (error: any) {
        if (error.message) {
            return res.status(error.status).json({
                message: error.message,
            });
        }
    }
};

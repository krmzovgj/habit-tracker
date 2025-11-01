import { NextFunction, Request, Response } from "express";
import * as reminderService from '../services/reminder.services'

interface ReminderRequest extends Request {
    user?: {
        id: number
    }
}

// @desc Create a reminder
// @route POST /

export const createReminder = async (req: ReminderRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id
    const { message, time, timezone, recurring, habitId } = req.body

    try {

        const reminder = await reminderService.createReminder(userId!, message, time, timezone, recurring, habitId)
            
        res.status(201).json(reminder)
    } catch (error) {
        next(error)
    }


}
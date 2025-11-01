

// @return Created notification object

import { Reminder } from "@prisma/client"
import { prisma } from "../prisma"

export const createNotification = async (reminder: Reminder) => {
    await prisma.notification.create({
        data: {
            message: reminder.message,
            userId: reminder.userId,
            habitId: reminder.habitId ?? null
        }
    })
}
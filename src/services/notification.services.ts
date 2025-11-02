

// @return Created notification object

import { Reminder } from "@prisma/client"
import { prisma } from "../prisma"
import { io } from "../index"

export const createNotification = async (reminder: Reminder) => {
    const notification = await prisma.notification.create({
        data: {
            message: reminder.message,
            userId: reminder.userId,
            habitId: reminder.habitId ?? null
        }
    })

    io.to(reminder.userId.toString()).emit("newNotification", {notification, message: "Notification recieved"});
}
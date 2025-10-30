import { prisma } from "../prisma";
import { badRequest, notFound } from "../utils/api-error";
import { isSameDay, isSameMonth, isSameWeek, subWeeks } from "date-fns";

// @return Created habit log

export const completeHabit = async (habitId: string, completed: boolean) => {
    if (!habitId) {
        throw badRequest("Habit id is required");
    }

    const habit = await prisma.habit.findUnique({
        where: {
            id: habitId,
        },
        include: {
            HabitLog: {
                orderBy: { date: "desc" },
                take: 1,
            },
        },
    });

    if (!habit) {
        throw notFound("Habit not found");
    }

    const today = new Date();
    const lastLog = habit.HabitLog[0];

    switch (habit.frequency) {
        case "DAILY":
            if (lastLog && isSameDay(lastLog.date, today)) {
                throw badRequest("Habit already completed today");
            }
        case "WEEKLY":
            if (lastLog && isSameMonth(lastLog.date, today)) {
                throw badRequest("Habit already completed this week");
            }
    }

    await prisma.habitLog.create({
        data: {
            completed,
            habitId,
        },
    });

    let streak = habit.streakCount || 0;

    switch (habit.frequency) {
        case "DAILY": {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            if (lastLog && isSameDay(lastLog.date, yesterday)) {
                streak += 1;
            } else {
                streak = 1;
            }
        }
        case "WEEKLY": {
            const lastWeek = subWeeks(new Date(), 1);
            if (
                lastLog &&
                isSameWeek(lastLog.date, lastWeek, { weekStartsOn: 1 })
            ) {
                streak += 1;
            } else {
                streak = 1;
            }
        }
    }

    await prisma.habit.update({
        where: {
            id: habitId,
        },
        data: {
            streakCount: streak,
        },
    });

    return { message: "Habit completed!", streak };
};

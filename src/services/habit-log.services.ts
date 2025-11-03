import { io } from "../index";
import { prisma } from "../prisma";
import { badRequest, notFound } from "../utils/api-error";
import { isSameDay, isSameMonth, isSameWeek, subWeeks } from "date-fns";

// @return Created habit log

export const completeHabit = async (habitId: string) => {
    if (!habitId) {
        throw badRequest("Habit id is required");
    }

    const habit = await prisma.habit.findUnique({
        where: {
            id: habitId,
        },
        include: {
            habitLogs: {
                orderBy: { date: "desc" },
                take: 1,
            },
        },
    });

    if (!habit) {
        throw notFound("Habit not found");
    }

    const today = new Date();
    const lastLog = habit.habitLogs[0];

    switch (habit.frequency) {
        case "DAILY":
            if (lastLog && isSameDay(lastLog.date, today)) {
                throw badRequest("Habit already completed today");
            }
            break;
        case "WEEKLY":
            if (
                lastLog &&
                isSameWeek(lastLog.date, today, { weekStartsOn: 1 })
            ) {
                throw badRequest("Habit already completed this week");
            }
            break
    }

    await prisma.habitLog.create({
        data: {
            completed: true,
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
            break
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
            break
        }
    }

    const updatedHabit = await prisma.habit.update({
        where: { id: habitId },
        data: { streakCount: streak },
        include: {
            habitLogs: {
                orderBy: { date: "desc" },
                take: 1,
            },
        },
    });

    const latestLog = updatedHabit.habitLogs[0];

    const completedHabit = {
        id: updatedHabit.id,
        title: updatedHabit.title,
        frequency: updatedHabit.frequency,
        streakCount: updatedHabit.streakCount,
        lastCompletedDate: latestLog?.date || null,
        completed:
            latestLog &&
            (updatedHabit.frequency === "DAILY"
                ? new Date(latestLog.date).toLocaleDateString() ===
                  today.toLocaleDateString()
                : isSameWeek(new Date(latestLog.date), today, {
                      weekStartsOn: 1,
                  })),
    };

    io.to(habit.userId.toString()).emit("habitCompleted", completedHabit);

    return { message: "Habit completed!", streak };
};

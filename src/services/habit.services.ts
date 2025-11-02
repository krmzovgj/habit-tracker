import { Frequency } from "@prisma/client";
import { prisma } from "../prisma";
import { badRequest, notFound, unauthorized } from "../utils/api-error";
import { isSameDay } from "date-fns";
import { io } from "../index";

// @return Created habit object

export const createHabit = async (
    userId: number,
    title: string,
    frequency: Frequency
) => {
    if (!userId) {
        throw badRequest("User id is required");
    }

    if (!title) {
        throw badRequest("Habit title is required");
    }

    if (!Object.values(Frequency).includes(frequency)) {
        throw badRequest("Invalid frequency");
    }

    const habit = await prisma.habit.create({
        data: {
            title,
            frequency,
            userId,
        },
    });

    io.to(userId.toString()).emit("newHabit", habit)

    return habit;
};

// @return All Habits

export const getHabits = async (userId: number) => {
    if (!userId) {
        throw badRequest("User id is required");
    }

    const allHabits = await prisma.habit.findMany({
        where: {
            userId,
        },
        include: {
            habitLogs: {
                orderBy: { date: "desc" },
                take: 1,
            },
        },
    });

    const today = new Date();

    const habits = allHabits.map((habit) => {
        const lastLog = habit.habitLogs[0];
        return {
            id: habit.id,
            title: habit.title,
            frequency: habit.frequency,
            streakCount: habit.streakCount,
            lastCompletedDate: lastLog?.date || null,
            completedToday: lastLog
                ? isSameDay(new Date(lastLog.date), today)
                : false,
        };
    });

    return habits;
};

// @return Habit object by id

export const getHabitById = async (habitId: string) => {
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

    return {
        id: habit.id,
        title: habit.title,
        frequency: habit.frequency,
        streakCount: habit.streakCount,
        lastCompletedDate: lastLog?.date || null,
        completedToday: lastLog
            ? isSameDay(new Date(lastLog.date), today)
            : false,
    };
};


// @return Updated habit object

export const updateHabit = async (habitId: string, title: string, frequency: Frequency) => {
    if(!habitId) {
        throw badRequest("Habit id is required")
    }

    const updatedHabit = await prisma.habit.update({
        where: {
            id: habitId
        },
        data: {
            title,
            frequency
        }
    })

    io.to(updatedHabit.userId.toString()).emit("habitUpdated", updatedHabit)

    return updatedHabit
}

// @return Delete habit confirmation

export const deleteHabit = async (userId: number, habitId: string) => {
    if(!habitId) { 
        throw badRequest("Habit id is required")
    }

    if(!userId) { 
        throw badRequest("User id is required")
    }

    const habit = await prisma.habit.findUnique({
        where: {
            id: habitId,
            userId
        }
    })

    if(!habit) {
        throw unauthorized("Unauthorized")
    }

    const deletedHabit = await prisma.habit.deleteMany({
        where: {
            id: habitId
        }
    })

    if(deletedHabit.count === 0) {
        throw notFound("Habit not found")
    }

    io.to(userId.toString()).emit("habitDeleted", {id: habitId})

    return "Habit deleted!"
}
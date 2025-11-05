import { Frequency } from "@prisma/client";
import { prisma } from "../prisma";
import { badRequest, notFound, unauthorized } from "../utils/api-error";
import { isSameDay, isSameWeek } from "date-fns";
import { io } from "../index";
import { mapHabitWithCompletion } from "../utils/mab-habit-with-completion";

// @return Created habit object

export const createHabit = async (
    userId: number,
    title: string,
    frequency: Frequency,
    color: string
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
            color,
            userId,
        },
    });

    io.to(userId.toString()).emit("newHabit", habit);

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

    return allHabits.map(mapHabitWithCompletion);
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

    return mapHabitWithCompletion(habit);
};

// @return Updated habit object

export const updateHabit = async (
    habitId: string,
    title: string,
    frequency: Frequency,
    color: string
) => {
    if (!habitId) throw badRequest("Habit id is required");

    const updatedHabit = await prisma.habit.update({
        where: { id: habitId },
        data: { title, frequency, color },
        include: {
            habitLogs: {
                orderBy: { date: "desc" },
                take: 1,
            },
        },
    });

    const habitWithCompletion = mapHabitWithCompletion(updatedHabit);

    io.to(updatedHabit.userId.toString()).emit(
        "habitUpdated",
        habitWithCompletion
    );

    return habitWithCompletion;
};

// @return Delete habit confirmation

export const deleteHabit = async (userId: number, habitId: string) => {
    if (!habitId) {
        throw badRequest("Habit id is required");
    }

    if (!userId) {
        throw badRequest("User id is required");
    }

    const habit = await prisma.habit.findUnique({
        where: {
            id: habitId,
            userId,
        },
    });

    if (!habit) {
        throw unauthorized("Unauthorized");
    }

    const deletedHabit = await prisma.habit.deleteMany({
        where: {
            id: habitId,
        },
    });

    if (deletedHabit.count === 0) {
        throw notFound("Habit not found");
    }

    io.to(userId.toString()).emit("habitDeleted", habitId);

    return "Habit deleted!";
};

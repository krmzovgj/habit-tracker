import { prisma } from "../prisma";
import { badRequest } from "../utils/api-error";
import moment from "moment-timezone";

// @return Created reminder object

export const createReminder = async (
    userId: number,
    message: string,
    time: string,
    timezone: string,
    recurring: boolean,
    habitId: string
) => {
    if (!userId) {
        throw badRequest("User id is required");
    }

    if (!message || !time || !timezone) {
        throw badRequest("Message, time and timezone are required");
    }

    if (!/^\d{2}:\d{2}$/.test(time)) {
        throw badRequest("Time must be in HH:mm format");
    }

    if (!moment.tz.zone(timezone)) {
        throw badRequest("Invalid timezone");
    }

    const today = moment().tz(timezone).format("YYYY-MM-DD");

    let local = moment.tz(`${today} ${time}`, "YYYY-MM-DD HH:mm", timezone);

    const nowInZone = moment().tz(timezone);
    if (local.isSameOrBefore(nowInZone)) {
        local = local.add(1, "day");
    }

    const triggerAtUtc = local.utc().toDate();

    const reminder = await prisma.reminder.create({
        data: {
            message,
            time,
            timezone,
            recurring,
            triggerAtUtc,
            userId,
            habitId
        },
    });
    
    return reminder
};

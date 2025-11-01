import cron from "node-cron";
import moment from "moment-timezone";
import { prisma } from "../prisma";
import { createNotification } from "../services/notification.services";

cron.schedule("* * * * *", async () => {
    const nowUtc = moment.utc().toDate();

    const dueReminders = await prisma.reminder.findMany({
        where: {
            triggerAtUtc: { lte: nowUtc },
            active: true,
        },
    });

    if (dueReminders.length === 0) return;

    for (const reminder of dueReminders) {
        await createNotification(reminder);

        if (!reminder.recurring) {
            await prisma.reminder.updateMany({
                where: {
                    id: reminder.id,
                },
                data: {
                    active: false,
                },
            });
        } else {
            const nextLocal = moment
                .tz(reminder.time, "HH:mm", reminder.timezone)
                .add(1, "day");

            const nextUtc = nextLocal.clone().utc().toDate();

            await prisma.reminder.update({
                where: {
                    id: reminder.id,
                },
                data: {
                    triggerAtUtc: nextUtc,
                },
            });
        }
    }
});

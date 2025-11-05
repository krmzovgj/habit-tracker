import { isSameWeek } from "date-fns";

export const mapHabitWithCompletion = (habit: any) => {
  const today = new Date();
  const lastLog = habit.habitLogs[0];
  const completed =
    lastLog &&
    (habit.frequency === "DAILY"
      ? new Date(lastLog.date).toLocaleDateString() ===
        today.toLocaleDateString()
      : isSameWeek(new Date(lastLog.date), today, {
          weekStartsOn: 1,
        }));

  return {
    id: habit.id,
    title: habit.title,
    frequency: habit.frequency,
    color: habit.color,
    streakCount: habit.streakCount,
    lastCompletedDate: lastLog?.date || null,
    completed,
  };
};

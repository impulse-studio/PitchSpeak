import { format, isToday, isYesterday } from "date-fns";

export function formatRelativeDate(date: string | Date) {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  if (isToday(dateObj)) {
    return `Today, ${format(dateObj, "h:mm a")}`;
  }
  if (isYesterday(dateObj)) {
    return `Yesterday, ${format(dateObj, "h:mm a")}`;
  }

  return format(dateObj, "MMM d, yyyy 'at' h:mm a");
}

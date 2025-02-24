/**
 * Formats a date as a relative time (e.g., "2 days ago") if within 7 days,
 * or as "day. of Month" format (e.g., "1. of May") for older dates
 */
export function relativeDateFormatter(date: Date | string | number): string {
  const inputDate = date instanceof Date ? date : new Date(date);
  const now = new Date();

  // Calculate the difference in milliseconds
  const diffMs = now.getTime() - inputDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // If less than 7 days, show relative time
  if (diffDays < 7) {
    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        if (diffMinutes === 0) {
          return "Just now";
        }
        return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`;
      }
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    }
    return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  }

  // For older dates, format as "day. of Month"
  const day = inputDate.getDate();
  const month = inputDate.toLocaleString("en-US", { month: "short" });

  return `${day}. of ${month}`;
}

/**
 * Date utility functions for calendar operations
 */

/**
 * Calculates the number of days between two dates
 * @param start - Start date
 * @param end - End date
 * @returns Number of days (can be negative if end is before start)
 */
export const daysBetween = (start: Date, end: Date): number => {
  const msPerDay = 1000 * 60 * 60 * 24;
  const startMs = start.getTime();
  const endMs = end.getTime();
  return Math.floor((endMs - startMs) / msPerDay);
};

/**
 * Checks if two dates fall on the same day (ignores time)
 * @param date1 - First date
 * @param date2 - Second date
 * @returns True if dates are on the same day
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

/**
 * Checks if a date is today
 * @param date - Date to check
 * @returns True if date is today
 */
export const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date());
};

/**
 * Gets all days in a month
 * @param date - Any date in the target month
 * @returns Array of dates representing each day in the month
 */
export const getDaysInMonth = (date: Date): Date[] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysCount = new Date(year, month + 1, 0).getDate();
  
  return Array.from(
    { length: daysCount },
    (_, i) => new Date(year, month, i + 1)
  );
};

/**
 * Gets the calendar grid (42 cells for month view)
 * Includes days from previous and next months to fill the grid
 * @param date - Any date in the target month
 * @returns Array of 42 dates for the calendar grid
 */
export const getCalendarGrid = (date: Date): Date[] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  
  // First day of the month
  const firstDay = new Date(year, month, 1);
  
  // Start date (may be from previous month)
  // We want to start from the Sunday of the week containing the first day
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());
  
  // Generate 42 cells (6 weeks × 7 days)
  const grid: Date[] = [];
  const currentDate = new Date(startDate);
  
  for (let i = 0; i < 42; i++) {
    grid.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return grid;
};

/**
 * Gets the start and end dates for a week containing the given date
 * @param date - Any date in the target week
 * @returns Object with start and end dates of the week
 */
export const getWeekRange = (date: Date): { start: Date; end: Date } => {
  const start = new Date(date);
  start.setDate(start.getDate() - start.getDay());
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  
  return { start, end };
};

/**
 * Formats a date to a readable string
 * @param date - Date to format
 * @param format - Format type
 * @returns Formatted date string
 */
export const formatDate = (
  date: Date,
  format: 'short' | 'long' | 'time' = 'short'
): string => {
  switch (format) {
    case 'short':
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    case 'long':
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    case 'time':
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      });
    default:
      return date.toLocaleDateString();
  }
};

/**
 * Gets the month name for a date
 * @param date - Date to get month name from
 * @returns Month name
 */
export const getMonthName = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'long' });
};

/**
 * Gets the year for a date
 * @param date - Date to get year from
 * @returns Year as number
 */
export const getYear = (date: Date): number => {
  return date.getFullYear();
};

/**
 * Checks if a date is in the current month
 * @param date - Date to check
 * @param currentMonth - Reference date for current month
 * @returns True if date is in the current month
 */
export const isCurrentMonth = (date: Date, currentMonth: Date): boolean => {
  return (
    date.getFullYear() === currentMonth.getFullYear() &&
    date.getMonth() === currentMonth.getMonth()
  );
};

/**
 * Gets the day names for calendar header
 * @returns Array of day names (Sun, Mon, Tue, etc.)
 */
export const getDayNames = (): string[] => {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
};

/**
 * Gets the full day names
 * @returns Array of full day names (Sunday, Monday, etc.)
 */
export const getFullDayNames = (): string[] => {
  return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
};
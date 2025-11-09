import React, { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { MonthViewProps } from './CalendarView.types';
import { CalendarCell } from './CalendarCell';
import { getCalendarGrid, getDayNames, isToday, isCurrentMonth } from '@/utils/date.utils';

/**
 * Month View Component
 * Displays a 42-cell grid (6 weeks × 7 days) calendar with keyboard navigation
 */
export const MonthView: React.FC<MonthViewProps> = ({
  currentDate,
  events,
  onDateClick,
  onEventClick,
}) => {
  const [focusedCellIndex, setFocusedCellIndex] = useState<number | null>(null);
  const cellRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Generate the 42-cell calendar grid
  const calendarGrid = useMemo(() => getCalendarGrid(currentDate), [currentDate]);
  const dayNames = useMemo(() => getDayNames(), []);

  // Get events for each date
  const getEventsForDate = useCallback((date: Date) => {
    return events.filter((event) => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      
      // Check if event spans this date
      const eventStartDate = new Date(eventStart.getFullYear(), eventStart.getMonth(), eventStart.getDate());
      const eventEndDate = new Date(eventEnd.getFullYear(), eventEnd.getMonth(), eventEnd.getDate());
      const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      
      return checkDate >= eventStartDate && checkDate <= eventEndDate;
    });
  }, [events]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent, index: number) => {
    let newIndex = index;

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        newIndex = Math.max(0, index - 1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        newIndex = Math.min(41, index + 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        newIndex = Math.max(0, index - 7);
        break;
      case 'ArrowDown':
        e.preventDefault();
        newIndex = Math.min(41, index + 7);
        break;
      case 'Home':
        e.preventDefault();
        newIndex = Math.floor(index / 7) * 7; // First cell of current row
        break;
      case 'End':
        e.preventDefault();
        newIndex = Math.floor(index / 7) * 7 + 6; // Last cell of current row
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        onDateClick(calendarGrid[index] as Date);
        return;
      default:
        return;
    }

    setFocusedCellIndex(newIndex);
  }, [calendarGrid, onDateClick]);

  // Focus the cell when focusedCellIndex changes
  useEffect(() => {
    if (focusedCellIndex !== null && cellRefs.current[focusedCellIndex]) {
      cellRefs.current[focusedCellIndex]?.focus();
    }
  }, [focusedCellIndex]);

  // Handle cell focus
  const handleCellFocus = useCallback((index: number) => {
    setFocusedCellIndex(index);
  }, []);

  return (
    <div className="month-view bg-white h-full overflow-auto">
      {/* Day names header */}
      <div className="grid grid-cols-7 border-b border-neutral-200 bg-neutral-50 sticky top-0 z-10">
        {dayNames.map((day) => (
          <div
            key={day}
            className="py-3 text-center text-sm font-semibold text-neutral-700"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid - 6 rows × 7 columns = 42 cells */}
      <div className="grid grid-cols-7 border-l border-t border-neutral-200">
        {calendarGrid.map((date, index) => {
          const dateEvents = getEventsForDate(date);
          const todayCheck = isToday(date);
          const currentMonthCheck = isCurrentMonth(date, currentDate);

          return (
            <div
              key={`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${index}`}
              ref={(el) => {
                cellRefs.current[index] = el;
              }}
              onFocus={() => handleCellFocus(index)}
            >
              <CalendarCell
                date={date}
                events={dateEvents}
                isToday={todayCheck}
                isCurrentMonth={currentMonthCheck}
                isSelected={focusedCellIndex === index}
                onClick={onDateClick}
                onEventClick={onEventClick}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthView;
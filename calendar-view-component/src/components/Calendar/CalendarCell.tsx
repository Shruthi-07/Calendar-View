import React, { useCallback, useMemo } from 'react';
import { CalendarCellProps } from './CalendarView.types';
import clsx from 'clsx';

/**
 * Calendar Cell Component
 * Represents a single day cell in the month view
 * Optimized with React.memo to prevent unnecessary re-renders
 */
export const CalendarCell: React.FC<CalendarCellProps & { onKeyDown?: (e: React.KeyboardEvent) => void }> = React.memo(({
  date,
  events,
  isToday,
  isCurrentMonth,
  isSelected,
  onClick,
  onEventClick,
  onKeyDown,
}) => {
  const handleClick = useCallback(() => {
    onClick(date);
  }, [date, onClick]);

  const handleCellKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (onKeyDown) {
      onKeyDown(e);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }, [handleClick, onKeyDown]);

  const handleEventClick = useCallback((e: React.MouseEvent, event: typeof events[0]) => {
    e.stopPropagation();
    onEventClick(event);
  }, [onEventClick]);

  const handleEventKeyDown = useCallback((e: React.KeyboardEvent, event: typeof events[0]) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      onEventClick(event);
    }
  }, [onEventClick]);

  const dayNumber = date.getDate();
  const visibleEvents = useMemo(() => events.slice(0, 3), [events]);
  const hasMoreEvents = events.length > 3;
  const eventCount = events.length;

  // Memoize ARIA label
  const ariaLabel = useMemo(() => {
    const dateStr = date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric' 
    });
    const eventStr = eventCount === 1 ? '1 event' : `${eventCount} events`;
    const todayStr = isToday ? ' Today.' : '';
    return `${dateStr}. ${eventStr}.${todayStr}`;
  }, [date, eventCount, isToday]);

  return (
    <div
      className={clsx(
        'calendar-cell relative border-r border-b border-neutral-200 min-h-[120px] p-2 transition-colors cursor-pointer',
        'hover:bg-neutral-50',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset focus:z-10',
        isSelected && 'bg-primary-50 border-primary-300 ring-2 ring-primary-500 ring-inset z-10',
        !isCurrentMonth && 'bg-neutral-50'
      )}
      onClick={handleClick}
      onKeyDown={handleCellKeyDown}
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-pressed={isSelected}
    >
      {/* Day number */}
      <div className="flex justify-between items-start mb-1">
        {isToday ? (
          <div className="flex items-center justify-center w-7 h-7 bg-primary-600 rounded-full">
            <span className="text-sm font-semibold text-white">
              {dayNumber}
            </span>
          </div>
        ) : (
          <span
            className={clsx(
              'text-sm font-medium',
              isCurrentMonth ? 'text-neutral-900' : 'text-neutral-400'
            )}
          >
            {dayNumber}
          </span>
        )}
      </div>

      {/* Events */}
      {eventCount > 0 && (
        <div className="space-y-1">
          {visibleEvents.map((event) => (
            <button
              key={event.id}
              onClick={(e) => handleEventClick(e, event)}
              onKeyDown={(e) => handleEventKeyDown(e, event)}
              className={clsx(
                'w-full text-left text-xs px-2 py-1 rounded truncate',
                'hover:opacity-80 transition-opacity',
                'focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:ring-offset-1'
              )}
              style={{ 
                backgroundColor: event.color || '#3b82f6',
                color: '#ffffff'
              }}
              title={event.title}
              aria-label={`Event: ${event.title} at ${new Date(event.startDate).toLocaleTimeString()}`}
            >
              {event.title}
            </button>
          ))}
          
          {hasMoreEvents && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  e.stopPropagation();
                  handleClick();
                }
              }}
              className="text-xs text-primary-600 hover:text-primary-700 hover:underline font-medium focus:outline-none focus:ring-1 focus:ring-primary-500 rounded px-1"
              aria-label={`${events.length - 3} more events on this day`}
            >
              +{events.length - 3} more
            </button>
          )}
        </div>
      )}
    </div>
  );
});

CalendarCell.displayName = 'CalendarCell';

export default CalendarCell;
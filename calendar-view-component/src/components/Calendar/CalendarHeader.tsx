import React from 'react';
import { CalendarView } from './CalendarView.types';
import { getMonthName, getYear } from '@/utils/date.utils';

/**
 * Props for CalendarHeader component
 */
export interface CalendarHeaderProps {
  currentDate: Date;
  view: CalendarView;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onToggleView: (view: 'month' | 'week') => void;
}

/**
 * CalendarHeader Component
 * Navigation header for calendar with Prev/Next/Today buttons and view toggle
 */
export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  view,
  onPrev,
  onNext,
  onToday,
  onToggleView,
}) => {
  const monthName = getMonthName(currentDate);
  const year = getYear(currentDate);

  const handleKeyDown = (
    event: React.KeyboardEvent,
    callback: () => void
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      callback();
    }
  };

  return (
    <header className="calendar-header bg-white border-b border-neutral-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left section: Date display and Today button */}
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-neutral-900">
            {monthName} {year}
          </h2>
          <button
            onClick={onToday}
            onKeyDown={(e) => handleKeyDown(e, onToday)}
            className="px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label="Go to today"
          >
            Today
          </button>
        </div>

        {/* Right section: Navigation and view toggle */}
        <div className="flex items-center gap-3">
          {/* Navigation buttons */}
          <div className="flex items-center gap-1 bg-neutral-100 rounded-lg p-1">
            <button
              onClick={onPrev}
              onKeyDown={(e) => handleKeyDown(e, onPrev)}
              className="p-2 text-neutral-700 hover:bg-white hover:text-neutral-900 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              aria-label={`Previous ${view}`}
              title={`Previous ${view}`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={onNext}
              onKeyDown={(e) => handleKeyDown(e, onNext)}
              className="p-2 text-neutral-700 hover:bg-white hover:text-neutral-900 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              aria-label={`Next ${view}`}
              title={`Next ${view}`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
          
          {/* View toggle*/}
          <div className="flex items-center bg-neutral-100 rounded-lg p-1">
            <button
              onClick={() => onToggleView('month')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                view === 'month'
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => onToggleView('week')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                view === 'week'
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Week
            </button>
          </div>
        </div>
      </div>

      {/* Mobile responsive version - stacked layout */}
      <div className="md:hidden mt-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onPrev}
              onKeyDown={(e) => handleKeyDown(e, onPrev)}
              className="p-2 text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label={`Previous ${view}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={onNext}
              onKeyDown={(e) => handleKeyDown(e, onNext)}
              className="p-2 text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label={`Next ${view}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <button
            onClick={onToday}
            onKeyDown={(e) => handleKeyDown(e, onToday)}
            className="px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Go to today"
          >
            Today
          </button>
        </div>
      </div>
    </header>
  );
};

export default CalendarHeader;
import React, { useState, useCallback, lazy, Suspense } from 'react';
import { CalendarViewProps, CalendarEvent } from './CalendarView.types';
import { CalendarHeader } from './CalendarHeader';
import { MonthView } from './MonthView';
import { WeekView } from './WeekView';
import { useCalendar } from '@/hooks/useCalendar';

// Lazy load EventModal for better performance
const EventModal = lazy(() => import('./EventModal'));

/**
 * Main Calendar View Component
 * Manages the overall calendar state and view switching
 */
export const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  onEventAdd,
  onEventUpdate,
  onEventDelete,
  initialView = 'month',
  initialDate = new Date(),
}) => {
  const {
    currentDate,
    view,
    goToNextMonth,
    goToPreviousMonth,
    goToNextWeek,
    goToPreviousWeek,
    goToToday,
    setView,
  } = useCalendar(initialDate);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>(undefined);

  // Set initial view only once on mount
  React.useEffect(() => {
    if (initialView) {
      setView(initialView);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Handle navigation based on current view
  const handlePrev = useCallback(() => {
    if (view === 'month') {
      goToPreviousMonth();
    } else {
      goToPreviousWeek();
    }
  }, [view, goToPreviousMonth, goToPreviousWeek]);

  const handleNext = useCallback(() => {
    if (view === 'month') {
      goToNextMonth();
    } else {
      goToNextWeek();
    }
  }, [view, goToNextMonth, goToNextWeek]);

  // Handle date click - open modal to create new event
  const handleDateClick = useCallback((date: Date) => {
    setSelectedDate(date);
    setSelectedEvent(undefined);
    setIsModalOpen(true);
  }, []);

  // Handle event click - open modal to edit event
  const handleEventClick = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setSelectedDate(null);
    setIsModalOpen(true);
  }, []);

  // Handle modal close
  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setSelectedDate(null);
    setSelectedEvent(undefined);
  }, []);

  // Handle event save (create or update)
  const handleEventSave = useCallback((event: CalendarEvent) => {
    if (selectedEvent) {
      // Update existing event
      onEventUpdate(selectedEvent.id, event);
    } else {
      // Create new event
      onEventAdd(event);
    }
    handleModalClose();
  }, [selectedEvent, onEventAdd, onEventUpdate, handleModalClose]);

  // Handle event delete
  const handleEventDelete = useCallback((id: string) => {
    onEventDelete(id);
    handleModalClose();
  }, [onEventDelete, handleModalClose]);

  return (
    <div className="calendar-view w-full h-full flex flex-col bg-neutral-50">
      {/* Header with navigation */}
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={goToToday}
        onToggleView={setView}
      />

      {/* Calendar content */}
      <div className="flex-1 overflow-hidden">
        {view === 'month' ? (
          <MonthView
            currentDate={currentDate}
            events={events}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
          />
        ) : (
          <WeekView
            currentDate={currentDate}
            events={events}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
          />
        )}
      </div>

      {/* Event Modal - Lazy loaded with Suspense */}
      {isModalOpen && (
        <Suspense fallback={<div className="fixed inset-0 bg-black bg-opacity-50 z-50" />}>
          <EventModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            onSave={handleEventSave}
            onDelete={selectedEvent ? handleEventDelete : undefined}
            event={selectedEvent}
            selectedDate={selectedDate || undefined}
          />
        </Suspense>
      )}
    </div>
  );
};

export default CalendarView;
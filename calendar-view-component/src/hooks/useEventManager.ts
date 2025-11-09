import { useState, useCallback } from 'react';
import { CalendarEvent } from '@/components/Calendar/CalendarView.types';

/**
 * Custom hook for managing calendar events
 * Handles CRUD operations for events
 */
export const useEventManager = (initialEvents: CalendarEvent[] = []) => {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);

  /**
   * Add a new event
   */
  const addEvent = useCallback((event: CalendarEvent) => {
    setEvents((prev) => [...prev, event]);
  }, []);

  /**
   * Update an existing event
   */
  const updateEvent = useCallback((id: string, updates: Partial<CalendarEvent>) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === id ? { ...event, ...updates } : event
      )
    );
  }, []);

  /**
   * Delete an event
   */
  const deleteEvent = useCallback((id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  }, []);

  /**
   * Get events for a specific date
   */
  const getEventsForDate = useCallback((date: Date): CalendarEvent[] => {
    return events.filter((event) => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      
      // Normalize dates to midnight for comparison
      const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dateEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
      
      return (
        (eventStart >= dateStart && eventStart <= dateEnd) ||
        (eventEnd >= dateStart && eventEnd <= dateEnd) ||
        (eventStart <= dateStart && eventEnd >= dateEnd)
      );
    });
  }, [events]);

  /**
   * Get events for a date range
   */
  const getEventsForRange = useCallback((startDate: Date, endDate: Date): CalendarEvent[] => {
    return events.filter((event) => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      
      return (
        (eventStart >= startDate && eventStart <= endDate) ||
        (eventEnd >= startDate && eventEnd <= endDate) ||
        (eventStart <= startDate && eventEnd >= endDate)
      );
    });
  }, [events]);

  /**
   * Get events for a specific time slot
   */
  const getEventsForTimeSlot = useCallback((date: Date, hour: number): CalendarEvent[] => {
    return events.filter((event) => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      
      // Check if event is on this date and overlaps with this hour
      const slotStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, 0);
      const slotEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour + 1, 0);
      
      return (
        (eventStart < slotEnd && eventEnd > slotStart)
      );
    });
  }, [events]);

  /**
   * Clear all events
   */
  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  /**
   * Set events (replace all)
   */
  const setAllEvents = useCallback((newEvents: CalendarEvent[]) => {
    setEvents(newEvents);
  }, []);

  return {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventsForDate,
    getEventsForRange,
    getEventsForTimeSlot,
    clearEvents,
    setAllEvents,
  };
};

export default useEventManager;
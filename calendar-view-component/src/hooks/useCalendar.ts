import { useState, useCallback } from 'react';
import { CalendarView } from '@/components/Calendar/CalendarView.types';

interface CalendarState {
  currentDate: Date;
  view: CalendarView;
  selectedDate: Date | null;
}

export const useCalendar = (initialDate: Date = new Date()) => {
  const [state, setState] = useState<CalendarState>({
    currentDate: initialDate,
    view: 'month',
    selectedDate: null,
  });

  const goToNextMonth = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentDate: new Date(prev.currentDate.getFullYear(), prev.currentDate.getMonth() + 1, 1),
    }));
  }, []);

  const goToPreviousMonth = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentDate: new Date(prev.currentDate.getFullYear(), prev.currentDate.getMonth() - 1, 1),
    }));
  }, []);

  const goToToday = useCallback(() => {
    setState(prev => ({ ...prev, currentDate: new Date() }));
  }, []);

  const goToNextWeek = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentDate: new Date(prev.currentDate.getTime() + 7 * 24 * 60 * 60 * 1000),
    }));
  }, []);

  const goToPreviousWeek = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentDate: new Date(prev.currentDate.getTime() - 7 * 24 * 60 * 60 * 1000),
    }));
  }, []);

  const toggleView = useCallback(() => {
    setState(prev => ({ ...prev, view: prev.view === 'month' ? 'week' : 'month' }));
  }, []);

  const setView = useCallback((view: CalendarView) => {
    setState(prev => ({ ...prev, view }));
  }, []);

  const selectDate = useCallback((date: Date | null) => {
    setState(prev => ({ ...prev, selectedDate: date }));
  }, []);

  return {
    currentDate: state.currentDate,
    view: state.view,
    selectedDate: state.selectedDate,
    goToNextMonth,
    goToPreviousMonth,
    goToToday,
    goToNextWeek,
    goToPreviousWeek,
    toggleView,
    setView,
    selectDate,
  };
};

export default useCalendar;
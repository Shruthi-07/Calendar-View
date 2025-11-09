import { CalendarEvent } from '@/components/Calendar/CalendarView.types';

export const generateEventId = (): string => {
  return `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const EVENT_COLORS = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#8b5cf6',
  '#ef4444',
  '#06b6d4',
  '#f97316',
  '#ec4899',
];

export const EVENT_CATEGORIES = [
  'Meeting',
  'Work',
  'Personal',
  'Design',
  'Development',
  'Other',
];

export const validateEvent = (
  event: Partial<CalendarEvent>
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!event.title || event.title.trim().length === 0) {
    errors.title = 'Title is required';
  } else if (event.title.length > 100) {
    errors.title = 'Title must be less than 100 characters';
  }

  if (event.description && event.description.length > 500) {
    errors.description = 'Description must be less than 500 characters';
  }

  if (!event.startDate) {
    errors.startDate = 'Start date is required';
  }

  if (!event.endDate) {
    errors.endDate = 'End date is required';
  }

  if (event.startDate && event.endDate && event.endDate < event.startDate) {
    errors.endDate = 'End date must be after start date';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
/**
 * Calendar Event interface
 */
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  color?: string;
  category?: string;
}

/**
 * Calendar view type
 */
export type CalendarView = 'month' | 'week';

/**
 * Props for CalendarView component
 */
export interface CalendarViewProps {
  events: CalendarEvent[];
  onEventAdd: (event: CalendarEvent) => void;
  onEventUpdate: (id: string, updates: Partial<CalendarEvent>) => void;
  onEventDelete: (id: string) => void;
  initialView?: CalendarView;
  initialDate?: Date;
}

/**
 * Props for MonthView component
 */
export interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onDateClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}

/**
 * Props for WeekView component
 */
export interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onDateClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}

/**
 * Props for CalendarCell component
 */
export interface CalendarCellProps {
  date: Date;
  events: CalendarEvent[];
  isToday: boolean;
  isCurrentMonth: boolean;
  isSelected: boolean;
  onClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}

/**
 * Props for EventModal component
 */
export interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  onDelete?: (id: string) => void;
  event?: CalendarEvent;
  selectedDate?: Date;
}

/**
 * Form data for event creation/editing
 */
export interface EventFormData {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  color: string;
  category: string;
}

/**
 * Form validation errors
 */
export type FormErrors = Partial<Record<keyof EventFormData, string>>;
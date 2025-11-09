import { CalendarEvent } from '@/components/Calendar/CalendarView.types';

/**
 * Sample calendar events for testing and demonstration
 * These events are relative to the current date for better testing
 */
export const getSampleEvents = (): CalendarEvent[] => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();

  return [
    {
      id: 'evt-1',
      title: 'Team Standup',
      description: 'Daily sync with the development team',
      startDate: new Date(currentYear, currentMonth, currentDay, 9, 0),
      endDate: new Date(currentYear, currentMonth, currentDay, 9, 30),
      color: '#3b82f6', // Blue
      category: 'Meeting',
    },
    {
      id: 'evt-2',
      title: 'Design Review',
      description: 'Review new component designs with the design team',
      startDate: new Date(currentYear, currentMonth, currentDay, 14, 0),
      endDate: new Date(currentYear, currentMonth, currentDay, 15, 30),
      color: '#10b981', // Green
      category: 'Design',
    },
    {
      id: 'evt-3',
      title: 'Client Presentation',
      description: 'Present Q4 roadmap to stakeholders',
      startDate: new Date(currentYear, currentMonth, currentDay + 1, 10, 0),
      endDate: new Date(currentYear, currentMonth, currentDay + 1, 11, 30),
      color: '#f59e0b', // Amber
      category: 'Meeting',
    },
    {
      id: 'evt-4',
      title: 'Development Sprint',
      description: 'Sprint planning and task assignment for the next iteration',
      startDate: new Date(currentYear, currentMonth, currentDay + 2, 9, 0),
      endDate: new Date(currentYear, currentMonth, currentDay + 2, 17, 0),
      color: '#8b5cf6', // Purple
      category: 'Work',
    },
    {
      id: 'evt-5',
      title: 'Lunch with Team',
      description: 'Team building lunch at the new restaurant',
      startDate: new Date(currentYear, currentMonth, currentDay + 3, 12, 0),
      endDate: new Date(currentYear, currentMonth, currentDay + 3, 13, 30),
      color: '#ec4899', // Pink
      category: 'Personal',
    },
    {
      id: 'evt-6',
      title: 'Code Review Session',
      description: 'Review PRs and provide feedback',
      startDate: new Date(currentYear, currentMonth, currentDay + 4, 15, 0),
      endDate: new Date(currentYear, currentMonth, currentDay + 4, 16, 0),
      color: '#06b6d4', // Cyan
      category: 'Development',
    },
  ];
};

/**
 * Static sample events for Storybook (using a fixed date for consistency)
 */
export const sampleEvents: CalendarEvent[] = [
  {
    id: 'evt-1',
    title: 'Team Standup',
    description: 'Daily sync with the development team',
    startDate: new Date(2024, 10, 15, 9, 0), // Nov 15, 2024
    endDate: new Date(2024, 10, 15, 9, 30),
    color: '#3b82f6',
    category: 'Meeting',
  },
  {
    id: 'evt-2',
    title: 'Design Review',
    description: 'Review new component designs',
    startDate: new Date(2024, 10, 15, 14, 0),
    endDate: new Date(2024, 10, 15, 15, 30),
    color: '#10b981',
    category: 'Design',
  },
  {
    id: 'evt-3',
    title: 'Client Presentation',
    description: 'Present Q4 roadmap',
    startDate: new Date(2024, 10, 16, 10, 0),
    endDate: new Date(2024, 10, 16, 11, 30),
    color: '#f59e0b',
    category: 'Meeting',
  },
  {
    id: 'evt-4',
    title: 'Development Sprint',
    description: 'Sprint planning session',
    startDate: new Date(2024, 10, 17, 9, 0),
    endDate: new Date(2024, 10, 17, 17, 0),
    color: '#8b5cf6',
    category: 'Work',
  },
  {
    id: 'evt-5',
    title: 'Team Lunch',
    startDate: new Date(2024, 10, 18, 12, 0),
    endDate: new Date(2024, 10, 18, 13, 30),
    color: '#ec4899',
    category: 'Personal',
  },
  {
    id: 'evt-6',
    title: 'Code Review',
    startDate: new Date(2024, 10, 19, 15, 0),
    endDate: new Date(2024, 10, 19, 16, 0),
    color: '#06b6d4',
    category: 'Development',
  },
];
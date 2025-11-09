import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { CalendarView } from './CalendarView';
import { CalendarEvent } from './CalendarView.types';
import { sampleEvents } from '@/data/sampleEvents';

// Generate many events for stress testing
const generateManyEvents = (count: number = 25): CalendarEvent[] => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#ef4444', '#06b6d4', '#f97316'];
  const categories = ['Meeting', 'Work', 'Personal', 'Design', 'Development', 'Other'];

  return Array.from({ length: count }, (_, i) => {
    const randomDay = Math.floor(Math.random() * 28) + 1;
    const startHour = Math.floor(Math.random() * 8) + 9; // 9am to 5pm
    
    return {
      id: `evt-many-${i}`,
      title: `Event ${i + 1}`,
      description: `Description for event ${i + 1}`,
      startDate: new Date(currentYear, currentMonth, randomDay, startHour, 0),
      endDate: new Date(currentYear, currentMonth, randomDay, startHour + 1, 0),
      color: colors[Math.floor(Math.random() * colors.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
    };
  });
};

const meta: Meta<typeof CalendarView> = {
  title: 'Calendar/CalendarView',
  component: CalendarView,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Calendar View Component

A fully interactive calendar component with month and week views, event management, and keyboard navigation.

## Features
- 📅 Month and Week views
- ➕ Create, edit, and delete events
- ⌨️ Full keyboard navigation (Arrow keys, Tab, Enter, ESC)
- 🎨 Color-coded events with categories
- 📱 Responsive design
- ♿ WCAG 2.1 AA compliant
- 🚀 Performance optimized with React.memo and lazy loading

## Keyboard Controls
- **Tab**: Navigate between controls
- **Arrow Keys**: Navigate grid cells (Month view)
- **Enter/Space**: Activate focused element
- **ESC**: Close modal
- **Home/End**: Jump to row start/end
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    initialView: {
      control: 'radio',
      options: ['month', 'week'],
      description: 'Initial calendar view',
      table: {
        defaultValue: { summary: 'month' },
      },
    },
    initialDate: {
      control: 'date',
      description: 'Initial date to display',
    },
    events: {
      description: 'Array of calendar events to display',
    },
    onEventAdd: {
      description: 'Callback when a new event is created',
      action: 'event-added',
    },
    onEventUpdate: {
      description: 'Callback when an event is updated',
      action: 'event-updated',
    },
    onEventDelete: {
      description: 'Callback when an event is deleted',
      action: 'event-deleted',
    },
  },
};

export default meta;
type Story = StoryObj<typeof CalendarView>;

/**
 * Default calendar view showing current month with sample events.
 * This story demonstrates the typical usage with a mix of events.
 */
export const Default: Story = {
  args: {
    events: sampleEvents,
    onEventAdd: (event) => console.log('Add event:', event),
    onEventUpdate: (id, updates) => console.log('Update event:', id, updates),
    onEventDelete: (id) => console.log('Delete event:', id),
    initialView: 'month',
    initialDate: new Date(2024, 10, 15),
  },
  parameters: {
    docs: {
      description: {
        story: 'Default calendar view showing November 2024 with 6 sample events. Click any date to create a new event, or click an existing event to edit it.',
      },
    },
  },
};

/**
 * Empty calendar with no events, showing the clean state.
 * Useful for testing initial user experience and event creation flow.
 */
export const Empty: Story = {
  args: {
    events: [],
    onEventAdd: (event) => console.log('Add event:', event),
    onEventUpdate: (id, updates) => console.log('Update event:', id, updates),
    onEventDelete: (id) => console.log('Delete event:', id),
    initialView: 'month',
    initialDate: new Date(2024, 10, 15),
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty calendar state with no events. Perfect for testing the event creation flow and seeing the clean interface.',
      },
    },
  },
};

/**
 * Week view showing a 7-day timeline with hourly slots.
 * Events are positioned based on their start and end times.
 */
export const WeekView: Story = {
  args: {
    events: sampleEvents,
    onEventAdd: (event) => console.log('Add event:', event),
    onEventUpdate: (id, updates) => console.log('Update event:', id, updates),
    onEventDelete: (id) => console.log('Delete event:', id),
    initialView: 'week',
    initialDate: new Date(2024, 10, 15),
  },
  parameters: {
    docs: {
      description: {
        story: 'Week view displaying a 7-day timeline with 24-hour slots. Events are positioned vertically based on their time. Try drag-to-create by clicking and dragging on time slots, or drag events to move them.',
      },
    },
  },
};

/**
 * Calendar with 20+ events to test performance and overflow handling.
 * Shows the "+N more" functionality when cells have more than 3 events.
 */
export const ManyEvents: Story = {
  args: {
    events: generateManyEvents(25),
    onEventAdd: (event) => console.log('Add event:', event),
    onEventUpdate: (id, updates) => console.log('Update event:', id, updates),
    onEventDelete: (id) => console.log('Delete event:', id),
    initialView: 'month',
  },
  parameters: {
    docs: {
      description: {
        story: 'Stress test with 25+ randomly distributed events. Tests performance optimization, "+N more" overflow button, and rendering with heavy data load.',
      },
    },
  },
};

/**
 * Calendar showing 5 events on a single day to demonstrate overflow.
 * This tests the "+2 more" button functionality.
 */
export const EventOverflow: Story = {
  args: {
    events: [
      {
        id: 'evt-overflow-1',
        title: 'Morning Standup',
        startDate: new Date(2024, 10, 15, 9, 0),
        endDate: new Date(2024, 10, 15, 9, 30),
        color: '#3b82f6',
        category: 'Meeting',
      },
      {
        id: 'evt-overflow-2',
        title: 'Design Review',
        startDate: new Date(2024, 10, 15, 10, 0),
        endDate: new Date(2024, 10, 15, 11, 0),
        color: '#10b981',
        category: 'Design',
      },
      {
        id: 'evt-overflow-3',
        title: 'Client Call',
        startDate: new Date(2024, 10, 15, 14, 0),
        endDate: new Date(2024, 10, 15, 15, 0),
        color: '#f59e0b',
        category: 'Meeting',
      },
      {
        id: 'evt-overflow-4',
        title: 'Code Review',
        startDate: new Date(2024, 10, 15, 15, 30),
        endDate: new Date(2024, 10, 15, 16, 30),
        color: '#8b5cf6',
        category: 'Development',
      },
      {
        id: 'evt-overflow-5',
        title: 'Team Sync',
        startDate: new Date(2024, 10, 15, 17, 0),
        endDate: new Date(2024, 10, 15, 17, 30),
        color: '#ec4899',
        category: 'Meeting',
      },
    ],
    onEventAdd: (event) => console.log('Add event:', event),
    onEventUpdate: (id, updates) => console.log('Update event:', id, updates),
    onEventDelete: (id) => console.log('Delete event:', id),
    initialView: 'month',
    initialDate: new Date(2024, 10, 15),
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows 5 events on November 15th to demonstrate the "+2 more" overflow button. Click the date to see all events.',
      },
    },
  },
};

/**
 * Interactive demo with full event management capabilities.
 * This story maintains its own state so you can create, edit, and delete events.
 */
export const InteractiveDemo: Story = {
  render: (args) => {
    const [events, setEvents] = useState<CalendarEvent[]>(sampleEvents);

    const handleEventAdd = (event: CalendarEvent) => {
      console.log('Event added:', event);
      setEvents([...events, event]);
    };

    const handleEventUpdate = (id: string, updates: Partial<CalendarEvent>) => {
      console.log('Event updated:', id, updates);
      setEvents(events.map(evt => 
        evt.id === id ? { ...evt, ...updates } : evt
      ));
    };

    const handleEventDelete = (id: string) => {
      console.log('Event deleted:', id);
      setEvents(events.filter(evt => evt.id !== id));
    };

    return (
      <CalendarView
        {...args}
        events={events}
        onEventAdd={handleEventAdd}
        onEventUpdate={handleEventUpdate}
        onEventDelete={handleEventDelete}
      />
    );
  },
  args: {
    initialView: 'month',
    initialDate: new Date(2024, 10, 15),
  },
  parameters: {
    docs: {
      description: {
        story: 'Fully interactive demo with state management. Try creating, editing, and deleting events. Changes persist within this Storybook session.',
      },
    },
  },
};

/**
 * Mobile responsive view showing how the calendar adapts to smaller screens.
 * Resize your browser or use device emulation to see responsive behavior.
 */
export const MobileView: Story = {
  args: {
    events: sampleEvents,
    onEventAdd: (event) => console.log('Add event:', event),
    onEventUpdate: (id, updates) => console.log('Update event:', id, updates),
    onEventDelete: (id) => console.log('Delete event:', id),
    initialView: 'month',
    initialDate: new Date(2024, 10, 15),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Mobile responsive view. The calendar adapts to smaller screens with stacked controls and touch-friendly interactions. Use the viewport toolbar to switch between device sizes.',
      },
    },
  },
};

/**
 * Accessibility demonstration showing keyboard navigation.
 * Use Tab, Arrow keys, Enter, and ESC to navigate without a mouse.
 */
export const AccessibilityDemo: Story = {
  args: {
    events: sampleEvents,
    onEventAdd: (event) => console.log('Add event:', event),
    onEventUpdate: (id, updates) => console.log('Update event:', id, updates),
    onEventDelete: (id) => console.log('Delete event:', id),
    initialView: 'month',
    initialDate: new Date(2024, 10, 15),
  },
  parameters: {
    docs: {
      description: {
        story: `
### Keyboard Navigation

Try these keyboard shortcuts:
- **Tab**: Move between header buttons
- **Arrow Keys**: Navigate calendar grid cells
- **Enter/Space**: Activate focused element
- **ESC**: Close modal
- **Home/End**: Jump to row start/end

All interactive elements have proper ARIA labels and focus indicators.
        `,
      },
    },
  },
};

/**
 * Playground story with all controls available for experimentation.
 * Use the Controls addon to modify props and see real-time changes.
 */
export const Playground: Story = {
  args: {
    events: sampleEvents,
    onEventAdd: (event) => console.log('Add event:', event),
    onEventUpdate: (id, updates) => console.log('Update event:', id, updates),
    onEventDelete: (id) => console.log('Delete event:', id),
    initialView: 'month',
    initialDate: new Date(2024, 10, 15),
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground where you can modify props using the Controls addon. Experiment with different dates, views, and event configurations.',
      },
    },
  },
};
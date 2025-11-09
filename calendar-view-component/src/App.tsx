import React, { useState } from 'react';
import { CalendarView } from '@/components/Calendar';
import { CalendarEvent } from '@/components/Calendar/CalendarView.types';
import { getSampleEvents } from '@/data/sampleEvents';

const App: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>(getSampleEvents());

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
    <div className="min-h-screen bg-neutral-50">
      <div className="h-screen flex flex-col">
        <div className="flex-1">
          <CalendarView
            events={events}
            onEventAdd={handleEventAdd}
            onEventUpdate={handleEventUpdate}
            onEventDelete={handleEventDelete}
            initialView="month"
          />
        </div>
      </div>
    </div>
  );
};

export default App;
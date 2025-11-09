import React, { useState, useCallback, useRef, useMemo } from 'react';
import { WeekViewProps, CalendarEvent } from './CalendarView.types';
import { getWeekRange, getDayNames, isSameDay, isToday } from '@/utils/date.utils';
import clsx from 'clsx';

/**
 * Week View Component
 * Displays a 7-day horizontal layout with time slots (00:00 - 23:00)
 */
export const WeekView: React.FC<WeekViewProps> = ({
  currentDate,
  events,
  onDateClick,
  onEventClick,
}) => {
  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    startTime: Date | null;
    endTime: Date | null;
    column: number | null;
  }>({
    isDragging: false,
    startTime: null,
    endTime: null,
    column: null,
  });

  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);
  const weekViewRef = useRef<HTMLDivElement>(null);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const { start: weekStart } = useMemo(() => getWeekRange(currentDate), [currentDate]);
  
  // Generate 7 days for the week
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(weekStart);
      day.setDate(day.getDate() + i);
      return day;
    });
  }, [weekStart]);

  const dayNames = useMemo(() => getDayNames(), []);

  // Calculate event position and height
  const calculateEventStyle = useCallback((event: CalendarEvent, date: Date) => {
    const eventStart = new Date(event.startDate);
    const eventEnd = new Date(event.endDate);
    
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0);
    
    // Calculate top position (in pixels, each hour is 60px)
    const startMinutes = (eventStart.getTime() - dayStart.getTime()) / (1000 * 60);
    const top = (startMinutes / 60) * 60; // 60px per hour
    
    // Calculate height
    const durationMinutes = (eventEnd.getTime() - eventStart.getTime()) / (1000 * 60);
    const height = (durationMinutes / 60) * 60; // 60px per hour
    
    return {
      top: Math.max(0, top),
      height: Math.max(30, height), // Minimum 30px height
    };
  }, []);

  // Handle drag to create
  const handleTimeSlotMouseDown = useCallback((date: Date, hour: number, e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    
    const startTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, 0);
    const columnIndex = weekDays.findIndex(d => isSameDay(d, date));
    
    setDragState({
      isDragging: true,
      startTime,
      endTime: new Date(startTime.getTime() + 60 * 60 * 1000), // 1 hour later
      column: columnIndex,
    });
    
    e.preventDefault();
  }, [weekDays]);

  const handleTimeSlotMouseMove = useCallback((date: Date, hour: number, _e: React.MouseEvent) => {
    if (!dragState.isDragging || dragState.column === null) return;
    
    const columnIndex = weekDays.findIndex(d => isSameDay(d, date));
    
    // Only allow dragging in the same column
    if (columnIndex !== dragState.column) return;
    
    const currentTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, 0);
    
    if (dragState.startTime && currentTime >= dragState.startTime) {
      setDragState(prev => ({
        ...prev,
        endTime: new Date(currentTime.getTime() + 60 * 60 * 1000),
      }));
    }
  }, [dragState, weekDays]);

  const handleTimeSlotMouseUp = useCallback(() => {
    if (dragState.isDragging && dragState.startTime && dragState.endTime) {
      // Open modal with pre-filled times
      onDateClick(dragState.startTime);
    }
    
    setDragState({
      isDragging: false,
      startTime: null,
      endTime: null,
      column: null,
    });
  }, [dragState, onDateClick]);

  // Handle event drag
  const handleEventDragStart = useCallback((event: CalendarEvent, e: React.DragEvent) => {
    setDraggedEvent(event);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', event.id);
  }, []);

  const handleEventDrop = useCallback((date: Date, hour: number, e: React.DragEvent) => {
    e.preventDefault();
    
    if (!draggedEvent) return;
    
    const originalStart = new Date(draggedEvent.startDate);
    const originalEnd = new Date(draggedEvent.endDate);
    const duration = originalEnd.getTime() - originalStart.getTime();
    
    const newStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, originalStart.getMinutes());
    const newEnd = new Date(newStart.getTime() + duration);
    
    // Update event via callback (parent will handle)
    onEventClick({
      ...draggedEvent,
      startDate: newStart,
      endDate: newEnd,
    });
    
    setDraggedEvent(null);
  }, [draggedEvent, onEventClick]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  // Render drag preview
  const renderDragPreview = () => {
    if (!dragState.isDragging || !dragState.startTime || !dragState.endTime || dragState.column === null) {
      return null;
    }
    
    const startMinutes = dragState.startTime.getHours() * 60 + dragState.startTime.getMinutes();
    const endMinutes = dragState.endTime.getHours() * 60 + dragState.endTime.getMinutes();
    const top = (startMinutes / 60) * 60;
    const height = ((endMinutes - startMinutes) / 60) * 60;
    
    return (
      <div
        className="absolute left-1 right-1 bg-primary-200 border-2 border-primary-500 border-dashed rounded z-10 pointer-events-none"
        style={{
          top: `${top}px`,
          height: `${height}px`,
        }}
      >
        <div className="px-2 py-1 text-xs text-primary-900 font-medium">
          New Event
        </div>
      </div>
    );
  };

  return (
    <div className="week-view flex flex-col h-full bg-white" ref={weekViewRef}>
      {/* Header with day names */}
      <div className="flex border-b border-neutral-200 bg-neutral-50 sticky top-0 z-20">
        <div className="w-20 flex-shrink-0 border-r border-neutral-200" />
        {weekDays.map((day, index) => {
          const todayCheck = isToday(day);
          return (
            <div
              key={day.toISOString()}
              className="flex-1 text-center py-3 border-r border-neutral-200 last:border-r-0"
            >
              <div className="text-xs font-semibold text-neutral-600">
                {dayNames[index]}
              </div>
              <div
                className={clsx(
                  'text-2xl font-bold mt-1',
                  todayCheck ? 'text-primary-600' : 'text-neutral-900'
                )}
              >
                {day.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Time grid */}
      <div className="flex-1 overflow-auto">
        <div className="flex relative" style={{ minHeight: '1440px' }}> {/* 24 hours × 60px */}
          {/* Time labels */}
          <div className="w-20 flex-shrink-0 border-r border-neutral-200 relative">
            {hours.map((hour) => (
              <div
                key={hour}
                className="h-[60px] border-b border-neutral-200 flex items-start justify-end pr-2 pt-1"
              >
                <span className="text-xs text-neutral-500 font-medium">
                  {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                </span>
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDays.map((day, columnIndex) => {
            const dayEvents = events.filter(e => isSameDay(new Date(e.startDate), day));
            
            return (
              <div
                key={day.toISOString()}
                className="flex-1 border-r border-neutral-200 last:border-r-0 relative"
              >
                {/* Hour slots */}
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="h-[60px] border-b border-neutral-200 hover:bg-primary-50 transition-colors cursor-pointer relative"
                    onMouseDown={(e) => handleTimeSlotMouseDown(day, hour, e)}
                    onMouseMove={(e) => handleTimeSlotMouseMove(day, hour, e)}
                    onMouseUp={handleTimeSlotMouseUp}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleEventDrop(day, hour, e)}
                    role="button"
                    tabIndex={0}
                    aria-label={`${day.toLocaleDateString()} at ${hour}:00`}
                  />
                ))}

                {/* Events */}
                {dayEvents.map((event) => {
                  const style = calculateEventStyle(event, day);
                  return (
                    <div
                      key={event.id}
                      className="absolute left-1 right-1 rounded shadow-sm border-l-4 cursor-pointer hover:shadow-md transition-shadow overflow-hidden z-10"
                      style={{
                        top: `${style.top}px`,
                        height: `${style.height}px`,
                        backgroundColor: event.color ? `${event.color}20` : '#3b82f620',
                        borderLeftColor: event.color || '#3b82f6',
                      }}
                      draggable
                      onDragStart={(e) => handleEventDragStart(event, e)}
                      onClick={() => onEventClick(event)}
                      role="button"
                      tabIndex={0}
                      aria-label={`${event.title} from ${new Date(event.startDate).toLocaleTimeString()} to ${new Date(event.endDate).toLocaleTimeString()}`}
                    >
                      <div className="px-2 py-1">
                        <div className="text-xs font-semibold text-neutral-900 truncate">
                          {event.title}
                        </div>
                        <div className="text-xs text-neutral-600">
                          {new Date(event.startDate).toLocaleTimeString('en-US', { 
                            hour: 'numeric', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Drag preview for this column */}
                {dragState.column === columnIndex && renderDragPreview()}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeekView;
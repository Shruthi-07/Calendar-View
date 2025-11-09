import React, { useState, useEffect, useRef } from 'react';
import { EventModalProps, EventFormData, FormErrors, CalendarEvent } from './CalendarView.types';
import { Button } from '@/components/primitives/Button';
import { generateEventId, EVENT_COLORS, EVENT_CATEGORIES } from '@/utils/event.utils';

/**
 * Event Modal Component
 * Modal for creating and editing calendar events with validation
 */
export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  event,
  selectedDate,
}) => {
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Initialize form data
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    color: EVENT_COLORS[0] ?? '#3b82f6',
    category: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (event) {
        // Edit mode - populate with existing event
        setFormData({
          title: event.title,
          description: event.description || '',
          startDate: new Date(event.startDate),
          endDate: new Date(event.endDate),
          color: (event.color || EVENT_COLORS[0]) ?? '#3b82f6',
          category: event.category || '',
        });
      } else {
        // Create mode - use selected date or current date
        const baseDate = selectedDate || new Date();
        const startDate = new Date(baseDate);
        startDate.setHours(9, 0, 0, 0);
        const endDate = new Date(baseDate);
        endDate.setHours(10, 0, 0, 0);

        setFormData({
          title: '',
          description: '',
          startDate,
          endDate,
          color: EVENT_COLORS[0] ?? '#3b82f6',
          category: '',
        });
      }
      setErrors({});
      
      // Focus title input when modal opens
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, event, selectedDate]);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    // Description validation
    if (formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    // Date validation
    if (formData.endDate <= formData.startDate) {
      newErrors.endDate = 'End time must be after start time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const eventData: CalendarEvent = {
      id: event?.id || generateEventId(),
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      startDate: formData.startDate,
      endDate: formData.endDate,
      color: formData.color,
      category: formData.category || undefined,
    };

    onSave(eventData);
    setIsSubmitting(false);
    handleClose();
  };

  // Handle delete
  const handleDelete = () => {
    if (event && onDelete && window.confirm('Are you sure you want to delete this event?')) {
      onDelete(event.id);
      handleClose();
    }
  };

  // Handle close
  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      startDate: new Date(),
      endDate: new Date(),
      color: EVENT_COLORS[0] ?? '#3b82f6',
      category: '',
    });
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  // Handle input changes
  const handleChange = (field: keyof EventFormData, value: string | Date) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Format datetime-local input value
  const formatDateTimeLocal = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Parse datetime-local input value
  const parseDateTimeLocal = (value: string): Date => {
    return new Date(value);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div
        className="bg-white rounded-xl shadow-modal w-full max-w-md mx-4 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="px-6 py-4 border-b border-neutral-200">
            <h2 id="modal-title" className="text-xl font-bold text-neutral-900">
              {event ? 'Edit Event' : 'Create Event'}
            </h2>
            <p id="modal-description" className="text-sm text-neutral-600 mt-1">
              {event ? 'Update event details below' : 'Fill in the event details below'}
            </p>
          </div>

          {/* Form content */}
          <div className="px-6 py-4 space-y-4 max-h-[60vh] overflow-y-auto">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-1">
                Title <span className="text-error-500">*</span>
              </label>
              <input
                ref={titleInputRef}
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                maxLength={100}
                className={`w-full px-3 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.title ? 'border-error-500' : 'border-neutral-300'
                }`}
                placeholder="Event title"
                aria-invalid={!!errors.title}
                aria-describedby={errors.title ? 'title-error' : undefined}
              />
              <div className="flex justify-between mt-1">
                {errors.title ? (
                  <p id="title-error" className="text-sm text-error-500">
                    {errors.title}
                  </p>
                ) : (
                  <span />
                )}
                <p className="text-xs text-neutral-500">{formData.title.length}/100</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                maxLength={500}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none ${
                  errors.description ? 'border-error-500' : 'border-neutral-300'
                }`}
                placeholder="Event description (optional)"
                aria-invalid={!!errors.description}
                aria-describedby={errors.description ? 'description-error' : undefined}
              />
              <div className="flex justify-between mt-1">
                {errors.description ? (
                  <p id="description-error" className="text-sm text-error-500">
                    {errors.description}
                  </p>
                ) : (
                  <span />
                )}
                <p className="text-xs text-neutral-500">{formData.description.length}/500</p>
              </div>
            </div>

            {/* Start Date/Time */}
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-neutral-700 mb-1">
                Start Date & Time <span className="text-error-500">*</span>
              </label>
              <input
                type="datetime-local"
                id="startDate"
                value={formatDateTimeLocal(formData.startDate)}
                onChange={(e) => handleChange('startDate', parseDateTimeLocal(e.target.value))}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* End Date/Time */}
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-neutral-700 mb-1">
                End Date & Time <span className="text-error-500">*</span>
              </label>
              <input
                type="datetime-local"
                id="endDate"
                value={formatDateTimeLocal(formData.endDate)}
                onChange={(e) => handleChange('endDate', parseDateTimeLocal(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.endDate ? 'border-error-500' : 'border-neutral-300'
                }`}
                aria-invalid={!!errors.endDate}
                aria-describedby={errors.endDate ? 'endDate-error' : undefined}
              />
              {errors.endDate && (
                <p id="endDate-error" className="text-sm text-error-500 mt-1">
                  {errors.endDate}
                </p>
              )}
            </div>

            {/* Color Picker */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Color
              </label>
              <div className="flex gap-2">
                {EVENT_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleChange('color', color)}
                    className={`w-10 h-10 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                      formData.color === color ? 'ring-2 ring-neutral-900 ring-offset-2 scale-110' : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                    aria-label={`Select color ${color}`}
                    aria-pressed={formData.color === color}
                  />
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-neutral-700 mb-1">
                Category
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select a category (optional)</option>
                {EVENT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-neutral-200 flex items-center justify-between">
            <div>
              {event && onDelete && (
                <Button
                  type="button"
                  variant="danger"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                >
                  Delete
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
import React from 'react';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const DatePicker = ({ 
  value, 
  onChange, 
  label = "Due Date",
  placeholder = "Select due date",
  disabled = false,
  allowPast = false 
}) => {
  const quickOptions = [
    { label: 'Today', value: () => new Date() },
    { label: 'Tomorrow', value: () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow;
    }},
    { label: 'Next Week', value: () => {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      return nextWeek;
    }},
  ];

  const formatDateForInput = (date) => {
    if (!date) return '';
    return format(new Date(date), 'yyyy-MM-dd');
  };

  const handleDateChange = (e) => {
    const dateValue = e.target.value;
    if (dateValue) {
      const date = new Date(dateValue);
      onChange?.(date.toISOString());
    } else {
      onChange?.(null);
    }
  };

  const handleQuickSelect = (getDate) => {
    const date = getDate();
    onChange?.(date.toISOString());
  };

  const clearDate = () => {
    onChange?.(null);
  };

  const getDateDisplay = () => {
    if (!value) return null;
    
    const date = new Date(value);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isPast(date)) return `${format(date, 'MMM d')} (Overdue)`;
    return format(date, 'MMM d, yyyy');
  };

  const dateDisplay = getDateDisplay();
  const isOverdue = value && isPast(new Date(value)) && !isToday(new Date(value));

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <div className="flex-1">
          <Input
            label={label}
            type="date"
            value={formatDateForInput(value)}
            onChange={handleDateChange}
            disabled={disabled}
            min={allowPast ? undefined : format(new Date(), 'yyyy-MM-dd')}
            placeholder={placeholder}
          />
        </div>
        
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            icon="X"
            onClick={clearDate}
            disabled={disabled}
            className="mt-7 text-gray-400 hover:text-gray-600"
          />
        )}
      </div>

      {dateDisplay && (
        <div className={`
          flex items-center space-x-2 text-sm px-3 py-2 rounded-lg
          ${isOverdue 
            ? 'bg-red-50 text-red-700 border border-red-200' 
            : 'bg-blue-50 text-blue-700 border border-blue-200'
          }
        `}>
          <ApperIcon 
            name={isOverdue ? "AlertTriangle" : "Calendar"} 
            className="w-4 h-4" 
          />
          <span>Due {dateDisplay}</span>
        </div>
      )}

      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-500">Quick select:</span>
        {quickOptions.map((option, index) => (
          <Button
            key={index}
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleQuickSelect(option.value)}
            disabled={disabled}
            className="text-xs"
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default DatePicker;
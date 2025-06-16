import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, isToday } from 'date-fns';

interface MiniCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  tasksPerDay: Record<string, number>;
  className?: string;
}

const MiniCalendar: React.FC<MiniCalendarProps> = ({
  selectedDate,
  onDateSelect,
  tasksPerDay,
  className = ""
}) => {
  const [currentMonth, setCurrentMonth] = React.useState(selectedDate);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get the first day of the week for the month (to handle padding)
  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  // Get all days to display (including padding days from previous/next month)
  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: new Date(startDate.getTime() + 41 * 24 * 60 * 60 * 1000) // 6 weeks
  }).slice(0, 42);

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentMonth(newMonth);
  };

  const getTaskCount = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return tasksPerDay[dateKey] || 0;
  };

  const getDayClasses = (day: Date) => {
    const baseClasses = "w-8 h-8 flex items-center justify-center text-sm rounded-lg cursor-pointer transition-colors relative";
    
    if (!isSameMonth(day, currentMonth)) {
      return `${baseClasses} text-gray-300 dark:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800`;
    }
    
    if (isSameDay(day, selectedDate)) {
      return `${baseClasses} bg-indigo-600 text-white font-medium`;
    }
    
    if (isToday(day)) {
      return `${baseClasses} bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-medium`;
    }
    
    return `${baseClasses} text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800`;
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
        >
          <ChevronLeft size={16} className="text-gray-600 dark:text-gray-400" />
        </button>
        
        <h3 className="font-semibold text-gray-900 dark:text-white">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        
        <button
          onClick={() => navigateMonth('next')}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
        >
          <ChevronRight size={16} className="text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <div key={day} className="text-xs font-medium text-gray-500 dark:text-gray-400 text-center py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day) => {
          const taskCount = getTaskCount(day);
          return (
            <div key={day.toISOString()} className="relative">
              <button
                onClick={() => onDateSelect(day)}
                className={getDayClasses(day)}
              >
                {format(day, 'd')}
                
                {/* Task indicator */}
                {taskCount > 0 && isSameMonth(day, currentMonth) && (
                  <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2">
                    <div className={`w-1 h-1 rounded-full ${
                      isSameDay(day, selectedDate) 
                        ? 'bg-white' 
                        : 'bg-indigo-500 dark:bg-indigo-400'
                    }`} />
                  </div>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MiniCalendar;
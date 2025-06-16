import React, { useState } from 'react';
import { Plus, X, Clock, Flag, Bell } from 'lucide-react';
import Button from './Button';
import { DailyTask } from '../../contexts/AppContext';

interface TaskFormProps {
  onSubmit: (task: Omit<DailyTask, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  selectedDate: Date;
  editingTask?: DailyTask;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, onCancel, selectedDate, editingTask }) => {
  const [name, setName] = useState(editingTask?.name || '');
  const [dueTime, setDueTime] = useState(editingTask?.dueTime || '');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>(editingTask?.priority || 'Medium');
  const [reminderEnabled, setReminderEnabled] = useState(!!editingTask?.dueTime);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmit({
      name: name.trim(),
      dueTime: (dueTime && reminderEnabled) ? dueTime : undefined,
      priority,
      completed: editingTask?.completed || false,
      date: selectedDate.toISOString().split('T')[0],
      completedAt: editingTask?.completedAt
    });

    // Reset form
    setName('');
    setDueTime('');
    setPriority('Medium');
    setReminderEnabled(false);
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'High':
        return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400';
      case 'Low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300';
    }
  };

  const isToday = selectedDate.toDateString() === new Date().toDateString();
  const isPastDate = selectedDate < new Date(new Date().setHours(0, 0, 0, 0));

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-4">
      {/* Task Name */}
      <div>
        <label htmlFor="taskName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Task Name
        </label>
        <input
          id="taskName"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter task name..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          autoFocus
        />
      </div>

      {/* Reminder Toggle */}
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={() => setReminderEnabled(!reminderEnabled)}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
            reminderEnabled
              ? 'bg-indigo-50 dark:bg-indigo-900/50 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300'
              : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
          }`}
          disabled={isPastDate}
        >
          <Bell size={16} />
          <span className="text-sm font-medium">
            {reminderEnabled ? 'Reminder enabled' : 'Add reminder'}
          </span>
        </button>
        
        {isPastDate && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Reminders not available for past dates
          </span>
        )}
      </div>

      {/* Due Time */}
      {reminderEnabled && !isPastDate && (
        <div>
          <label htmlFor="dueTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Clock size={14} className="inline mr-1" />
            Reminder Time
          </label>
          <div className="space-y-2">
            <input
              id="dueTime"
              type="time"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <div className="flex items-start space-x-2 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <Bell size={14} className="text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="text-xs text-blue-700 dark:text-blue-300">
                <p className="font-medium">Notification reminder</p>
                <p>
                  {isToday 
                    ? 'You\'ll get a browser notification at the specified time today.'
                    : `You'll get a browser notification on ${selectedDate.toLocaleDateString()} at the specified time.`
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Priority */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <Flag size={14} className="inline mr-1" />
          Priority
        </label>
        <div className="flex space-x-2">
          {(['High', 'Medium', 'Low'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPriority(p)}
              className={`px-3 py-2 text-sm rounded-lg font-medium transition-colors ${
                priority === p
                  ? getPriorityColor(p)
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end space-x-3 pt-2">
        <Button variant="ghost" onClick={onCancel}>
          <X size={16} className="mr-2" />
          Cancel
        </Button>
        <Button type="submit" disabled={!name.trim()}>
          <Plus size={16} className="mr-2" />
          {editingTask ? 'Update Task' : 'Add Task'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
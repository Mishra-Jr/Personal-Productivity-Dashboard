import React from 'react';
import { Check, Clock, Flag, Edit3, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import { DailyTask } from '../../contexts/AppContext';

interface TaskListProps {
  tasks: DailyTask[];
  onToggleComplete: (taskId: string) => void;
  onEdit: (task: DailyTask) => void;
  onDelete: (taskId: string) => void;
  sortBy: 'priority' | 'time' | 'created';
  filterBy: 'all' | 'pending' | 'completed';
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggleComplete,
  onEdit,
  onDelete,
  sortBy,
  filterBy
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
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

  const getPriorityWeight = (priority: string) => {
    switch (priority) {
      case 'High': return 3;
      case 'Medium': return 2;
      case 'Low': return 1;
      default: return 0;
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        return getPriorityWeight(b.priority) - getPriorityWeight(a.priority);
      case 'time':
        if (!a.dueTime && !b.dueTime) return 0;
        if (!a.dueTime) return 1;
        if (!b.dueTime) return -1;
        return a.dueTime.localeCompare(b.dueTime);
      case 'created':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  const filteredTasks = sortedTasks.filter(task => {
    switch (filterBy) {
      case 'pending':
        return !task.completed;
      case 'completed':
        return task.completed;
      default:
        return true;
    }
  });

  if (filteredTasks.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {filterBy === 'completed' ? 'No completed tasks' : 
           filterBy === 'pending' ? 'No pending tasks' : 'No tasks for this day'}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {filterBy === 'all' ? 'Add your first task to get started!' : 
           `Switch to "${filterBy === 'completed' ? 'pending' : 'all'}" to see other tasks.`}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filteredTasks.map((task) => (
        <div
          key={task.id}
          className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 transition-all duration-200 ${
            task.completed ? 'opacity-75' : task.missed ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10' : 'hover:shadow-md'
          }`}
        >
          <div className="flex items-start space-x-3">
            {/* Checkbox */}
            <button
              onClick={() => onToggleComplete(task.id)}
              className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                task.completed
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : task.missed
                    ? 'border-red-400 dark:border-red-600 hover:border-red-500'
                    : 'border-gray-300 dark:border-gray-600 hover:border-indigo-500'
              }`}
            >
              {task.completed && <Check size={12} />}
            </button>

            {/* Task Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className={`font-medium ${
                      task.completed 
                        ? 'text-gray-500 dark:text-gray-400 line-through' 
                        : task.missed
                          ? 'text-red-700 dark:text-red-400'
                          : 'text-gray-900 dark:text-white'
                    }`}>
                      {task.name}
                    </h3>
                    
                    {/* Status Indicators */}
                    {task.completed && (
                      <CheckCircle size={16} className="text-green-500" title="Completed" />
                    )}
                    {task.missed && (
                      <AlertTriangle size={16} className="text-red-500" title="Missed" />
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-3 mt-2">
                    {/* Priority */}
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                      <Flag size={10} className="mr-1" />
                      {task.priority}
                    </span>

                    {/* Due Time */}
                    {task.dueTime && (
                      <span className="inline-flex items-center text-xs text-gray-600 dark:text-gray-400">
                        <Clock size={10} className="mr-1" />
                        {task.dueTime}
                      </span>
                    )}

                    {/* Completion Time */}
                    {task.completed && task.completedAt && (
                      <span className="text-xs text-green-600 dark:text-green-400">
                        ✅ Completed at {new Date(task.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}

                    {/* Missed Time */}
                    {task.missed && task.missedAt && (
                      <span className="text-xs text-red-600 dark:text-red-400">
                        ❌ Missed at {new Date(task.missedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-1 ml-2">
                  <button
                    onClick={() => onEdit(task)}
                    className="p-1 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    title="Edit task"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => onDelete(task.id)}
                    className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    title="Delete task"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
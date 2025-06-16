import React, { useEffect, useState } from 'react';
import { CheckCircle, X, Star, TrendingUp } from 'lucide-react';

interface TaskCompletionToastProps {
  isVisible: boolean;
  taskName: string;
  pointsEarned: number;
  onClose: () => void;
  isAllComplete?: boolean;
  bonusPoints?: number;
}

const TaskCompletionToast: React.FC<TaskCompletionToastProps> = ({
  isVisible,
  taskName,
  pointsEarned,
  onClose,
  isAllComplete = false,
  bonusPoints = 0
}) => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!shouldRender) return null;

  return (
    <div className={`
      fixed top-4 right-4 z-50 transform transition-all duration-300 ease-out
      ${isVisible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'}
    `}>
      <div className={`
        max-w-sm w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700
        ${isAllComplete ? 'ring-2 ring-yellow-400' : ''}
      `}>
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {isAllComplete ? (
                <Star size={24} className="text-yellow-500" />
              ) : (
                <CheckCircle size={24} className="text-green-500" />
              )}
            </div>
            <div className="ml-3 w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {isAllComplete ? '🎉 All tasks completed!' : 'Task completed!'}
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {isAllComplete ? 'Amazing work today!' : taskName}
              </p>
              <div className="mt-2 flex items-center space-x-2">
                <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                  <TrendingUp size={14} />
                  <span className="text-sm font-medium">+{pointsEarned} points</span>
                </div>
                {bonusPoints > 0 && (
                  <div className="flex items-center space-x-1 text-yellow-600 dark:text-yellow-400">
                    <Star size={14} />
                    <span className="text-sm font-medium">+{bonusPoints} bonus</span>
                  </div>
                )}
              </div>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                onClick={onClose}
                className="bg-white dark:bg-gray-800 rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCompletionToast;
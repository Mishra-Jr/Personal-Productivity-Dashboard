import { useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { DailyTask } from '../contexts/AppContext';

interface UseEndOfDayCheckProps {
  tasks: DailyTask[];
  onMarkMissedTasks: (taskIds: string[]) => void;
  enabled?: boolean;
}

export const useEndOfDayCheck = ({ 
  tasks, 
  onMarkMissedTasks, 
  enabled = true 
}: UseEndOfDayCheckProps) => {
  
  const checkForMissedTasks = useCallback(() => {
    if (!enabled) return;
    
    const now = new Date();
    const today = format(now, 'yyyy-MM-dd');
    const hour = now.getHours();
    
    // Only check at end of day (after 10 PM)
    if (hour < 22) return;
    
    // Check if we've already done end-of-day check today
    const lastCheckDate = localStorage.getItem('last-end-of-day-check');
    if (lastCheckDate === today) return;
    
    // Find incomplete tasks for today
    const todayTasks = tasks.filter(task => 
      task.date === today && !task.completed && !task.missed
    );
    
    if (todayTasks.length > 0) {
      // Mark tasks as missed
      const taskIds = todayTasks.map(task => task.id);
      onMarkMissedTasks(taskIds);
      
      // Show notification about missed tasks
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Daily Review', {
          body: `${todayTasks.length} task${todayTasks.length !== 1 ? 's' : ''} marked as missed. Tomorrow is a new day!`,
          icon: '/vite.svg'
        });
      }
    }
    
    // Mark as checked for today
    localStorage.setItem('last-end-of-day-check', today);
    
  }, [tasks, onMarkMissedTasks, enabled]);

  useEffect(() => {
    // Check immediately
    checkForMissedTasks();
    
    // Set up interval to check every 30 minutes
    const interval = setInterval(checkForMissedTasks, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [checkForMissedTasks]);

  // Manual trigger for testing
  const triggerEndOfDayCheck = useCallback(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    localStorage.removeItem('last-end-of-day-check');
    checkForMissedTasks();
  }, [checkForMissedTasks]);

  return {
    triggerEndOfDayCheck
  };
};
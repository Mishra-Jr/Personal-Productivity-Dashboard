import { useEffect, useRef, useCallback } from 'react';
import { DailyTask } from '../contexts/AppContext';
import { useNotifications } from './useNotifications';

interface UseTaskRemindersProps {
  tasks: DailyTask[];
  enabled: boolean;
}

export const useTaskReminders = ({ tasks, enabled }: UseTaskRemindersProps) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const notifiedTasksRef = useRef<Set<string>>(new Set());
  const { showNotification, permission } = useNotifications();

  // Load notified tasks from localStorage
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const storageKey = `notified-tasks-${today}`;
    const stored = localStorage.getItem(storageKey);
    
    if (stored) {
      try {
        const notifiedTasks = JSON.parse(stored);
        notifiedTasksRef.current = new Set(notifiedTasks);
      } catch (error) {
        console.error('Error loading notified tasks:', error);
      }
    }

    // Clean up old entries (keep only today's)
    const allKeys = Object.keys(localStorage);
    allKeys.forEach(key => {
      if (key.startsWith('notified-tasks-') && key !== storageKey) {
        localStorage.removeItem(key);
      }
    });
  }, []);

  // Save notified tasks to localStorage
  const saveNotifiedTasks = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    const storageKey = `notified-tasks-${today}`;
    const notifiedArray = Array.from(notifiedTasksRef.current);
    localStorage.setItem(storageKey, JSON.stringify(notifiedArray));
  }, []);

  // Check for due tasks and send notifications
  const checkReminders = useCallback(() => {
    if (!enabled || permission !== 'granted') return;

    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const today = now.toISOString().split('T')[0];

    // Filter tasks that are due now and haven't been notified
    const dueTasks = tasks.filter(task => {
      return (
        task.date === today &&
        task.dueTime === currentTime &&
        !task.completed &&
        !notifiedTasksRef.current.has(task.id)
      );
    });

    // Send notifications for due tasks
    dueTasks.forEach(task => {
      showNotification({
        title: '⏰ Task Reminder',
        body: `It's time for: ${task.name}`,
        tag: `task-${task.id}`,
        icon: '/vite.svg'
      });

      // Mark as notified
      notifiedTasksRef.current.add(task.id);
    });

    // Save updated notified tasks
    if (dueTasks.length > 0) {
      saveNotifiedTasks();
    }
  }, [tasks, enabled, permission, showNotification, saveNotifiedTasks]);

  // Start/stop reminder checking
  useEffect(() => {
    if (enabled && permission === 'granted') {
      // Check immediately
      checkReminders();

      // Set up interval to check every minute
      intervalRef.current = setInterval(checkReminders, 60000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    } else {
      // Clean up interval if disabled
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [enabled, permission, checkReminders]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Reset notified tasks when task list changes (new day, tasks added/removed)
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayTasks = tasks.filter(task => task.date === today);
    const todayTaskIds = new Set(todayTasks.map(task => task.id));

    // Remove notified status for tasks that no longer exist
    const currentNotified = Array.from(notifiedTasksRef.current);
    const validNotified = currentNotified.filter(taskId => todayTaskIds.has(taskId));
    
    if (validNotified.length !== currentNotified.length) {
      notifiedTasksRef.current = new Set(validNotified);
      saveNotifiedTasks();
    }
  }, [tasks, saveNotifiedTasks]);

  return {
    isEnabled: enabled && permission === 'granted',
    notifiedTasks: Array.from(notifiedTasksRef.current)
  };
};
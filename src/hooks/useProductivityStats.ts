import { useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, subDays } from 'date-fns';
import { DailyTask } from '../contexts/AppContext';

interface ProductivityStats {
  tasksCompleted: number;
  projectCount: number;
  mediaCount: number;
  streak: number;
  trends: {
    tasksCompletedTrend: number;
    streakTrend: number;
    projectsTrend: number;
  };
}

export const useProductivityStats = (
  dailyTasks: DailyTask[],
  projectCount: number,
  mediaCount: number
): ProductivityStats => {
  return useMemo(() => {
    const today = new Date();
    const currentMonth = startOfMonth(today);
    const lastMonth = startOfMonth(subDays(currentMonth, 1));
    
    // Current month tasks
    const currentMonthTasks = dailyTasks.filter(task => {
      const taskDate = new Date(task.date);
      return taskDate >= currentMonth && taskDate <= endOfMonth(today);
    });
    
    // Last month tasks for comparison
    const lastMonthTasks = dailyTasks.filter(task => {
      const taskDate = new Date(task.date);
      return taskDate >= lastMonth && taskDate < currentMonth;
    });
    
    const currentMonthCompleted = currentMonthTasks.filter(task => task.completed).length;
    const lastMonthCompleted = lastMonthTasks.filter(task => task.completed).length;
    
    // Calculate streak - consecutive days with at least one completed task
    const calculateStreak = (): number => {
      let streak = 0;
      let currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      
      // Check if today has completed tasks (if it's not future)
      if (isToday(currentDate)) {
        const todayTasks = dailyTasks.filter(task => 
          task.date === format(currentDate, 'yyyy-MM-dd') && task.completed
        );
        if (todayTasks.length === 0) {
          // If today has no completed tasks, start from yesterday
          currentDate = subDays(currentDate, 1);
        }
      }
      
      // Count consecutive days with completed tasks
      while (true) {
        const dateStr = format(currentDate, 'yyyy-MM-dd');
        const dayTasks = dailyTasks.filter(task => 
          task.date === dateStr && task.completed
        );
        
        if (dayTasks.length > 0) {
          streak++;
          currentDate = subDays(currentDate, 1);
        } else {
          break;
        }
        
        // Prevent infinite loop - max 365 days
        if (streak >= 365) break;
      }
      
      return streak;
    };
    
    const currentStreak = calculateStreak();
    
    // Calculate last month's streak for trend
    const lastMonthEnd = subDays(currentMonth, 1);
    const calculateLastMonthStreak = (): number => {
      let streak = 0;
      let currentDate = new Date(lastMonthEnd);
      currentDate.setHours(0, 0, 0, 0);
      
      while (currentDate >= lastMonth) {
        const dateStr = format(currentDate, 'yyyy-MM-dd');
        const dayTasks = dailyTasks.filter(task => 
          task.date === dateStr && task.completed
        );
        
        if (dayTasks.length > 0) {
          streak++;
          currentDate = subDays(currentDate, 1);
        } else {
          break;
        }
        
        if (streak >= 31) break; // Max one month
      }
      
      return streak;
    };
    
    const lastMonthStreak = calculateLastMonthStreak();
    
    // Calculate trends
    const tasksCompletedTrend = lastMonthCompleted > 0 
      ? Math.round(((currentMonthCompleted - lastMonthCompleted) / lastMonthCompleted) * 100)
      : currentMonthCompleted > 0 ? 100 : 0;
    
    const streakTrend = lastMonthStreak > 0
      ? Math.round(((currentStreak - lastMonthStreak) / lastMonthStreak) * 100)
      : currentStreak > 0 ? 100 : 0;
    
    // For projects, we'll assume a simple growth metric
    const projectsTrend = projectCount > 0 ? 15 : 0; // Placeholder trend
    
    return {
      tasksCompleted: currentMonthCompleted,
      projectCount,
      mediaCount,
      streak: currentStreak,
      trends: {
        tasksCompletedTrend,
        streakTrend,
        projectsTrend
      }
    };
  }, [dailyTasks, projectCount, mediaCount]);
};
import { useEffect, useCallback } from 'react';
import { isWeekend, format } from 'date-fns';

interface UseWeekendPlanningProps {
  onShowPlanningPrompt: () => void;
  enabled?: boolean;
}

export const useWeekendPlanning = ({ 
  onShowPlanningPrompt, 
  enabled = true 
}: UseWeekendPlanningProps) => {
  
  const checkForWeekendPlanning = useCallback(() => {
    if (!enabled) return;
    
    const now = new Date();
    const today = format(now, 'yyyy-MM-dd');
    
    // Check if it's weekend (Saturday or Sunday)
    if (!isWeekend(now)) return;
    
    // Check if we've already shown the prompt today
    const lastPromptDate = localStorage.getItem('last-weekend-planning-prompt');
    if (lastPromptDate === today) return;
    
    // Check if it's a reasonable time (after 9 AM, before 9 PM)
    const hour = now.getHours();
    if (hour < 9 || hour > 21) return;
    
    // Show the prompt and mark as shown for today
    localStorage.setItem('last-weekend-planning-prompt', today);
    
    // Delay to avoid showing immediately on page load
    setTimeout(() => {
      onShowPlanningPrompt();
    }, 2000);
    
  }, [onShowPlanningPrompt, enabled]);

  useEffect(() => {
    // Check immediately
    checkForWeekendPlanning();
    
    // Set up interval to check every hour
    const interval = setInterval(checkForWeekendPlanning, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [checkForWeekendPlanning]);

  // Manual trigger for testing
  const triggerPlanningPrompt = useCallback(() => {
    onShowPlanningPrompt();
  }, [onShowPlanningPrompt]);

  return {
    triggerPlanningPrompt
  };
};
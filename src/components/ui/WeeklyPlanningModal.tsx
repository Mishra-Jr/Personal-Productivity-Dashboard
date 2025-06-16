import React, { useState, useEffect } from 'react';
import { X, Calendar, Target, Plus, Trash2, Save, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfWeek, addDays, isSameWeek } from 'date-fns';
import Button from './Button';
import { Card, CardContent } from './Card';
import { useApp } from '../../contexts/AppContext';
import { WeeklyGoals, DailyTask } from '../../contexts/AppContext';

interface WeeklyPlanningModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
}

const WeeklyPlanningModal: React.FC<WeeklyPlanningModalProps> = ({ 
  isOpen, 
  onClose, 
  selectedDate 
}) => {
  const { state, dispatch } = useApp();
  const { weeklyGoals } = state;
  
  const [currentWeek, setCurrentWeek] = useState(() => startOfWeek(selectedDate, { weekStartsOn: 1 })); // Monday start
  const [goals, setGoals] = useState<{ [key: string]: string[] }>({});
  const [newGoal, setNewGoal] = useState<{ [key: string]: string }>({});
  const [isEditing, setIsEditing] = useState(false);

  // Get week days (Monday to Sunday)
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i));
  
  // Load existing goals for the current week
  useEffect(() => {
    if (isOpen) {
      const weekStartDate = format(currentWeek, 'yyyy-MM-dd');
      const existingGoals = weeklyGoals.find(wg => wg.weekStartDate === weekStartDate);
      
      if (existingGoals) {
        setGoals(existingGoals.goals);
        setIsEditing(true);
      } else {
        // Initialize empty goals for each day
        const emptyGoals: { [key: string]: string[] } = {};
        weekDays.forEach(day => {
          emptyGoals[format(day, 'yyyy-MM-dd')] = [];
        });
        setGoals(emptyGoals);
        setIsEditing(false);
      }
      
      // Initialize new goal inputs
      const emptyNewGoals: { [key: string]: string } = {};
      weekDays.forEach(day => {
        emptyNewGoals[format(day, 'yyyy-MM-dd')] = '';
      });
      setNewGoal(emptyNewGoals);
    }
  }, [isOpen, currentWeek, weeklyGoals]);

  const addGoal = (dateKey: string) => {
    const goalText = newGoal[dateKey]?.trim();
    if (!goalText) return;

    setGoals(prev => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), goalText]
    }));
    
    setNewGoal(prev => ({
      ...prev,
      [dateKey]: ''
    }));
  };

  const removeGoal = (dateKey: string, goalIndex: number) => {
    setGoals(prev => ({
      ...prev,
      [dateKey]: prev[dateKey]?.filter((_, index) => index !== goalIndex) || []
    }));
  };

  const handleSave = () => {
    const weekStartDate = format(currentWeek, 'yyyy-MM-dd');
    
    // Create tasks for each goal
    const tasksToCreate: DailyTask[] = [];
    Object.entries(goals).forEach(([dateKey, dayGoals]) => {
      dayGoals.forEach(goal => {
        const newTask: DailyTask = {
          id: `task-${Date.now()}-${Math.random()}`,
          name: goal,
          priority: 'Medium',
          completed: false,
          missed: false,
          date: dateKey,
          createdAt: new Date()
        };
        tasksToCreate.push(newTask);
      });
    });

    // Save weekly goals
    const weeklyGoalsData: WeeklyGoals = {
      id: isEditing ? weeklyGoals.find(wg => wg.weekStartDate === weekStartDate)?.id || `week-${Date.now()}` : `week-${Date.now()}`,
      weekStartDate,
      goals,
      createdAt: new Date()
    };

    if (isEditing) {
      dispatch({ type: 'UPDATE_WEEKLY_GOALS', payload: weeklyGoalsData });
    } else {
      dispatch({ type: 'ADD_WEEKLY_GOALS', payload: weeklyGoalsData });
    }

    // Add tasks to daily planner
    tasksToCreate.forEach(task => {
      dispatch({ type: 'ADD_DAILY_TASK', payload: task });
    });

    onClose();
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = addDays(currentWeek, direction === 'next' ? 7 : -7);
    setCurrentWeek(newWeek);
  };

  const getDayName = (date: Date) => {
    return format(date, 'EEEE');
  };

  const getDayDate = (date: Date) => {
    return format(date, 'MMM d');
  };

  const getTotalGoalsForWeek = () => {
    return Object.values(goals).reduce((total, dayGoals) => total + dayGoals.length, 0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center">
              <Target size={20} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Weekly Planning
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Set your goals for the week of {format(currentWeek, 'MMM d')} - {format(addDays(currentWeek, 6), 'MMM d, yyyy')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => navigateWeek('prev')}
            className="flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronLeft size={16} />
            <span>Previous Week</span>
          </button>
          
          <div className="text-center">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Week of {format(currentWeek, 'MMMM d, yyyy')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {getTotalGoalsForWeek()} goals planned
            </p>
          </div>
          
          <button
            onClick={() => navigateWeek('next')}
            className="flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <span>Next Week</span>
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {weekDays.map((day) => {
              const dateKey = format(day, 'yyyy-MM-dd');
              const dayGoals = goals[dateKey] || [];
              const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
              
              return (
                <Card key={dateKey} className={`${isToday ? 'ring-2 ring-indigo-500' : ''}`}>
                  <CardContent className="p-4">
                    {/* Day Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className={`font-semibold ${isToday ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-900 dark:text-white'}`}>
                          {getDayName(day)}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {getDayDate(day)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar size={16} className={isToday ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'} />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {dayGoals.length} goal{dayGoals.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>

                    {/* Goals List */}
                    <div className="space-y-2 mb-4">
                      {dayGoals.map((goal, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg group"
                        >
                          <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                            {goal}
                          </span>
                          <button
                            onClick={() => removeGoal(dateKey, index)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add Goal Input */}
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Add a goal for this day..."
                        value={newGoal[dateKey] || ''}
                        onChange={(e) => setNewGoal(prev => ({
                          ...prev,
                          [dateKey]: e.target.value
                        }))}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addGoal(dateKey);
                          }
                        }}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => addGoal(dateKey)}
                        disabled={!newGoal[dateKey]?.trim()}
                        className="w-full"
                      >
                        <Plus size={14} className="mr-2" />
                        Add Goal
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Planning Tips */}
          <Card className="mt-6">
            <CardContent className="p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">💡 Weekly Planning Tips</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">🎯 Set SMART Goals</p>
                  <p>Make goals Specific, Measurable, Achievable, Relevant, and Time-bound</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">⚖️ Balance Your Week</p>
                  <p>Mix high-priority work tasks with personal development and self-care</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">📊 Track Progress</p>
                  <p>Review and adjust your goals daily to stay on track</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">🎉 Celebrate Wins</p>
                  <p>Acknowledge completed goals to maintain motivation</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {getTotalGoalsForWeek()} goals will be added to your daily planner
          </div>
          <div className="flex space-x-3">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={getTotalGoalsForWeek() === 0}>
              <Save size={16} className="mr-2" />
              {isEditing ? 'Update Goals' : 'Save & Create Tasks'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyPlanningModal;
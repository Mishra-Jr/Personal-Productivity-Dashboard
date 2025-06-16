import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Filter, SortAsc, Target, TrendingUp, Calendar as CalendarIcon, Award, Download, CheckSquare, Sparkles } from 'lucide-react';
import { format, isToday, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import MiniCalendar from '../components/ui/MiniCalendar';
import TaskForm from '../components/ui/TaskForm';
import TaskList from '../components/ui/TaskList';
import NotificationSettings from '../components/ui/NotificationSettings';
import ExportButtons from '../components/ui/ExportButtons';
import ProductivityScoreCard from '../components/ui/ProductivityScoreCard';
import WeeklyPlanningModal from '../components/ui/WeeklyPlanningModal';
import TaskCompletionToast from '../components/ui/TaskCompletionToast';
import { useApp } from '../contexts/AppContext';
import { useTaskReminders } from '../hooks/useTaskReminders';
import { useWeekendPlanning } from '../hooks/useWeekendPlanning';
import { useEndOfDayCheck } from '../hooks/useEndOfDayCheck';
import { DailyTask } from '../contexts/AppContext';

const DailyPlanner: React.FC = () => {
  const { state, dispatch } = useApp();
  const { dailyTasks, productivityScore } = state;
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<DailyTask | null>(null);
  const [sortBy, setSortBy] = useState<'priority' | 'time' | 'created'>('priority');
  const [filterBy, setFilterBy] = useState<'all' | 'pending' | 'completed'>('all');
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [showWeeklyPlanning, setShowWeeklyPlanning] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    const saved = localStorage.getItem('daily-planner-notifications');
    return saved ? JSON.parse(saved) : false;
  });

  // Toast state
  const [toastState, setToastState] = useState({
    isVisible: false,
    taskName: '',
    pointsEarned: 0,
    isAllComplete: false,
    bonusPoints: 0
  });

  // Save notification preference
  useEffect(() => {
    localStorage.setItem('daily-planner-notifications', JSON.stringify(notificationsEnabled));
  }, [notificationsEnabled]);

  // Initialize task reminders
  const { isEnabled: remindersActive } = useTaskReminders({
    tasks: dailyTasks,
    enabled: notificationsEnabled
  });

  // Weekend planning hook
  useWeekendPlanning({
    onShowPlanningPrompt: () => setShowWeeklyPlanning(true),
    enabled: true
  });

  // End of day check hook
  useEndOfDayCheck({
    tasks: dailyTasks,
    onMarkMissedTasks: (taskIds) => {
      taskIds.forEach(taskId => {
        dispatch({ type: 'MARK_TASK_MISSED', payload: taskId });
      });
    },
    enabled: true
  });

  // Get tasks for selected date
  const selectedDateString = format(selectedDate, 'yyyy-MM-dd');
  const tasksForSelectedDate = dailyTasks.filter(task => task.date === selectedDateString);

  // Calculate stats
  const stats = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const todayTasks = dailyTasks.filter(task => task.date === today);
    const completedToday = todayTasks.filter(task => task.completed).length;

    // This week's tasks
    const weekStart = startOfWeek(new Date());
    const weekEnd = endOfWeek(new Date());
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
    const thisWeekTasks = dailyTasks.filter(task => {
      const taskDate = new Date(task.date);
      return taskDate >= weekStart && taskDate <= weekEnd;
    });
    const completedThisWeek = thisWeekTasks.filter(task => task.completed).length;

    // Calculate streak (simplified - consecutive days with completed tasks)
    const sortedDates = [...new Set(dailyTasks.map(task => task.date))].sort().reverse();
    let streak = 0;
    let currentDate = new Date();
    
    for (const dateStr of sortedDates) {
      const date = new Date(dateStr);
      const dayTasks = dailyTasks.filter(task => task.date === dateStr);
      const hasCompletedTasks = dayTasks.some(task => task.completed);
      
      if (hasCompletedTasks) {
        const daysDiff = Math.floor((currentDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff === streak) {
          streak++;
        } else {
          break;
        }
      } else {
        break;
      }
    }

    return {
      completedToday,
      totalToday: todayTasks.length,
      completedThisWeek,
      totalThisWeek: thisWeekTasks.length,
      streak
    };
  }, [dailyTasks]);

  // Tasks per day for calendar indicators
  const tasksPerDay = useMemo(() => {
    const taskCounts: Record<string, number> = {};
    dailyTasks.forEach(task => {
      taskCounts[task.date] = (taskCounts[task.date] || 0) + 1;
    });
    return taskCounts;
  }, [dailyTasks]);

  const handleAddTask = (taskData: Omit<DailyTask, 'id' | 'createdAt'>) => {
    if (editingTask) {
      // Update existing task
      const updatedTask: DailyTask = {
        ...editingTask,
        ...taskData,
        id: editingTask.id,
        createdAt: editingTask.createdAt
      };
      dispatch({ type: 'UPDATE_DAILY_TASK', payload: updatedTask });
      setEditingTask(null);
    } else {
      // Add new task
      const newTask: DailyTask = {
        ...taskData,
        id: `task-${Date.now()}-${Math.random()}`,
        createdAt: new Date(),
        missed: false
      };
      dispatch({ type: 'ADD_DAILY_TASK', payload: newTask });
    }
    setShowTaskForm(false);
  };

  const handleToggleComplete = (taskId: string) => {
    const task = dailyTasks.find(t => t.id === taskId);
    if (!task) return;

    dispatch({ type: 'TOGGLE_TASK_COMPLETION', payload: taskId });

    // Show toast notification for task completion
    if (!task.completed) {
      const pointsEarned = 10;
      
      // Check if this completes all tasks for the day
      const todayTasks = tasksForSelectedDate.filter(t => t.id !== taskId);
      const remainingIncomplete = todayTasks.filter(t => !t.completed);
      const isAllComplete = remainingIncomplete.length === 0;
      const bonusPoints = isAllComplete ? 20 : 0;

      setToastState({
        isVisible: true,
        taskName: task.name,
        pointsEarned,
        isAllComplete,
        bonusPoints
      });

      // If all tasks complete, mark all as complete for bonus
      if (isAllComplete) {
        setTimeout(() => {
          dispatch({ type: 'MARK_ALL_COMPLETE', payload: selectedDateString });
        }, 100);
      }
    }
  };

  const handleEditTask = (task: DailyTask) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      dispatch({ type: 'DELETE_DAILY_TASK', payload: taskId });
    }
  };

  const handleCancelForm = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  const handleMarkAllComplete = () => {
    const incompleteTasks = tasksForSelectedDate.filter(task => !task.completed);
    if (incompleteTasks.length === 0) {
      alert('All tasks are already completed!');
      return;
    }

    if (confirm(`Mark all ${incompleteTasks.length} remaining tasks as complete?`)) {
      dispatch({ type: 'MARK_ALL_COMPLETE', payload: selectedDateString });
      
      // Show celebration toast
      setToastState({
        isVisible: true,
        taskName: '',
        pointsEarned: incompleteTasks.length * 10,
        isAllComplete: true,
        bonusPoints: 20
      });
    }
  };

  const getMotivationalMessage = () => {
    const completionRate = stats.totalToday > 0 ? (stats.completedToday / stats.totalToday) * 100 : 0;
    
    if (completionRate === 100) {
      return { message: "🎉 Perfect day! All tasks completed!", color: "text-green-600 dark:text-green-400" };
    } else if (completionRate >= 80) {
      return { message: "🌟 Excellent progress! Almost there!", color: "text-blue-600 dark:text-blue-400" };
    } else if (completionRate >= 60) {
      return { message: "💪 Good work! Keep it up!", color: "text-indigo-600 dark:text-indigo-400" };
    } else if (completionRate >= 40) {
      return { message: "📈 Making progress! You've got this!", color: "text-yellow-600 dark:text-yellow-400" };
    } else if (completionRate > 0) {
      return { message: "🚀 Great start! Keep going!", color: "text-orange-600 dark:text-orange-400" };
    } else {
      return { message: "✨ Ready to tackle the day?", color: "text-gray-600 dark:text-gray-400" };
    }
  };

  const motivationalMessage = getMotivationalMessage();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Daily Planner</h1>
          <div className="flex items-center space-x-4">
            <p className="text-gray-600 dark:text-gray-400">
              {isToday(selectedDate) ? 'Today' : format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </p>
            {remindersActive && (
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-400 rounded-full">
                Reminders active
              </span>
            )}
          </div>
          {/* Motivational Message */}
          <p className={`text-sm font-medium mt-1 ${motivationalMessage.color}`}>
            {motivationalMessage.message}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Export Options */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowExportOptions(!showExportOptions)}
              className="flex items-center"
            >
              <Download size={16} className="mr-2" />
              Export
            </Button>
          </div>
          
          {/* Weekly Planning */}
          <Button
            variant="secondary"
            onClick={() => setShowWeeklyPlanning(true)}
            className="flex items-center"
          >
            <Target size={16} className="mr-2" />
            Plan Week
          </Button>
          
          {!showTaskForm && (
            <Button onClick={() => setShowTaskForm(true)}>
              <Plus size={16} className="mr-2" />
              Add Task
            </Button>
          )}
        </div>
      </div>

      {/* Export Options */}
      {showExportOptions && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Export Options</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowExportOptions(false)}
              >
                ×
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* PDF Export Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <FileText size={20} className="text-red-600" />
                  <h4 className="font-medium text-gray-900 dark:text-white">PDF Export</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Generate a formatted PDF document with your planner view, including tasks, stats, and completion status.
                </p>
                <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                  <li>• Professional formatting with visual task indicators</li>
                  <li>• Includes productivity statistics and completion rates</li>
                  <li>• Perfect for printing or sharing with others</li>
                  <li>• Optimized for A4 paper size</li>
                </ul>
              </div>

              {/* CSV Export Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Table size={20} className="text-green-600" />
                  <h4 className="font-medium text-gray-900 dark:text-white">CSV Export</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Export task data in CSV format for analysis in spreadsheet applications like Excel or Google Sheets.
                </p>
                <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                  <li>• Includes all task details and timestamps</li>
                  <li>• Compatible with Excel, Google Sheets, and other tools</li>
                  <li>• Perfect for data analysis and reporting</li>
                  <li>• Preserves all metadata and completion information</li>
                </ul>
              </div>
            </div>

            {/* Export Buttons */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <ExportButtons
                tasks={tasksForSelectedDate}
                selectedDate={selectedDate}
                stats={stats}
              />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Productivity Score */}
          <ProductivityScoreCard />

          {/* Notification Settings */}
          <NotificationSettings
            enabled={notificationsEnabled}
            onToggle={setNotificationsEnabled}
          />

          {/* Mini Calendar */}
          <MiniCalendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            tasksPerDay={tasksPerDay}
          />

          {/* Stats */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Target size={18} className="mr-2" />
                Daily Stats
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Today's Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Today</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {stats.completedToday}/{stats.totalToday}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: stats.totalToday > 0 ? `${(stats.completedToday / stats.totalToday) * 100}%` : '0%'
                    }}
                  />
                </div>
              </div>

              {/* This Week */}
              <div className="flex items-center justify-between py-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <CalendarIcon size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">This Week</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {stats.completedThisWeek} completed
                </span>
              </div>

              {/* Streak */}
              <div className="flex items-center justify-between py-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <Award size={16} className="text-orange-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Daily Streak</span>
                </div>
                <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                  {stats.streak} days
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Task Form */}
          {showTaskForm && (
            <TaskForm
              onSubmit={handleAddTask}
              onCancel={handleCancelForm}
              selectedDate={selectedDate}
              editingTask={editingTask}
            />
          )}

          {/* Controls */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <SortAsc size={16} className="text-gray-400" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="priority">Sort by Priority</option>
                      <option value="time">Sort by Time</option>
                      <option value="created">Sort by Created</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Filter size={16} className="text-gray-400" />
                    <select
                      value={filterBy}
                      onChange={(e) => setFilterBy(e.target.value as any)}
                      className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="all">All Tasks</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Mark All Complete Button */}
                  {tasksForSelectedDate.some(task => !task.completed) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleMarkAllComplete}
                      className="flex items-center"
                    >
                      <CheckSquare size={14} className="mr-2" />
                      Mark All Complete
                    </Button>
                  )}

                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {tasksForSelectedDate.length} task{tasksForSelectedDate.length !== 1 ? 's' : ''} for{' '}
                    {isToday(selectedDate) ? 'today' : format(selectedDate, 'MMM d')}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Task List */}
          <Card>
            <CardContent className="p-6">
              <TaskList
                tasks={tasksForSelectedDate}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                sortBy={sortBy}
                filterBy={filterBy}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Weekly Planning Modal */}
      <WeeklyPlanningModal
        isOpen={showWeeklyPlanning}
        onClose={() => setShowWeeklyPlanning(false)}
        selectedDate={selectedDate}
      />

      {/* Task Completion Toast */}
      <TaskCompletionToast
        isVisible={toastState.isVisible}
        taskName={toastState.taskName}
        pointsEarned={toastState.pointsEarned}
        isAllComplete={toastState.isAllComplete}
        bonusPoints={toastState.bonusPoints}
        onClose={() => setToastState(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
};

export default DailyPlanner;
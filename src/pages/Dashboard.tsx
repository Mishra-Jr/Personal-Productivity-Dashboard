import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, FolderOpen, StickyNote, Image, Clock, Zap, Calendar, PlusCircle, Upload, Filter, MessageSquare, Tag, Eye, ExternalLink, Github, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import StatCard from '../components/ui/StatCard';
import { useApp } from '../contexts/AppContext';
import { useProductivityStats } from '../hooks/useProductivityStats';

const Dashboard: React.FC = () => {
  const { state } = useApp();
  const { projects, notes, dailyTasks, media } = state;
  
  const stats = useProductivityStats(dailyTasks, projects.length, media.length);
  const [activityFilter, setActivityFilter] = useState<'All' | 'Projects' | 'Notes' | 'Media'>('All');
  const [thoughtVisible, setThoughtVisible] = useState(true);

  const quotes = [
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Innovation distinguishes between a leader and a follower. - Steve Jobs",
    "Code is like humor. When you have to explain it, it's bad. - Cory House",
    "First, solve the problem. Then, write the code. - John Johnson",
    "The best error message is the one that never shows up. - Thomas Fuchs",
    "Simplicity is the ultimate sophistication. - Leonardo da Vinci",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand. - Martin Fowler"
  ];

  const [currentQuote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);

  const refreshThought = () => {
    setThoughtVisible(false);
    setTimeout(() => {
      setThoughtVisible(true);
    }, 300);
  };

  // Quick actions with enhanced styling
  const quickActions = [
    {
      to: '/planner',
      icon: Calendar,
      label: 'Plan My Day',
      description: 'Organize tasks and set priorities',
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700',
      iconBg: 'bg-blue-100 dark:bg-blue-900/50',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      to: '/projects',
      icon: FolderOpen,
      label: 'View Projects',
      description: 'Browse your development portfolio',
      color: 'from-indigo-500 to-indigo-600',
      hoverColor: 'hover:from-indigo-600 hover:to-indigo-700',
      iconBg: 'bg-indigo-100 dark:bg-indigo-900/50',
      iconColor: 'text-indigo-600 dark:text-indigo-400'
    },
    {
      to: '/notes',
      icon: PlusCircle,
      label: 'Create Note',
      description: 'Capture ideas and insights',
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700',
      iconBg: 'bg-purple-100 dark:bg-purple-900/50',
      iconColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      to: '/media',
      icon: Upload,
      label: 'Upload Media',
      description: 'Add images and videos',
      color: 'from-emerald-500 to-emerald-600',
      hoverColor: 'hover:from-emerald-600 hover:to-emerald-700',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/50',
      iconColor: 'text-emerald-600 dark:text-emerald-400'
    }
  ];

  // Create unified activity feed
  const activityFeed = useMemo(() => {
    const activities: Array<{
      id: string;
      type: 'project' | 'note' | 'media';
      title: string;
      description: string;
      timestamp: Date;
      status?: string;
      tags?: string[];
      links?: { github?: string; demo?: string };
      projectId?: string;
      mediaType?: 'image' | 'video';
    }> = [];

    // Add projects
    projects.forEach(project => {
      activities.push({
        id: project.id,
        type: 'project',
        title: project.name,
        description: project.description,
        timestamp: project.createdAt,
        status: project.status,
        links: project.links
      });
    });

    // Add notes
    notes.forEach(note => {
      activities.push({
        id: note.id,
        type: 'note',
        title: note.title,
        description: note.content,
        timestamp: note.updatedAt,
        tags: note.tags
      });
    });

    // Add media
    media.forEach(item => {
      activities.push({
        id: item.id,
        type: 'media',
        title: item.name,
        description: `${item.type === 'image' ? 'Image' : 'Video'} uploaded${item.projectId ? ' to project' : ''}`,
        timestamp: item.uploadedAt,
        projectId: item.projectId,
        mediaType: item.type
      });
    });

    // Sort by timestamp (most recent first)
    return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [projects, notes, media]);

  // Filter activities
  const filteredActivities = useMemo(() => {
    if (activityFilter === 'All') return activityFeed;
    return activityFeed.filter(activity => {
      switch (activityFilter) {
        case 'Projects':
          return activity.type === 'project';
        case 'Notes':
          return activity.type === 'note';
        case 'Media':
          return activity.type === 'media';
        default:
          return true;
      }
    });
  }, [activityFeed, activityFilter]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'project':
        return FolderOpen;
      case 'note':
        return StickyNote;
      case 'media':
        return Image;
      default:
        return Clock;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'project':
        return {
          bg: 'bg-indigo-100 dark:bg-indigo-900/50',
          icon: 'text-indigo-600 dark:text-indigo-400',
          border: 'border-indigo-200 dark:border-indigo-800',
          gradient: 'from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-900/40'
        };
      case 'note':
        return {
          bg: 'bg-purple-100 dark:bg-purple-900/50',
          icon: 'text-purple-600 dark:text-purple-400',
          border: 'border-purple-200 dark:border-purple-800',
          gradient: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/40'
        };
      case 'media':
        return {
          bg: 'bg-emerald-100 dark:bg-emerald-900/50',
          icon: 'text-emerald-600 dark:text-emerald-400',
          border: 'border-emerald-200 dark:border-emerald-800',
          gradient: 'from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/40'
        };
      default:
        return {
          bg: 'bg-gray-100 dark:bg-gray-700',
          icon: 'text-gray-600 dark:text-gray-400',
          border: 'border-gray-200 dark:border-gray-700',
          gradient: 'from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700'
        };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-400';
      case 'Completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400';
      case 'On Hold':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300';
    }
  };

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'Idea':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400';
      case 'Task':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400';
      case 'Journal':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-400';
      case 'Reflection':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
      return diffInMinutes < 1 ? 'Just now' : `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 168) { // 7 days
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    } else {
      return timestamp.toLocaleDateString();
    }
  };

  return (
    <div className="space-y-8 fade-in">
      {/* Enhanced Welcome Section with Canvas Animation */}
      <div className="hero-gradient rounded-2xl p-8 text-white relative overflow-hidden">
        {/* Floating Elements */}
        <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full floating" style={{ animationDelay: '0s' }} />
        <div className="absolute bottom-8 left-8 w-12 h-12 bg-white/5 rounded-full floating" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/4 w-8 h-8 bg-white/10 rounded-full floating" style={{ animationDelay: '2s' }} />
        
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-4">
            {/* Enhanced Avatar */}
            <div className="relative group">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30 shadow-lg transition-transform duration-300 group-hover:scale-110">
                <span className="text-2xl font-bold text-white">AM</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white pulse-soft" />
            </div>
            
            <div>
              <h1 className="text-3xl font-bold mb-1">Welcome back, Aniket! 👋</h1>
              <p className="text-xl text-indigo-100 font-medium">Senior Robotics Engineer & Full Stack Developer</p>
            </div>
          </div>
          
          <p className="text-indigo-100 mb-6">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium flex items-center">
                <Sparkles size={16} className="mr-2 text-yellow-300" />
                Thought of the Day
              </h3>
              <button
                onClick={refreshThought}
                className="p-1 hover:bg-white/10 rounded transition-colors icon-hover"
                title="New thought"
              >
                <Clock size={14} className="text-indigo-200" />
              </button>
            </div>
            <p className={`text-sm text-indigo-100 italic transition-all duration-300 ${
              thoughtVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-2'
            }`}>
              "{currentQuote}"
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="slide-up" style={{ animationDelay: '0.1s' }}>
          <StatCard
            title="Tasks Completed"
            value={stats.tasksCompleted}
            icon={TrendingUp}
            color="emerald"
            suffix="this month"
            tooltip="Total tasks completed this month. Includes all tasks marked as done in your daily planner."
            trend={{
              value: stats.trends.tasksCompletedTrend,
              isPositive: stats.trends.tasksCompletedTrend >= 0,
              label: "vs last month"
            }}
          />
        </div>

        <div className="slide-up" style={{ animationDelay: '0.2s' }}>
          <StatCard
            title="Active Projects"
            value={stats.projectCount}
            icon={FolderOpen}
            color="indigo"
            tooltip="Total number of projects in your portfolio. Includes active, completed, and on-hold projects."
            trend={{
              value: stats.trends.projectsTrend,
              isPositive: stats.trends.projectsTrend >= 0,
              label: "growth rate"
            }}
          />
        </div>

        <div className="slide-up" style={{ animationDelay: '0.3s' }}>
          <StatCard
            title="Notes Created"
            value={notes.length}
            icon={StickyNote}
            color="purple"
            tooltip="Total notes in your knowledge base. Includes ideas, tasks, journal entries, and reflections."
          />
        </div>

        <div className="slide-up" style={{ animationDelay: '0.4s' }}>
          <StatCard
            title="Productive Streak"
            value={stats.streak}
            icon={Zap}
            color="yellow"
            suffix={stats.streak === 1 ? "day" : "days"}
            tooltip="Consecutive days with at least one completed task. Keep the momentum going!"
            trend={{
              value: stats.trends.streakTrend,
              isPositive: stats.trends.streakTrend >= 0,
              label: "vs last period"
            }}
          />
        </div>
      </div>

      {/* Quick Actions and Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enhanced Quick Actions */}
        <div className="scale-in" style={{ animationDelay: '0.5s' }}>
          <Card elevation="medium">
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Jump into your most common tasks</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => (
                <Link key={action.to} to={action.to} className="block group">
                  <div className={`
                    relative overflow-hidden rounded-xl p-4 
                    bg-gradient-to-r ${action.color} ${action.hoverColor}
                    transform transition-all duration-300 
                    hover:scale-105 hover:shadow-lg
                    group-hover:-translate-y-1
                  `} style={{ animationDelay: `${0.6 + index * 0.1}s` }}>
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`
                          w-10 h-10 ${action.iconBg} rounded-lg 
                          flex items-center justify-center
                          group-hover:scale-110 transition-transform duration-300
                          shadow-sm
                        `}>
                          <action.icon size={20} className={`${action.iconColor} icon-hover`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white text-sm">
                            {action.label}
                          </h4>
                          <p className="text-xs text-white/80">
                            {action.description}
                          </p>
                        </div>
                      </div>
                      <ArrowRight 
                        size={16} 
                        className="text-white/80 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" 
                      />
                    </div>
                    
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Activity Feed */}
        <div className="lg:col-span-2 scale-in" style={{ animationDelay: '0.6s' }}>
          <Card elevation="medium">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Activity Feed</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Recent projects, notes, and media</p>
                </div>
                
                {/* Enhanced Filter Buttons */}
                <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 shadow-inner">
                  {(['All', 'Projects', 'Notes', 'Media'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActivityFilter(filter)}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                        activityFilter === filter
                          ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm transform scale-105'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50 hover:scale-105'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredActivities.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredActivities.slice(0, 8).map((activity, index) => {
                    const ActivityIcon = getActivityIcon(activity.type);
                    const colors = getActivityColor(activity.type);
                    
                    return (
                      <div
                        key={activity.id}
                        className={`
                          flex items-start space-x-4 p-4 rounded-lg border ${colors.border} 
                          bg-gradient-to-r ${colors.gradient}
                          hover:shadow-md transition-all duration-300 group
                          transform hover:-translate-y-1
                        `}
                        style={{ animationDelay: `${0.7 + index * 0.05}s` }}
                      >
                        {/* Enhanced Icon */}
                        <div className={`flex-shrink-0 w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-sm`}>
                          <ActivityIcon size={20} className={`${colors.icon} icon-hover`} />
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {activity.title}
                              </h4>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                {activity.description}
                              </p>
                              
                              {/* Enhanced Metadata */}
                              <div className="flex items-center space-x-4 mt-2">
                                {/* Timestamp */}
                                <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                                  <Clock size={12} className="icon-hover" />
                                  <span>{formatTimestamp(activity.timestamp)}</span>
                                </div>
                                
                                {/* Status for projects */}
                                {activity.status && (
                                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(activity.status)} transition-transform hover:scale-105`}>
                                    {activity.status}
                                  </span>
                                )}
                                
                                {/* Tags for notes */}
                                {activity.tags && activity.tags.length > 0 && (
                                  <div className="flex items-center space-x-1">
                                    {activity.tags.slice(0, 2).map((tag) => (
                                      <span
                                        key={tag}
                                        className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${getTagColor(tag)} transition-transform hover:scale-105`}
                                      >
                                        <Tag size={8} className="mr-1 icon-hover" />
                                        {tag}
                                      </span>
                                    ))}
                                    {activity.tags.length > 2 && (
                                      <span className="text-xs text-gray-500 dark:text-gray-400">
                                        +{activity.tags.length - 2}
                                      </span>
                                    )}
                                  </div>
                                )}
                                
                                {/* Media type indicator */}
                                {activity.type === 'media' && activity.mediaType && (
                                  <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                    {activity.mediaType}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            {/* Enhanced Action buttons */}
                            <div className="flex items-center space-x-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              {activity.type === 'project' && activity.links && (
                                <>
                                  {activity.links.github && (
                                    <a
                                      href={activity.links.github}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-200 hover:scale-110"
                                      title="View GitHub"
                                    >
                                      <Github size={14} />
                                    </a>
                                  )}
                                  {activity.links.demo && (
                                    <a
                                      href={activity.links.demo}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-200 hover:scale-110"
                                      title="View Demo"
                                    >
                                      <ExternalLink size={14} />
                                    </a>
                                  )}
                                </>
                              )}
                              <Link
                                to={activity.type === 'project' ? '/projects' : activity.type === 'note' ? '/notes' : '/media'}
                                className="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 hover:scale-110"
                                title="View details"
                              >
                                <Eye size={14} />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Enhanced View All Button */}
                  {filteredActivities.length > 8 && (
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <Button variant="ghost" size="sm" className="w-full group">
                        <span>View All Activity</span>
                        <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform icon-hover" />
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Filter size={32} className="mx-auto text-gray-400 mb-2 icon-hover" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {activityFilter === 'All' 
                      ? 'No activity yet. Start by creating a project or note!'
                      : `No ${activityFilter.toLowerCase()} found`
                    }
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
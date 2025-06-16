import React, { useState } from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { Card, CardContent } from './Card';
import AnimatedCounter from './AnimatedCounter';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: 'emerald' | 'indigo' | 'purple' | 'orange' | 'blue' | 'yellow';
  tooltip?: string;
  suffix?: string;
  trend?: {
    value: number;
    isPositive: boolean;
    label: string;
  };
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  tooltip,
  suffix = '',
  trend,
  className = ""
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const colorClasses = {
    emerald: {
      bg: 'bg-emerald-100 dark:bg-emerald-900/50',
      icon: 'text-emerald-600 dark:text-emerald-400',
      trend: 'text-emerald-600 dark:text-emerald-400',
      gradient: 'from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/40'
    },
    indigo: {
      bg: 'bg-indigo-100 dark:bg-indigo-900/50',
      icon: 'text-indigo-600 dark:text-indigo-400',
      trend: 'text-indigo-600 dark:text-indigo-400',
      gradient: 'from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-900/40'
    },
    purple: {
      bg: 'bg-purple-100 dark:bg-purple-900/50',
      icon: 'text-purple-600 dark:text-purple-400',
      trend: 'text-purple-600 dark:text-purple-400',
      gradient: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/40'
    },
    orange: {
      bg: 'bg-orange-100 dark:bg-orange-900/50',
      icon: 'text-orange-600 dark:text-orange-400',
      trend: 'text-orange-600 dark:text-orange-400',
      gradient: 'from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/40'
    },
    blue: {
      bg: 'bg-blue-100 dark:bg-blue-900/50',
      icon: 'text-blue-600 dark:text-blue-400',
      trend: 'text-blue-600 dark:text-blue-400',
      gradient: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/40'
    },
    yellow: {
      bg: 'bg-yellow-100 dark:bg-yellow-900/50',
      icon: 'text-yellow-600 dark:text-yellow-400',
      trend: 'text-yellow-600 dark:text-yellow-400',
      gradient: 'from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-900/40'
    }
  };

  const colors = colorClasses[color];

  return (
    <div className={`relative ${className}`}>
      <Card 
        className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group overflow-hidden"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        elevation="medium"
      >
        {/* Gradient Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
        
        <CardContent className="flex items-center p-6 relative z-10">
          <div className="flex-shrink-0">
            <div className={`
              w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center 
              group-hover:scale-110 transition-all duration-300 shadow-sm
              group-hover:shadow-md group-hover:rotate-3
            `}>
              <Icon size={24} className={`${colors.icon} group-hover:scale-110 transition-transform duration-300`} />
            </div>
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
              {title}
            </p>
            <div className="flex items-baseline space-x-2">
              <AnimatedCounter 
                value={value} 
                className="text-2xl font-bold text-gray-900 dark:text-white group-hover:scale-105 transition-transform duration-300"
              />
              {suffix && (
                <span className="text-lg font-semibold text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                  {suffix}
                </span>
              )}
            </div>
            {trend && (
              <div className={`flex items-center mt-1 text-sm transition-all duration-300 ${
                trend.isPositive ? colors.trend : 'text-red-600 dark:text-red-400'
              } group-hover:scale-105`}>
                <span className="font-medium">
                  {trend.isPositive ? '+' : ''}{trend.value}
                </span>
                <span className="ml-1 text-gray-500 dark:text-gray-400">
                  {trend.label}
                </span>
              </div>
            )}
          </div>
        </CardContent>

        {/* Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      </Card>

      {/* Enhanced Tooltip */}
      {tooltip && showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg px-4 py-3 shadow-xl max-w-xs border border-gray-700 dark:border-gray-600">
            <div className="text-center font-medium">{tooltip}</div>
            {/* Enhanced Arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2">
              <div className="border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatCard;
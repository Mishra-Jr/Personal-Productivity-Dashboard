import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Award, Target, History, Info } from 'lucide-react';
import { Card, CardHeader, CardContent } from './Card';
import AnimatedCounter from './AnimatedCounter';
import { useApp } from '../../contexts/AppContext';

interface ProductivityScoreCardProps {
  className?: string;
}

const ProductivityScoreCard: React.FC<ProductivityScoreCardProps> = ({ className = "" }) => {
  const { state } = useApp();
  const { productivityScore } = state;
  const [showHistory, setShowHistory] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 800) return 'text-green-600 dark:text-green-400';
    if (score >= 600) return 'text-yellow-600 dark:text-yellow-400';
    if (score >= 400) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 800) return 'from-green-500 to-emerald-500';
    if (score >= 600) return 'from-yellow-500 to-orange-500';
    if (score >= 400) return 'from-orange-500 to-red-500';
    return 'from-red-500 to-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 800) return 'Excellent';
    if (score >= 600) return 'Good';
    if (score >= 400) return 'Fair';
    return 'Needs Improvement';
  };

  const getRecentTrend = () => {
    const recentEntries = productivityScore.history.slice(-5);
    const totalChange = recentEntries.reduce((sum, entry) => sum + entry.change, 0);
    return totalChange;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateStr === today.toISOString().split('T')[0]) return 'Today';
    if (dateStr === yesterday.toISOString().split('T')[0]) return 'Yesterday';
    return date.toLocaleDateString();
  };

  // Helper function to safely extract gradient colors
  const getGradientColors = (score: number) => {
    const gradientString = getScoreGradient(score);
    const parts = gradientString.split(' ');
    
    // Safely extract the colors with fallbacks
    const fromColor = parts[0]?.replace('from-', '') || 'green-500';
    const toColor = parts[1]?.replace('to-', '') || 'emerald-500';
    
    return { fromColor, toColor };
  };

  const recentTrend = getRecentTrend();
  const scorePercentage = (productivityScore.totalScore / 1000) * 100;
  const { fromColor, toColor } = getGradientColors(productivityScore.totalScore);

  return (
    <Card className={`hover:shadow-lg transition-all duration-300 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <Award size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Productivity Score</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Out of 1000 points</p>
            </div>
          </div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="View history"
          >
            <History size={16} className="text-gray-400" />
          </button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Score Display */}
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-4">
            {/* Background Circle */}
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-200 dark:text-gray-700"
              />
              {/* Progress Circle */}
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="url(#scoreGradient)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${scorePercentage * 3.14} 314`}
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" className={`text-${fromColor}`} />
                  <stop offset="100%" className={`text-${toColor}`} />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Score Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <AnimatedCounter 
                value={productivityScore.totalScore} 
                className={`text-2xl font-bold ${getScoreColor(productivityScore.totalScore)}`}
              />
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                {getScoreLabel(productivityScore.totalScore)}
              </span>
            </div>
          </div>

          {/* Trend Indicator */}
          <div className="flex items-center justify-center space-x-2">
            {recentTrend > 0 ? (
              <TrendingUp size={16} className="text-green-600 dark:text-green-400" />
            ) : recentTrend < 0 ? (
              <TrendingDown size={16} className="text-red-600 dark:text-red-400" />
            ) : (
              <Target size={16} className="text-gray-400" />
            )}
            <span className={`text-sm font-medium ${
              recentTrend > 0 ? 'text-green-600 dark:text-green-400' : 
              recentTrend < 0 ? 'text-red-600 dark:text-red-400' : 
              'text-gray-600 dark:text-gray-400'
            }`}>
              {recentTrend > 0 ? '+' : ''}{recentTrend} recent trend
            </span>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Task Completion</p>
            <p className="font-semibold text-gray-900 dark:text-white">+10 pts each</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Missed Task</p>
            <p className="font-semibold text-gray-900 dark:text-white">-5 pts each</p>
          </div>
        </div>

        {/* History */}
        {showHistory && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
              <History size={16} className="mr-2" />
              Recent Activity
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {productivityScore.history.slice(-10).reverse().map((entry, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex-1">
                    <span className="text-gray-700 dark:text-gray-300">{entry.reason}</span>
                    <span className="text-gray-500 dark:text-gray-400 ml-2">
                      • {formatDate(entry.date)}
                    </span>
                  </div>
                  <span className={`font-medium ${
                    entry.change > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {entry.change > 0 ? '+' : ''}{entry.change}
                  </span>
                </div>
              ))}
              {productivityScore.history.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  No activity yet. Complete tasks to start earning points!
                </p>
              )}
            </div>
          </div>
        )}

        {/* Info */}
        <div className="flex items-start space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Info size={14} className="text-blue-600 dark:text-blue-400 mt-0.5" />
          <div className="text-xs text-blue-700 dark:text-blue-300">
            <p className="font-medium mb-1">How scoring works:</p>
            <p>Complete tasks to earn points, miss tasks to lose points. Completing all daily tasks gives a bonus!</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductivityScoreCard;
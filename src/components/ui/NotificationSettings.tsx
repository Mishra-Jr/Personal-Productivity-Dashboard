import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Settings, Check, X, AlertCircle } from 'lucide-react';
import Button from './Button';
import { Card, CardContent } from './Card';
import { useNotifications } from '../../hooks/useNotifications';

interface NotificationSettingsProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  className?: string;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ 
  enabled, 
  onToggle, 
  className = "" 
}) => {
  const { permission, requestPermission, isSupported } = useNotifications();
  const [isRequesting, setIsRequesting] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleToggleNotifications = async () => {
    if (!enabled) {
      // Enabling notifications - request permission if needed
      if (permission !== 'granted') {
        setIsRequesting(true);
        const newPermission = await requestPermission();
        setIsRequesting(false);
        
        if (newPermission === 'granted') {
          onToggle(true);
        } else {
          // Show explanation if permission denied
          setShowDetails(true);
        }
      } else {
        onToggle(true);
      }
    } else {
      // Disabling notifications
      onToggle(false);
    }
  };

  const getStatusColor = () => {
    if (!isSupported) return 'text-gray-500';
    if (enabled && permission === 'granted') return 'text-green-600 dark:text-green-400';
    if (permission === 'denied') return 'text-red-600 dark:text-red-400';
    return 'text-yellow-600 dark:text-yellow-400';
  };

  const getStatusText = () => {
    if (!isSupported) return 'Not supported in this browser';
    if (enabled && permission === 'granted') return 'Notifications enabled';
    if (permission === 'denied') return 'Notifications blocked';
    if (permission === 'default') return 'Permission not requested';
    return 'Notifications disabled';
  };

  const getStatusIcon = () => {
    if (!isSupported) return <BellOff size={16} />;
    if (enabled && permission === 'granted') return <Bell size={16} />;
    if (permission === 'denied') return <BellOff size={16} />;
    return <Bell size={16} />;
  };

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`${getStatusColor()}`}>
                {getStatusIcon()}
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Task Reminders</h3>
                <p className={`text-sm ${getStatusColor()}`}>
                  {getStatusText()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                title="Settings"
              >
                <Settings size={16} />
              </button>
              
              {isSupported && (
                <Button
                  variant={enabled ? "primary" : "outline"}
                  size="sm"
                  onClick={handleToggleNotifications}
                  disabled={isRequesting}
                >
                  {isRequesting ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : enabled ? (
                    <Check size={14} />
                  ) : (
                    <Bell size={14} />
                  )}
                  <span className="ml-2">
                    {isRequesting ? 'Requesting...' : enabled ? 'Enabled' : 'Enable'}
                  </span>
                </Button>
              )}
            </div>
          </div>

          {/* Details */}
          {showDetails && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">How it works:</h4>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Set due times for your tasks</li>
                  <li>Get browser notifications when tasks are due</li>
                  <li>Reminders check every minute for accuracy</li>
                  <li>Notifications persist until dismissed</li>
                </ul>
              </div>

              {!isSupported && (
                <div className="flex items-start space-x-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <AlertCircle size={16} className="text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-yellow-800 dark:text-yellow-300">
                      Browser not supported
                    </p>
                    <p className="text-yellow-700 dark:text-yellow-400">
                      Your browser doesn't support notifications. Task reminders will use alert dialogs instead.
                    </p>
                  </div>
                </div>
              )}

              {permission === 'denied' && (
                <div className="flex items-start space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <AlertCircle size={16} className="text-red-600 dark:text-red-400 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-red-800 dark:text-red-300">
                      Notifications blocked
                    </p>
                    <p className="text-red-700 dark:text-red-400">
                      To enable notifications, click the notification icon in your browser's address bar and allow notifications for this site.
                    </p>
                  </div>
                </div>
              )}

              {enabled && permission === 'granted' && (
                <div className="flex items-start space-x-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <Check size={16} className="text-green-600 dark:text-green-400 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-green-800 dark:text-green-300">
                      Notifications active
                    </p>
                    <p className="text-green-700 dark:text-green-400">
                      You'll receive reminders for tasks with due times. Make sure your browser allows notifications from this site.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
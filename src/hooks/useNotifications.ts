import { useEffect, useRef, useCallback } from 'react';

interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
}

export const useNotifications = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const permissionRef = useRef<NotificationPermission>('default');

  // Request notification permission
  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      permissionRef.current = 'granted';
      return 'granted';
    }

    if (Notification.permission === 'denied') {
      permissionRef.current = 'denied';
      return 'denied';
    }

    try {
      const permission = await Notification.requestPermission();
      permissionRef.current = permission;
      return permission;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      permissionRef.current = 'denied';
      return 'denied';
    }
  }, []);

  // Show notification
  const showNotification = useCallback((options: NotificationOptions) => {
    if (!('Notification' in window)) {
      // Fallback to alert if notifications not supported
      alert(`Reminder: ${options.title}\n${options.body}`);
      return;
    }

    if (Notification.permission === 'granted') {
      try {
        const notification = new Notification(options.title, {
          body: options.body,
          icon: options.icon || '/vite.svg',
          tag: options.tag,
          requireInteraction: true,
          silent: false
        });

        // Auto-close after 10 seconds
        setTimeout(() => {
          notification.close();
        }, 10000);

        return notification;
      } catch (error) {
        console.error('Error showing notification:', error);
        // Fallback to alert
        alert(`Reminder: ${options.title}\n${options.body}`);
      }
    } else {
      // Fallback to alert if permission denied
      alert(`Reminder: ${options.title}\n${options.body}`);
    }
  }, []);

  // Initialize permission state
  useEffect(() => {
    if ('Notification' in window) {
      permissionRef.current = Notification.permission;
    }
  }, []);

  return {
    permission: permissionRef.current,
    requestPermission,
    showNotification,
    isSupported: 'Notification' in window
  };
};
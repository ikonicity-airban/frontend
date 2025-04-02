import React, { useCallback, useState, createContext, useContext } from 'react';
import Notification from '../components/common/Notification';
type NotificationType = 'success' | 'error' | 'warning' | 'info';
interface NotificationItem {
  id: string;
  type: NotificationType;
  message: string;
}
interface NotificationContextType {
  notifications: NotificationItem[];
  showNotification: (type: NotificationType, message: string) => void;
  removeNotification: (id: string) => void;
}
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
export const NotificationProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const showNotification = useCallback((type: NotificationType, message: string) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, {
      id,
      type,
      message
    }]);
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  }, []);
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);
  return <NotificationContext.Provider value={{
    notifications,
    showNotification,
    removeNotification
  }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {notifications.map(notification => <Notification key={notification.id} type={notification.type} message={notification.message} onClose={() => removeNotification(notification.id)} />)}
      </div>
    </NotificationContext.Provider>;
};
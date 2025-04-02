import React, { useEffect, useState } from 'react';
import { AlertCircleIcon, CheckCircleIcon, XCircleIcon, XIcon } from 'lucide-react';
type NotificationType = 'success' | 'error' | 'warning' | 'info';
interface NotificationProps {
  type: NotificationType;
  message: string;
  duration?: number;
  onClose?: () => void;
}
const Notification: React.FC<NotificationProps> = ({
  type,
  message,
  duration = 5000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);
  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };
  if (!isVisible) return null;
  const getNotificationStyles = () => {
    switch (type) {
      case 'success':
        return {
          bgColor: 'bg-green-50',
          textColor: 'text-green-800',
          iconColor: 'text-green-400',
          icon: <CheckCircleIcon className="h-5 w-5" />
        };
      case 'error':
        return {
          bgColor: 'bg-red-50',
          textColor: 'text-red-800',
          iconColor: 'text-red-400',
          icon: <XCircleIcon className="h-5 w-5" />
        };
      case 'warning':
        return {
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-800',
          iconColor: 'text-yellow-400',
          icon: <AlertCircleIcon className="h-5 w-5" />
        };
      case 'info':
        return {
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-800',
          iconColor: 'text-blue-400',
          icon: <AlertCircleIcon className="h-5 w-5" />
        };
    }
  };
  const styles = getNotificationStyles();
  return <div className={`rounded-md p-4 ${styles.bgColor}`}>
      <div className="flex">
        <div className={`flex-shrink-0 ${styles.iconColor}`}>{styles.icon}</div>
        <div className="ml-3">
          <p className={`text-sm font-medium ${styles.textColor}`}>{message}</p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button onClick={handleClose} className={`inline-flex rounded-md p-1.5 ${styles.bgColor} ${styles.textColor} hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600`}>
              <span className="sr-only">Dismiss</span>
              <XIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>;
};
export default Notification;
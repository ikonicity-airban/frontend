// src/hooks/useEmailNotification.ts
import { useMutation } from '@tanstack/react-query';
import { 
  sendNotificationEmail, 
  sendEvaluationNotification, 
  processBackendNotifications,
  NotificationData,
  EvaluationNotification
} from '../api/email';
import { useNotification } from '../context/NotificationContext';

export const useEmailNotification = () => {
  const { showNotification } = useNotification();

  const sendEmailMutation = useMutation({
    mutationFn: (data: NotificationData) => sendNotificationEmail(data),
    onSuccess: () => {
      showNotification('success', 'Notification email sent successfully');
    },
    onError: (error: any) => {
      showNotification('error', `Failed to send notification email: ${error.message}`);
    }
  });

  const sendEvaluationEmailMutation = useMutation({
    mutationFn: (data: EvaluationNotification) => sendEvaluationNotification(data),
    onSuccess: () => {
      showNotification('success', 'Evaluation notification email sent successfully');
    },
    onError: (error: any) => {
      showNotification('error', `Failed to send evaluation notification: ${error.message}`);
    }
  });

  const processBackendNotificationsMutation = useMutation({
    mutationFn: (notificationResponse: any) => processBackendNotifications(notificationResponse),
    onSuccess: () => {
      showNotification('success', 'All notification emails processed successfully');
    },
    onError: (error: any) => {
      showNotification('error', `Failed to process notification emails: ${error.message}`);
    }
  });

  return {
    sendEmail: sendEmailMutation.mutate,
    sendEmailAsync: sendEmailMutation.mutateAsync,
    isSendingEmail: sendEmailMutation.isPending,
    
    sendEvaluationEmail: sendEvaluationEmailMutation.mutate,
    sendEvaluationEmailAsync: sendEvaluationEmailMutation.mutateAsync,
    isSendingEvaluationEmail: sendEvaluationEmailMutation.isPending,
    
    processBackendNotifications: processBackendNotificationsMutation.mutate,
    processBackendNotificationsAsync: processBackendNotificationsMutation.mutateAsync,
    isProcessingNotifications: processBackendNotificationsMutation.isPending
  };
};

export default useEmailNotification;

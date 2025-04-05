// src/api/notifications/emailHandler.ts
import { apiRequest } from '../axios';
import { processBackendNotifications } from '../email';

/**
 * Fetch notifications from the backend and process them for email sending
 * @param userId Optional user ID to filter notifications
 * @returns Promise resolving to the result of email processing
 */
export const fetchAndProcessNotifications = async (userId?: string) => {
  try {
    // Fetch notifications from the backend
    const endpoint = userId 
      ? `/notifications/user/${userId}` 
      : '/notifications/pending';
    
    const notificationsResponse = await apiRequest<any>({
      url: endpoint,
      method: 'GET'
    });
    
    // Process the notifications and send emails
    const emailResult = await processBackendNotifications(notificationsResponse);
    
    // If emails were sent successfully, mark notifications as processed
    if (emailResult && notificationsResponse.notifications?.length > 0) {
      const notificationIds = notificationsResponse.notifications.map(
        (notification: any) => notification.id
      );
      
      await apiRequest({
        url: '/notifications/mark-processed',
        method: 'POST',
        data: { notificationIds }
      });
    }
    
    return {
      success: true,
      emailsSent: notificationsResponse.notifications?.length || 0,
      result: emailResult
    };
  } catch (error) {
    console.error('Error processing notifications for email:', error);
    return {
      success: false,
      error
    };
  }
};

/**
 * Send a manual notification email based on evaluation status change
 * @param evaluationId The ID of the evaluation
 * @param status The new status of the evaluation
 * @returns Promise resolving to the notification and email sending result
 */
export const sendEvaluationStatusNotification = async (evaluationId: string, status: string) => {
  try {
    // Request the backend to create a notification
    const notificationResponse = await apiRequest<any>({
      url: '/notifications/evaluation-status',
      method: 'POST',
      data: {
        evaluationId,
        status
      }
    });
    
    // Process the notification response to send emails
    const emailResult = await processBackendNotifications(notificationResponse);
    
    return {
      success: true,
      notification: notificationResponse,
      emailResult
    };
  } catch (error) {
    console.error('Error sending evaluation status notification:', error);
    return {
      success: false,
      error
    };
  }
};

export default {
  fetchAndProcessNotifications,
  sendEvaluationStatusNotification
};

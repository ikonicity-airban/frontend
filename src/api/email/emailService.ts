// src/api/email/emailService.ts
import { init, send } from 'emailjs-com';

// Types for notification data
export interface NotificationData {
  to_email: string;
  to_name: string;
  subject: string;
  message: string;
  from_name?: string;
}

// Types for evaluation notification
export interface EvaluationNotification {
  recipientEmail: string;
  recipientName: string;
  evaluationId: string;
  evaluationPeriod: string;
  status: string;
  message?: string;
}

// Interface for backend notification
export interface BackendNotification {
  id: string;
  type: string;
  recipient: {
    email: string;
    name: string;
  };
  data: Record<string, any>;
}

// Initialize EmailJS with user ID
const initEmailJS = () => {
  const userId = (import.meta as any).env.VITE_EMAILJS_USER_ID;
  if (!userId) {
    console.error('EmailJS User ID is not defined in environment variables');
    return false;
  }
  
  try {
    init(userId);
    return true;
  } catch (error) {
    console.error('Failed to initialize EmailJS:', error);
    return false;
  }
};

/**
 * Send a general notification email
 * @param data Notification data including recipient, subject, and message
 * @returns Promise resolving to the EmailJS response
 */
export const sendNotificationEmail = async (data: NotificationData) => {
  if (!initEmailJS()) {
    throw new Error('EmailJS not initialized');
  }

  const serviceId = (import.meta as any).env.VITE_EMAILJS_SERVICE_ID;
  const templateId = (import.meta as any).env.VITE_EMAILJS_TEMPLATE_ID;

  if (!serviceId || !templateId) {
    throw new Error('EmailJS service ID or template ID is not defined');
  }

  const templateParams = {
    to_email: data.to_email,
    to_name: data.to_name,
    subject: data.subject,
    message: data.message,
    from_name: data.from_name || 'Review Notification System'
  };

  try {
    const response = await send(serviceId, templateId, templateParams);
    console.log('Email sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};

/**
 * Send an evaluation notification email
 * @param data Evaluation notification data
 * @returns Promise resolving to the EmailJS response
 */
export const sendEvaluationNotification = async (data: EvaluationNotification) => {
  // Format the message based on the evaluation status
  let subject = '';
  let message = '';

  switch (data.status) {
    case 'PENDING_STAFF':
      subject = `New Evaluation for ${data.evaluationPeriod}`;
      message = `You have a new evaluation to complete for the ${data.evaluationPeriod} period. Please login to complete your self-evaluation.`;
      break;
    case 'SUBMITTED_BY_STAFF':
      subject = `Staff Evaluation Submitted - ${data.evaluationPeriod}`;
      message = `A staff member has submitted their self-evaluation for the ${data.evaluationPeriod} period. Please login to review it.`;
      break;
    case 'REVIEWED_BY_LEAD':
      subject = `Team Lead Review Completed - ${data.evaluationPeriod}`;
      message = `The team lead has completed their review for the ${data.evaluationPeriod} evaluation. Please login to proceed with the HR review.`;
      break;
    case 'PENDING_DIRECTOR_REVIEW':
      subject = `HR Review Completed - ${data.evaluationPeriod}`;
      message = `HR has completed their review for the ${data.evaluationPeriod} evaluation. Please login to provide the final director review.`;
      break;
    case 'COMPLETED':
      subject = `Evaluation Completed - ${data.evaluationPeriod}`;
      message = `Your evaluation for the ${data.evaluationPeriod} period has been completed. Please login to view the final results.`;
      break;
    default:
      subject = `Evaluation Update - ${data.evaluationPeriod}`;
      message = `There has been an update to your evaluation for the ${data.evaluationPeriod} period. Please login to check the details.`;
  }

  // Add custom message if provided
  if (data.message) {
    message += `\n\nAdditional information: ${data.message}`;
  }

  // Add link to the evaluation
  const baseUrl = window.location.origin;
  message += `\n\nAccess your evaluation here: ${baseUrl}/evaluation/${data.evaluationId}`;

  return sendNotificationEmail({
    to_email: data.recipientEmail,
    to_name: data.recipientName,
    subject,
    message
  });
};

/**
 * Process backend notification response and send emails
 * @param notificationResponse Response from backend notification endpoint
 * @returns Promise resolving when all emails are sent
 */
export const processBackendNotifications = async (notificationResponse: { notifications: BackendNotification[] }) => {
  if (!notificationResponse || !notificationResponse.notifications || !Array.isArray(notificationResponse.notifications)) {
    console.error('Invalid notification response from backend');
    return;
  }

  const { notifications } = notificationResponse;
  const emailPromises = notifications.map((notification: BackendNotification) => {
    if (notification.type === 'evaluation') {
      return sendEvaluationNotification({
        recipientEmail: notification.recipient.email,
        recipientName: notification.recipient.name,
        evaluationId: notification.data.evaluationId,
        evaluationPeriod: notification.data.period,
        status: notification.data.status,
        message: notification.data.message
      });
    } else {
      // Generic notification
      return sendNotificationEmail({
        to_email: notification.recipient.email,
        to_name: notification.recipient.name,
        subject: notification.data.subject || 'Notification from Review System',
        message: notification.data.message
      });
    }
  });

  try {
    await Promise.all(emailPromises);
    console.log(`Successfully sent ${emailPromises.length} notification emails`);
    return true;
  } catch (error) {
    console.error('Error sending notification emails:', error);
    return false;
  }
};

export default {
  sendNotificationEmail,
  sendEvaluationNotification,
  processBackendNotifications
};

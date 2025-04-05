// src/api/email/index.ts
import emailService, {
  sendNotificationEmail,
  sendEvaluationNotification,
  processBackendNotifications,
} from './emailService';

// Re-export types properly with 'export type'
import type { 
  NotificationData,
  EvaluationNotification,
  BackendNotification
} from './emailService';

export {
  sendNotificationEmail,
  sendEvaluationNotification,
  processBackendNotifications,
};

export type {
  NotificationData,
  EvaluationNotification,
  BackendNotification
};

export default emailService;

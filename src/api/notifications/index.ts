// src/api/notifications.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../axios";
import { Notification } from "../types";

// Types for notifications API
export interface SendEvaluationNotificationDto {
  to: string;
  employeeName: string;
  evaluationDate: Date;
}

export interface SendEvaluationCompleteDto {
  to: string;
  employeeName: string;
  reviewerId: string;
}

export interface SendEvaluationReminderDto {
  to: string;
  reviewerName: string;
  employeeName: string;
  dueDate: Date;
}

// Notifications API functions
export const notificationsApi = {
  getAll: () =>
    apiRequest<Notification[]>({
      method: "GET",
      url: "/notifications",
    }),

  markAsRead: (id: string) =>
    apiRequest<Notification>({
      method: "PATCH",
      url: `/notifications/${id}/read`,
    }),

  markAllAsRead: () =>
    apiRequest<{ message: string }>({
      method: "PATCH",
      url: "/notifications/read-all",
    }),

  sendEvaluationNotification: (data: SendEvaluationNotificationDto) =>
    apiRequest<{ success: boolean }>({
      method: "POST",
      url: "/notifications/evaluation-notification",
      data,
    }),

  sendEvaluationComplete: (data: SendEvaluationCompleteDto) =>
    apiRequest<{ success: boolean }>({
      method: "POST",
      url: "/notifications/evaluation-complete",
      data,
    }),

  sendEvaluationReminder: (data: SendEvaluationReminderDto) =>
    apiRequest<{ success: boolean }>({
      method: "POST",
      url: "/notifications/evaluation-reminder",
      data,
    }),
};

// React Query hooks for notifications
export const useNotifications = () =>
  useQuery({
    queryKey: ["notifications"],
    queryFn: notificationsApi.getAll,
  });

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationsApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationsApi.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

export const useSendEvaluationNotification = () =>
  useMutation({
    mutationFn: notificationsApi.sendEvaluationNotification,
  });

export const useSendEvaluationComplete = () =>
  useMutation({
    mutationFn: notificationsApi.sendEvaluationComplete,
  });

export const useSendEvaluationReminder = () =>
  useMutation({
    mutationFn: notificationsApi.sendEvaluationReminder,
  });

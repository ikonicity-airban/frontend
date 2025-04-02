import { useMutation } from "@tanstack/react-query";
import api from "../axios";
import { APIRoutes } from "../routes";

export const useSendEvaluationNotification = () => {
  return useMutation({
    mutationFn: async (message: { message: string }) =>
      (await api.post(APIRoutes.NotificationsEvaluationNotification, message))
        .data,
  });
};

export const useSendEvaluationComplete = () => {
  return useMutation({
    mutationFn: async (message: { message: string }) =>
      (await api.post("/notifications/evaluation-complete", message)).data,
  });
};

export const useSendEvaluationReminder = () => {
  return useMutation({
    mutationFn: async (message: { message: string }) =>
      (await api.post("/notifications/evaluation-reminder", message)).data,
  });
};

import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../axios";
import type { User } from "../types";

export const useAdminUsers = () => {
  return useQuery<User[]>({
    queryKey: ["admin", "users"],
    queryFn: async () => (await api.get("/admin/users")).data,
  });
};

export const useUpdateUserRole = () => {
  return useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) =>
      (await api.post(`/admin/users/${id}/role`, { role })).data,
  });
};

export const useEvaluationStats = () => {
  return useQuery({
    queryKey: ["admin", "evaluation-stats"],
    queryFn: async () => (await api.get("/admin/evaluations/stats")).data,
  });
};

export const useSetDeadlines = () => {
  return useMutation({
    mutationFn: async (deadline: { deadline: string }) =>
      (await api.post("/admin/settings/deadlines", deadline)).data,
  });
};

export const usePerformanceReports = () => {
  return useQuery({
    queryKey: ["admin", "performance-reports"],
    queryFn: async () => (await api.get("/admin/reports/performance")).data,
  });
};

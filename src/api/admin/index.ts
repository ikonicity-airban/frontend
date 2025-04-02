import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../axios";
import {
  User,
  UpdateUserRoleDto,
  DeadlinesDto,
  EvaluationStats,
  AdminStats,
  SystemHealth,
} from "../types";

// Admin API functions
export const adminApi = {
  // User management
  getAllUsers: () =>
    apiRequest<User[]>({
      method: "GET",
      url: "/admin/users",
    }),

  updateUserRole: (id: string, data: UpdateUserRoleDto) =>
    apiRequest<User>({
      method: "POST",
      url: `/admin/users/${id}/role`,
      data,
    }),

  // Evaluation management
  getEvaluationStats: () =>
    apiRequest<EvaluationStats>({
      method: "GET",
      url: "/admin/evaluations/stats",
    }),

  setEvaluationDeadlines: (data: DeadlinesDto) =>
    apiRequest<DeadlinesDto>({
      method: "POST",
      url: "/admin/settings/deadlines",
      data,
    }),

  getPerformanceReports: () =>
    apiRequest<any[]>({
      method: "GET",
      url: "/admin/reports/performance",
    }),

  // System stats and monitoring
  getAdminStats: () =>
    apiRequest<AdminStats>({
      method: "GET",
      url: "/admin/stats",
    }),

  getSystemHealth: () =>
    apiRequest<SystemHealth>({
      method: "GET",
      url: "/admin/system/health",
    }),
};

// React Query hooks for admin
export const useAdminUsers = () =>
  useQuery({
    queryKey: ["admin", "users"],
    queryFn: adminApi.getAllUsers,
  });

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      adminApi.updateUserRole(id, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useEvaluationStats = () =>
  useQuery({
    queryKey: ["admin", "evaluations", "stats"],
    queryFn: adminApi.getEvaluationStats,
  });

export const useSetEvaluationDeadlines = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.setEvaluationDeadlines,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
      queryClient.invalidateQueries({ queryKey: ["evaluations"] });
    },
  });
};

export const usePerformanceReports = () =>
  useQuery({
    queryKey: ["admin", "reports", "performance"],
    queryFn: adminApi.getPerformanceReports,
  });

export const useAdminStats = () =>
  useQuery({
    queryKey: ["admin", "stats"],
    queryFn: adminApi.getAdminStats,
  });

export const useSystemHealth = () =>
  useQuery({
    queryKey: ["admin", "system", "health"],
    queryFn: adminApi.getSystemHealth,
    // Polling for system health every minute
    refetchInterval: 60000,
  });

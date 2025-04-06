import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../axios";
import { APIRoutes } from "../routes";
import { AxiosError } from "axios";

// Type definitions
interface User {
  id: string;
  name: string;
  role: string;
  email: string;
}

interface AdminStats {
  usersCount: number;
  activeEvaluations: number;
  completedEvaluations: number;
}

interface SystemHealth {
  status: "healthy" | "unhealthy";
  uptime: number;
  services: {
    database: boolean;
    cache: boolean;
    email: boolean;
  };
}

interface EvaluationStats {
  pending: number;
  completed: number;
  total: number;
  quarterProgress: number;
}

interface EvaluationProgress {
  completed: number;
  totalStaff: number;
  pendingUsers: string[];
}

interface EvaluationSettings {
  id: string;
  year: number;
  quarter: number;
  periodName: string;
  isActive: boolean;
  selfEvaluationDeadline: string;
  leadReviewDeadline: string;
  hrReviewDeadline: string;
  directorDecisionDeadline: string;
}

interface SendRemindersDto {
  period?: string;
  type?: "ALL" | "STAFF" | "LEAD" | "HR" | "DIRECTOR";
}

interface Team {
  id: string;
  name: string;
  description?: string;
  teamLeadId?: string;
  teamLead?: User;
  members: TeamMember[];
  createdAt: Date;
  updatedAt: Date;
}

interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  isLead: boolean;
  user: User;
}

interface CreateTeamDto {
  name: string;
  description?: string;
  teamLeadId?: string;
}

interface TeamMemberDto {
  userId: string;
  isLead?: boolean;
}

interface Activity {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: string;
  createdAt: string;
}

interface ActivityLogParams {
  page?: number;
  limit?: number;
  entityType?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
}

interface ActivityLogResponse {
  data: Activity[];
  total: number;
}

// Re-export types properly
export type { User, Team, TeamMember, Activity };

// API functions with return types
export const adminApi = {
  getAllUsers: (): Promise<User[]> =>
    apiRequest<User[]>({
      method: "GET",
      url: "/admin/users",
    }),

  updateUserRole: (id: string, data: UpdateUserRoleDto): Promise<User> =>
    apiRequest<User>({
      method: "POST",
      url: `/admin/users/${id}/role`,
      data,
    }),

  getAdminStats: (): Promise<AdminStats> =>
    apiRequest<AdminStats>({
      method: "GET",
      url: "/admin/stats",
    }),

  getSystemHealth: (): Promise<SystemHealth> =>
    apiRequest<SystemHealth>({
      method: "GET",
      url: "/admin/system/health",
    }),

  getEvaluationStats: (): Promise<EvaluationStats> =>
    apiRequest<EvaluationStats>({
      method: "GET",
      url: APIRoutes.AdminEvaluationsStats,
    }),

  setEvaluationDeadlines: (data: DeadlinesDto): Promise<DeadlinesDto> =>
    apiRequest<DeadlinesDto>({
      method: "POST",
      url: "/admin/settings/deadlines",
      data,
    }),

  getPerformanceReports: (): Promise<any[]> =>
    apiRequest<any[]>({
      method: "GET",
      url: "/admin/reports/performance",
    }),

  getCurrentEvaluationSettings: (): Promise<EvaluationSettings> =>
    apiRequest<EvaluationSettings>({
      method: "GET",
      url: "/admin/settings/current-period",
    }),

  getEvaluationProgress: (): Promise<EvaluationProgress> =>
    apiRequest<EvaluationProgress>({
      method: "GET",
      url: "/admin/monitor/progress",
    }),

  sendReminderEmails: (data: SendRemindersDto): Promise<{ sent: number }> =>
    apiRequest<{ sent: number }>({
      method: "POST",
      url: "/admin/notifications/send-reminders",
      data,
    }),

  // Evaluation Settings
  createEvaluationSettings: (
    data: CreateEvaluationSettingsDto
  ): Promise<void> =>
    apiRequest<void>({
      method: "POST",
      url: "/admin/settings/evaluation-period",
      data,
    }),

  updateEvaluationSettings: (
    id: string,
    data: UpdateEvaluationSettingsDto
  ): Promise<void> =>
    apiRequest<void>({
      method: "PATCH",
      url: `/admin/settings/evaluation-period/${id}`,
      data,
    }),

  getEvaluationSettings: (id: string): Promise<EvaluationSettings> =>
    apiRequest<EvaluationSettings>({
      method: "GET",
      url: `/admin/settings/evaluation-period/${id}`,
    }),

  getAllEvaluationSettings: (): Promise<EvaluationSettings[]> =>
    apiRequest<EvaluationSettings[]>({
      method: "GET",
      url: "/admin/settings/evaluation-period",
    }),

  deleteEvaluationSettings: (id: string): Promise<void> =>
    apiRequest<void>({
      method: "DELETE",
      url: `/admin/settings/evaluation-period/${id}`,
    }),

  // Monitoring and Reports
  exportEvaluationData: (period?: string): Promise<void> =>
    apiRequest<void>({
      method: "GET",
      url: "/admin/reports/export",
      params: period ? { period } : undefined,
    }),

  // Team Management
  getAllTeams: (): Promise<Team[]> =>
    apiRequest<Team[]>({
      method: "GET",
      url: "/teams",
    }),

  createTeam: (data: CreateTeamDto): Promise<Team> =>
    apiRequest<Team>({
      method: "POST",
      url: "/teams",
      data,
    }),

  getTeam: (id: string): Promise<Team> =>
    apiRequest<Team>({
      method: "GET",
      url: `/teams/${id}`,
    }),

  addTeamMember: (teamId: string, data: TeamMemberDto): Promise<TeamMember> =>
    apiRequest<TeamMember>({
      method: "POST",
      url: `/teams/${teamId}/members`,
      data,
    }),

  removeTeamMember: (teamId: string, userId: string): Promise<void> =>
    apiRequest<void>({
      method: "DELETE",
      url: `/teams/${teamId}/members/${userId}`,
    }),

  updateTeamLead: (teamId: string, teamLeadId: string): Promise<Team> =>
    apiRequest<Team>({
      method: "PATCH",
      url: `/teams/${teamId}/lead`,
      data: { teamLeadId },
    }),

  updateMemberRole: (
    teamId: string,
    userId: string,
    isLead: boolean
  ): Promise<TeamMember> =>
    apiRequest<TeamMember>({
      method: "PATCH",
      url: `/teams/${teamId}/members/${userId}/role`,
      data: { isLead },
    }),

  // Activity Tracking
  getActivityLogs: (
    params: ActivityLogParams = {}
  ): Promise<ActivityLogResponse> => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", String(params.page));
    if (params.limit) queryParams.append("limit", String(params.limit));
    if (params.entityType) queryParams.append("entityType", params.entityType);
    if (params.userId) queryParams.append("userId", params.userId);
    if (params.startDate) queryParams.append("startDate", params.startDate);
    if (params.endDate) queryParams.append("endDate", params.endDate);

    return apiRequest<ActivityLogResponse>({
      method: "GET",
      url: `/admin/activity?${queryParams.toString()}`,
    });
  },

  logActivity: (data: {
    action: string;
    entityType: string;
    entityId?: string;
    details?: string;
  }): Promise<Activity> =>
    apiRequest<Activity>({
      method: "POST",
      url: "/admin/activity",
      data,
    }),
};

// React Query hooks with proper return types
export const useAdminUsers = () =>
  useQuery<User[]>({
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

export const useAdminStats = () =>
  useQuery<AdminStats>({
    queryKey: ["admin", "stats"],
    queryFn: adminApi.getAdminStats,
  });

export const useSystemHealth = () =>
  useQuery<SystemHealth>({
    queryKey: ["system", "health"],
    queryFn: adminApi.getSystemHealth,
    // Polling for system health every minute
    refetchInterval: 60000,
  });

export const useEvaluationStats = () =>
  useQuery<EvaluationStats>({
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
  useQuery<any[]>({
    queryKey: ["admin", "reports", "performance"],
    queryFn: adminApi.getPerformanceReports,
  });

export const useGetCurrentEvaluationSettings = () =>
  useQuery<EvaluationSettings>({
    queryKey: ["current-period"],
    queryFn: adminApi.getCurrentEvaluationSettings,
  });

export const useGetEvaluationProgress = () =>
  useQuery<EvaluationProgress>({
    queryKey: ["evaluation-progress"],
    queryFn: adminApi.getEvaluationProgress,
  });

export const useSendReminderEmails = () => {
  const queryClient = useQueryClient();
  return useMutation<{ sent: number }, AxiosError, SendRemindersDto, unknown>({
    mutationFn: adminApi.sendReminderEmails,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evaluation-progress"] });
    },
  });
};

// Evaluation Settings Mutations
export const useCreateEvaluationSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.createEvaluationSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evaluation-settings"] });
      queryClient.invalidateQueries({ queryKey: ["current-period"] });
    },
  });
};

export const useUpdateEvaluationSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateEvaluationSettingsDto;
    }) => adminApi.updateEvaluationSettings(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evaluation-settings"] });
      queryClient.invalidateQueries({ queryKey: ["current-period"] });
    },
  });
};

export const useDeleteEvaluationSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.deleteEvaluationSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evaluation-settings"] });
      queryClient.invalidateQueries({ queryKey: ["current-period"] });
    },
  });
};

export const useGetEvaluationSettings = (id: string) =>
  useQuery({
    queryKey: ["evaluation-settings", id],
    queryFn: () => adminApi.getEvaluationSettings(id),
    enabled: !!id,
  });

export const useGetAllEvaluationSettings = () =>
  useQuery({
    queryKey: ["evaluation-settings"],
    queryFn: adminApi.getAllEvaluationSettings,
  });

// Progress and Export Mutations/Queries
export const useExportEvaluationData = () =>
  useMutation({
    mutationFn: adminApi.exportEvaluationData,
  });

// Team Management Mutations/Queries
export const useTeams = () =>
  useQuery<Team[]>({
    queryKey: ["teams"],
    queryFn: adminApi.getAllTeams,
  });

export const useCreateTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.createTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
};

export const useAddTeamMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ teamId, data }: { teamId: string; data: TeamMemberDto }) =>
      adminApi.addTeamMember(teamId, data),
    onSuccess: (_, { teamId }) => {
      queryClient.invalidateQueries({ queryKey: ["teams", teamId] });
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
};

export const useRemoveTeamMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ teamId, userId }: { teamId: string; userId: string }) =>
      adminApi.removeTeamMember(teamId, userId),
    onSuccess: (_, { teamId }) => {
      queryClient.invalidateQueries({ queryKey: ["teams", teamId] });
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
};

export const useUpdateTeamLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      teamId,
      teamLeadId,
    }: {
      teamId: string;
      teamLeadId: string;
    }) => adminApi.updateTeamLead(teamId, teamLeadId),
    onSuccess: (_, { teamId }) => {
      queryClient.invalidateQueries({ queryKey: ["teams", teamId] });
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
};

export const useUpdateMemberRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      teamId,
      userId,
      isLead,
    }: {
      teamId: string;
      userId: string;
      isLead: boolean;
    }) => adminApi.updateMemberRole(teamId, userId, isLead),
    onSuccess: (_, { teamId }) => {
      queryClient.invalidateQueries({ queryKey: ["teams", teamId] });
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
};

// Activity Logs Query
export const useActivityLogs = (params: ActivityLogParams = {}) =>
  useQuery<ActivityLogResponse>({
    queryKey: ["admin", "activity", params],
    queryFn: () => adminApi.getActivityLogs(params),
    placeholderData: (previousData) => previousData,
  });

// Log Activity Mutation
export const useLogActivity = () => {
  return useMutation({
    mutationFn: adminApi.logActivity,
  });
};

// Types for DTOs
export interface UpdateUserRoleDto {
  role: string;
}

export interface DeadlinesDto {
  startDate: string;
  endDate: string;
}

export interface CreateEvaluationSettingsDto {
  year: number;
  quarter: number;
  periodName: string;
  isActive: boolean;
  selfEvaluationDeadline: Date;
  leadReviewDeadline: Date;
  hrReviewDeadline: Date;
  directorDecisionDeadline: Date;
}

export interface UpdateEvaluationSettingsDto {
  year?: number;
  quarter?: number;
  periodName?: string;
  isActive?: boolean;
  selfEvaluationDeadline?: Date;
  leadReviewDeadline?: Date;
  hrReviewDeadline?: Date;
  directorDecisionDeadline?: Date;
}

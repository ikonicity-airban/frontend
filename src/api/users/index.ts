// src/api/users.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { User } from "../types";
import { UserRoles } from "../../lib/roles";
import { apiRequest } from "../axios";

// Types for user API
export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
  role?: UserRoles;
}

export interface UpdateUserDto extends Partial<CreateUserDto> {}

// User API functions
export const usersApi = {
  getAll: () =>
    apiRequest<User[]>({
      method: "GET",
      url: "/users",
    }),

  getById: (id: string) =>
    apiRequest<User>({
      method: "GET",
      url: `/users/${id}`,
    }),

  create: (data: CreateUserDto) =>
    apiRequest<User>({
      method: "POST",
      url: "/users",
      data,
    }),

  update: (id: string, data: UpdateUserDto) =>
    apiRequest<User>({
      method: "PATCH",
      url: `/users/${id}`,
      data,
    }),

  remove: (id: string) =>
    apiRequest<User>({
      method: "DELETE",
      url: `/users/${id}`,
    }),

  // Role-specific endpoints
  getAllStaff: () =>
    apiRequest<User[]>({
      method: "GET",
      url: "/staff",
    }),

  getStaffByTeamLead: (leadId: string) =>
    apiRequest<User[]>({
      method: "GET",
      url: `/staff/lead/${leadId}`,
    }),

  getAllLeads: () =>
    apiRequest<User[]>({
      method: "GET",
      url: "/leads",
    }),

  getTeamMembers: (leadId: string) =>
    apiRequest<User[]>({
      method: "GET",
      url: `/leads/${leadId}/team`,
    }),

  getAllHr: () =>
    apiRequest<User[]>({
      method: "GET",
      url: "/hr",
    }),

  getAllDirectors: () =>
    apiRequest<User[]>({
      method: "GET",
      url: "/directors",
    }),

  getAllEmployees: () =>
    apiRequest<User[]>({
      method: "GET",
      url: "/employees",
    }),

  getEmployeesByTeam: (teamId: string) =>
    apiRequest<User[]>({
      method: "GET",
      url: `/employees/team/${teamId}`,
    }),
};

// React Query hooks for users
export const useUsers = () =>
  useQuery({
    queryKey: ["users"],
    queryFn: usersApi.getAll,
  });

export const useUser = (id: string) =>
  useQuery({
    queryKey: ["users", id],
    queryFn: () => usersApi.getById(id),
    enabled: !!id,
  });

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useUpdateUser = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateUserDto) => usersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", id] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usersApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

// Role-specific hooks
export const useStaff = () =>
  useQuery({
    queryKey: ["staff"],
    queryFn: usersApi.getAllStaff,
  });

export const useStaffByTeamLead = (leadId: string) =>
  useQuery({
    queryKey: ["staff", "lead", leadId],
    queryFn: () => usersApi.getStaffByTeamLead(leadId),
    enabled: !!leadId,
  });

export const useLeads = () =>
  useQuery({
    queryKey: ["leads"],
    queryFn: usersApi.getAllLeads,
  });

export const useTeamMembers = (leadId: string) =>
  useQuery({
    queryKey: ["team", leadId],
    queryFn: () => usersApi.getTeamMembers(leadId),
    enabled: !!leadId,
  });

export const useHrUsers = () =>
  useQuery({
    queryKey: ["hr"],
    queryFn: usersApi.getAllHr,
  });

export const useDirectors = () =>
  useQuery({
    queryKey: ["directors"],
    queryFn: usersApi.getAllDirectors,
  });

export const useEmployees = () =>
  useQuery({
    queryKey: ["employees"],
    queryFn: usersApi.getAllEmployees,
  });

export const useEmployeesByTeam = (teamId: string) =>
  useQuery({
    queryKey: ["employees", "team", teamId],
    queryFn: () => usersApi.getEmployeesByTeam(teamId),
    enabled: !!teamId,
  });

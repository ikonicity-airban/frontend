// src/api/users.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
  phone?: string;
  address?: string;
}

export interface UpdateUserDto extends Omit<Partial<CreateUserDto>, 'role'> { }

interface UsersQueryParams {
  page?: number;
  limit?: number;
  role?: string;
  search?: string;
}

// User API functions
export const usersApi = {
  getAll: (params: UsersQueryParams = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', String(params.page));
    if (params.limit) queryParams.append('limit', String(params.limit));
    // Only add role if it's not 'all'
    if (params.role && params.role !== 'all') queryParams.append('role', params.role);
    if (params.search) queryParams.append('search', params.search);

    return apiRequest<{ data: User[], total: number }>({
      method: "GET",
      url: `/users?${queryParams.toString()}`,
    });
  },

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
};

// React Query hooks for users
export const useUsers = (params: UsersQueryParams = {}) =>
  useQuery<{ data: User[]; total: number }>({
    // Include all params in the query key for proper caching
    queryKey: ["users", params.page, params.limit, params.role, params.search],
    queryFn: () => usersApi.getAll(params),
    placeholderData: (previousData) => previousData,
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

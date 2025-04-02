import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../axios";
import type { User } from "../types";

export const useUsers = () => {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => (await api.get("/users")).data,
  });
};

export const useUser = (id: string) => {
  return useQuery<User>({
    queryKey: ["users", id],
    queryFn: async () => (await api.get(`/users/${id}`)).data,
  });
};

export const useCreateUser = () => {
  return useMutation({
    mutationFn: async (userData: Partial<User>) =>
      (await api.post("/users", userData)).data,
  });
};

export const useUpdateUser = (id: string) => {
  return useMutation({
    mutationFn: async (userData: Partial<User>) =>
      (await api.patch(`/users/${id}`, userData)).data,
  });
};

export const useDeleteUser = () => {
  return useMutation({
    mutationFn: async (id: string) => (await api.delete(`/users/${id}`)).data,
  });
};

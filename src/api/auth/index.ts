import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../axios";
import type { LoginCredentials, SignupData, User } from "../types";
import { APIRoutes } from "../routes";

const baseURL: string =
  (import.meta as any).env.VITE_API_BASE_URL || "http://localhost:3000";

type LoginResponse = {
  session_id: string;
  access_token: string;
  user: User;
};

export const useLogin = () => {
  const mutateAsync = async (data: LoginCredentials) => {
    const response = await api.post<LoginResponse>(
      `${baseURL}${APIRoutes.AuthLogin}`,
      data
    );
    return response.data;
  };

  return { mutateAsync };
};

export const useSignup = () => {
  return useMutation({
    mutationFn: async (data: SignupData) =>
      (await api.post(APIRoutes.AuthSignup, data)).data,
  });
};

export const useLogout = () => {
  const mutateAsync = async () => (await api.post("/auth/logout")).data;
  return { mutateAsync };
};

export const useSessions = () => {
  return useQuery({
    queryKey: ["sessions"],
    queryFn: async () => (await api.get("/auth/sessions")).data,
  });
};

export const useGetUserProfile = () => {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => (await api.get("/auth/profile")).data,
  });
};

export type { User } from "../types";

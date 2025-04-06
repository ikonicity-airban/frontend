import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "../axios";
import type { User } from "../types";

// Types for auth API
export interface LoginDto {
  email: string;
  password: string;
}

export interface SignUpDto {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface VerifyOtpDto {
  email: string;
  otp: string;
}

export interface RequestOtpDto {
  email: string;
}

export interface AuthResponse {
  access_token: string;
  session_id: string;
  user: User;
}

// Auth API functions
export const authApi = {
  login: (data: LoginDto) =>
    apiRequest<AuthResponse>({
      method: "POST",
      url: "/auth/login",
      data,
    }),

  signup: (data: SignUpDto) =>
    apiRequest<AuthResponse>({
      method: "POST",
      url: "/auth/signup",
      data,
    }),

  changePassword: (data: ChangePasswordDto) =>
    apiRequest<{ message: string }>({
      method: "PATCH",
      url: "/auth/change-password",
      data,
    }),

  forgotPassword: (data: ForgotPasswordDto) =>
    apiRequest<{ message: string }>({
      method: "POST",
      url: "/auth/request-password-reset",
      data,
    }),

  resetPassword: (data: ResetPasswordDto) =>
    apiRequest<{ message: string }>({
      method: "POST",
      url: "/auth/reset-password",
      data,
    }),

  requestOtp: (data: RequestOtpDto) =>
    apiRequest<{ message: string }>({
      method: "POST",
      url: "/auth/request-otp",
      data,
    }),

  verifyOtp: (data: VerifyOtpDto) =>
    apiRequest<{ message: string; verified: boolean }>({
      method: "POST",
      url: "/auth/verify-otp",
      data,
    }),

  logout: () =>
    apiRequest<{ message: string }>({
      method: "POST",
      url: "/auth/logout",
    }),
};

export type LoginResponse = {
  session_id: string;
  access_token: string;
  user: User;
};

export const useSignup = () =>
  useMutation({
    mutationFn: authApi.signup,
    onSuccess: (data) => {
      // Store token in localStorage
      localStorage.setItem("token", data.access_token);
    },
  });

export const useChangePassword = () =>
  useMutation({
    mutationFn: authApi.changePassword,
  });

export const useForgotPassword = () =>
  useMutation({
    mutationFn: authApi.forgotPassword,
  });

export const useResetPassword = () =>
  useMutation({
    mutationFn: authApi.resetPassword,
  });

export const useRequestOtp = () =>
  useMutation({
    mutationFn: authApi.requestOtp,
  });

export const useVerifyOtp = () =>
  useMutation({
    mutationFn: authApi.verifyOtp,
  });

export const useLogin = () =>
  useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // Store token in localStorage
      localStorage.setItem("token", data.access_token);
    },
  });

export const useLogout = () =>
  useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // Remove token from localStorage
      localStorage.removeItem("token");
    },
  });

export type { User } from "../types";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "../api/auth";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      isLoading: true,
      setIsLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: "auth-storage",
    }
  )
);

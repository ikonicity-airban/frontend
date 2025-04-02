import React, { createContext, useContext } from "react";
import { useLogin, useLogout, User } from "../api/auth";
import { LoginCredentials } from "../api/types";
import Cookies from "js-cookie";
import { useAuthStore } from "../store/authStore";
import { CONSTANTS } from "../lib/constants";

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { mutateAsync: loginFn } = useLogin();
  const { mutateAsync: logoutFn } = useLogout();
  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const login = async (credentials: LoginCredentials) => {
    const loginResponse = await loginFn(credentials);
    Cookies.set(CONSTANTS.AUTH_TOKEN, loginResponse.access_token);
    Cookies.set(CONSTANTS.SESSION_ID, loginResponse.session_id);
    setUser(loginResponse.user);
  };

  const logout = async () => {
    await logoutFn();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated,
        isLoading: false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../axios";

interface SystemHealth {
  server: {
    status: "healthy" | "unhealthy";
    uptime: string;
  };
  database: {
    status: "healthy" | "unhealthy";
  };
  alerts: Array<{
    severity: "high" | "medium" | "low";
    message: string;
    description: string;
  }>;
}

interface SystemStats {
  activeUsers: number;
  totalRequests: number;
  averageResponseTime: number;
}

const systemApi = {
  getHealth: () =>
    apiRequest<SystemHealth>({
      method: "GET",
      url: "/system/health",
    }),

  getStats: () =>
    apiRequest<SystemStats>({
      method: "GET",
      url: "/system/stats",
    }),
};

export const useSystemHealth = () =>
  useQuery<SystemHealth>({
    queryKey: ["system", "health"],
    queryFn: systemApi.getHealth,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

export const useSystemStats = () =>
  useQuery<SystemStats>({
    queryKey: ["system", "stats"],
    queryFn: systemApi.getStats,
    refetchInterval: 60000, // Refresh every minute
  });

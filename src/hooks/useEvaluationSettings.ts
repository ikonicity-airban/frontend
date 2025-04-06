// src/hooks/useEvaluationSettings.ts
import { useEffect } from "react";
import { useSettingsStore, EvaluationSetting } from "../store/useSettingsStore";

interface UseEvaluationSettingsReturn {
  allSettings: EvaluationSetting[];
  currentSetting: EvaluationSetting | null;
  isLoading: boolean;
  error: string | null;
  fetchSettings: () => Promise<void>;
  fetchCurrentSetting: () => Promise<void>;

  // Helper functions
  getDeadlineForRole: (
    role: "STAFF" | "LEAD" | "HR" | "DIRECTOR"
  ) => Date | null;
  isDeadlinePassed: (role: "STAFF" | "LEAD" | "HR" | "DIRECTOR") => boolean;
  getCurrentQuarterInfo: () => { quarter: number; year: number } | null;
}

export const useEvaluationSettings = (
  autoFetch = true
): UseEvaluationSettingsReturn => {
  const {
    settings,
    currentSetting,
    isLoading,
    error,
    fetchSettings,
    fetchCurrentSetting,
  } = useSettingsStore();

  useEffect(() => {
    if (autoFetch && !currentSetting && !isLoading) {
      fetchCurrentSetting();
    }
  }, [autoFetch, currentSetting, isLoading, fetchCurrentSetting]);

  const getDeadlineForRole = (
    role: "STAFF" | "LEAD" | "HR" | "DIRECTOR"
  ): Date | null => {
    if (!currentSetting) return null;

    switch (role) {
      case "STAFF":
        return currentSetting.selfEvaluationDeadline;
      case "LEAD":
        return currentSetting.leadReviewDeadline;
      case "HR":
        return currentSetting.hrReviewDeadline;
      case "DIRECTOR":
        return currentSetting.directorDecisionDeadline;
      default:
        return null;
    }
  };

  const isDeadlinePassed = (
    role: "STAFF" | "LEAD" | "HR" | "DIRECTOR"
  ): boolean => {
    const deadline = getDeadlineForRole(role);
    if (!deadline) return false;
    return new Date() > deadline;
  };

  const getCurrentQuarterInfo = () => {
    if (!currentSetting) return null;
    return {
      quarter: currentSetting.quarter,
      year: currentSetting.year,
    };
  };

  return {
    allSettings: settings,
    currentSetting,
    isLoading,
    error,
    fetchSettings,
    fetchCurrentSetting,
    getDeadlineForRole,
    isDeadlinePassed,
    getCurrentQuarterInfo,
  };
};

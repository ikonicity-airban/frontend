// src/store/useSettingsStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

export interface EvaluationSetting {
  id: string;
  settingKey: string;
  settingValue: string;
  periodName: string;
  year: number;
  quarter: number;
  startDate: Date;
  selfEvaluationDeadline: Date;
  leadReviewDeadline: Date;
  hrReviewDeadline: Date;
  directorDecisionDeadline: Date;
  endDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface SettingsState {
  settings: EvaluationSetting[];
  currentSetting: EvaluationSetting | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchSettings: () => Promise<void>;
  fetchCurrentSetting: () => Promise<void>;
  reset: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      settings: [],
      currentSetting: null,
      isLoading: false,
      error: null,

      fetchSettings: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.get(
            "/api/admin/settings/evaluation-period"
          );

          // Parse dates from strings to Date objects
          const settingsWithDates = response.data.map((setting: any) => ({
            ...setting,
            startDate: new Date(setting.startDate),
            selfEvaluationDeadline: new Date(setting.selfEvaluationDeadline),
            leadReviewDeadline: new Date(setting.leadReviewDeadline),
            hrReviewDeadline: new Date(setting.hrReviewDeadline),
            directorDecisionDeadline: new Date(
              setting.directorDecisionDeadline
            ),
            endDate: new Date(setting.endDate),
            createdAt: new Date(setting.createdAt),
            updatedAt: new Date(setting.updatedAt),
          }));

          set({ settings: settingsWithDates, isLoading: false });
        } catch (error) {
          console.error("Failed to fetch evaluation settings:", error);
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to load settings",
            isLoading: false,
          });
        }
      },

      fetchCurrentSetting: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.get(
            "/api/admin/settings/current-period"
          );

          // Parse dates from strings to Date objects
          const settingWithDates = {
            ...response.data,
            startDate: new Date(response.data.startDate),
            selfEvaluationDeadline: new Date(
              response.data.selfEvaluationDeadline
            ),
            leadReviewDeadline: new Date(response.data.leadReviewDeadline),
            hrReviewDeadline: new Date(response.data.hrReviewDeadline),
            directorDecisionDeadline: new Date(
              response.data.directorDecisionDeadline
            ),
            endDate: new Date(response.data.endDate),
            createdAt: new Date(response.data.createdAt),
            updatedAt: new Date(response.data.updatedAt),
          };

          set({ currentSetting: settingWithDates, isLoading: false });
        } catch (error) {
          console.error("Failed to fetch current evaluation setting:", error);
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to load current setting",
            isLoading: false,
          });
        }
      },

      reset: () => {
        set({ settings: [], currentSetting: null, error: null });
      },
    }),
    {
      name: "evaluation-settings-storage",
      partialize: (state) => ({
        settings: state.settings,
        currentSetting: state.currentSetting,
      }),
    }
  )
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { adminApi } from '../api/admin';

export interface SystemSettings {
  companyName: string;
  timeZone: string;
  emailNotifications: boolean;
  systemNotifications: boolean;
  defaultEvaluationPeriod: string;
  reviewDeadlineDays: number;
  twoFactorAuth: boolean;
  passwordPolicy: string;
}

const defaultSettings: SystemSettings = {
  companyName: 'Review Notify Inc.',
  timeZone: 'UTC',
  emailNotifications: true,
  systemNotifications: true,
  defaultEvaluationPeriod: 'Quarterly',
  reviewDeadlineDays: 14,
  twoFactorAuth: false,
  passwordPolicy: 'Standard'
};

interface SettingsState {
  settings: SystemSettings;
  isLoading: boolean;
  hasLoaded: boolean;
  setSettings: (settings: SystemSettings) => void;
  updateSetting: <K extends keyof SystemSettings>(
    key: K,
    value: SystemSettings[K]
  ) => void;
  fetchSettings: () => Promise<void>;
  saveSettings: () => Promise<void>;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      isLoading: false,
      hasLoaded: false,
      
      setSettings: (settings) => set({ settings }),
      
      updateSetting: (key, value) => set((state) => ({
        settings: {
          ...state.settings,
          [key]: value
        }
      })),
      
      fetchSettings: async () => {
        try {
          set({ isLoading: true });
          // Call the API to get settings
          const settings = await adminApi.getSystemSettings();
          set({ settings, hasLoaded: true });
        } catch (error) {
          console.error('Failed to fetch settings:', error);
        } finally {
          set({ isLoading: false });
        }
      },
      
      saveSettings: async () => {
        try {
          set({ isLoading: true });
          // Call the API to save settings
          await adminApi.saveSystemSettings(get().settings);
        } catch (error) {
          console.error('Failed to save settings:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      
      resetSettings: () => set({ settings: defaultSettings })
    }),
    {
      name: 'system-settings-storage',
      // Only store the settings in persisted storage
      partialize: (state) => ({ settings: state.settings })
    }
  )
);

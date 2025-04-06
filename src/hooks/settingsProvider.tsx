import React, { useEffect } from "react";
import { useSettingsStore } from "../store/useSettingsStore";

interface SettingsProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component that loads evaluation settings on app initialization
 */
export const SettingsProvider: React.FC<SettingsProviderProps> = ({
  children,
}) => {
  const { fetchCurrentSetting, currentSetting, isLoading } = useSettingsStore();

  useEffect(() => {
    // Only fetch if we don't have settings yet and we're not already loading
    if (!currentSetting && !isLoading) {
      fetchCurrentSetting();
    }
  }, [fetchCurrentSetting, currentSetting, isLoading]);

  return <>{children}</>;
};

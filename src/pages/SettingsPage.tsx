import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings2Icon, BellIcon, ClipboardListIcon, ShieldIcon, SaveIcon } from 'lucide-react';
import { UserRoles } from '../lib/roles';
import { useNotification } from '../context/NotificationContext';
import { useMutation, useQuery } from '@tanstack/react-query';
import { adminApi } from '../api/admin';

interface SystemSettings {
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

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch settings
  const { data: fetchedSettings, isLoading: isSettingsLoading } = useQuery({
    queryKey: ['systemSettings'],
    queryFn: () => adminApi.getSystemSettings(),
    // In a real app, this would call a real endpoint
    // Since we don't have a real endpoint, we're mocking the response
    enabled: user?.role === UserRoles.ADMIN,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Update settings when data is fetched
  useEffect(() => {
    if (fetchedSettings) {
      setSettings(fetchedSettings);
    }
  }, [fetchedSettings]);

  // Save settings mutation
  const { mutate: saveSettings, isPending: isSaving } = useMutation({
    mutationFn: (updatedSettings: SystemSettings) => {
      // In a real app, this would call a real endpoint
      return new Promise<SystemSettings>((resolve) => {
        setTimeout(() => {
          resolve(updatedSettings);
        }, 1000);
      });
    },
    onSuccess: () => {
      showNotification('success', 'Settings saved successfully');
    },
    onError: () => {
      showNotification('error', 'Failed to save settings');
    }
  });

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings(settings);
    // Log activity
    adminApi.logActivity({
      action: "updated system settings",
      entityType: "settings",
      details: "Updated general system configuration"
    });
  };

  if (user?.role !== UserRoles.ADMIN) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12">
          <h2 className="text-lg font-medium text-gray-900">
            Access Restricted
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          System Settings
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage application settings and configurations
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* General Settings */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-center">
                <Settings2Icon className="h-5 w-5 text-gray-400" />
                <h2 className="ml-2 text-lg font-medium text-gray-900">
                  General Settings
                </h2>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                  Company Name
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={settings.companyName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter company name"
                />
              </div>
              <div>
                <label htmlFor="timeZone" className="block text-sm font-medium text-gray-700">
                  Time Zone
                </label>
                <select
                  id="timeZone"
                  name="timeZone"
                  value={settings.timeZone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="UTC">UTC</option>
                  <option value="Eastern Time">Eastern Time</option>
                  <option value="Pacific Time">Pacific Time</option>
                  <option value="Central Time">Central Time</option>
                  <option value="Mountain Time">Mountain Time</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-center">
                <BellIcon className="h-5 w-5 text-gray-400" />
                <h2 className="ml-2 text-lg font-medium text-gray-900">
                  Notification Settings
                </h2>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">
                      Email Notifications
                    </h3>
                    <p className="text-sm text-gray-500">
                      Receive notifications via email
                    </p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="emailNotifications"
                      name="emailNotifications"
                      checked={settings.emailNotifications}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">
                      System Notifications
                    </h3>
                    <p className="text-sm text-gray-500">
                      In-app notification alerts
                    </p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="systemNotifications"
                      name="systemNotifications"
                      checked={settings.systemNotifications}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Evaluation Settings */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-center">
                <ClipboardListIcon className="h-5 w-5 text-gray-400" />
                <h2 className="ml-2 text-lg font-medium text-gray-900">
                  Evaluation Settings
                </h2>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label htmlFor="defaultEvaluationPeriod" className="block text-sm font-medium text-gray-700">
                  Default Evaluation Period
                </label>
                <select
                  id="defaultEvaluationPeriod"
                  name="defaultEvaluationPeriod"
                  value={settings.defaultEvaluationPeriod}
                  onChange={handleInputChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="Quarterly">Quarterly</option>
                  <option value="Semi-Annual">Semi-Annual</option>
                  <option value="Annual">Annual</option>
                </select>
              </div>
              <div>
                <label htmlFor="reviewDeadlineDays" className="block text-sm font-medium text-gray-700">
                  Review Deadline (Days)
                </label>
                <input
                  type="number"
                  id="reviewDeadlineDays"
                  name="reviewDeadlineDays"
                  value={settings.reviewDeadlineDays}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  min="1"
                  max="60"
                />
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-center">
                <ShieldIcon className="h-5 w-5 text-gray-400" />
                <h2 className="ml-2 text-lg font-medium text-gray-900">
                  Security Settings
                </h2>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">
                      Two-Factor Authentication
                    </h3>
                    <p className="text-sm text-gray-500">
                      Require 2FA for all users
                    </p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="twoFactorAuth"
                      name="twoFactorAuth"
                      checked={settings.twoFactorAuth}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="passwordPolicy" className="block text-sm font-medium text-gray-700">
                    Password Policy
                  </label>
                  <select
                    id="passwordPolicy"
                    name="passwordPolicy"
                    value={settings.passwordPolicy}
                    onChange={handleInputChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Strong">Strong</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Settings Button */}
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
                Saving...
              </>
            ) : (
              <>
                <SaveIcon className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
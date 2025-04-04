import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings2Icon, BellIcon, ClipboardListIcon, ShieldIcon } from 'lucide-react';
import { UserRoles } from '../lib/roles';
const SettingsPage: React.FC = () => {
  const {
    user
  } = useAuth();
  if (user?.role !== UserRoles.ADMIN) {
    return <div className="max-w-7xl mx-auto">
      <div className="text-center py-12">
        <h2 className="text-lg font-medium text-gray-900">
          Access Restricted
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          You don't have permission to access this page.
        </p>
      </div>
    </div>;
  }
  return <div className="max-w-7xl mx-auto">
    <div className="mb-6">
      <h1 className="text-2xl font-semibold text-gray-900">
        System Settings
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Manage application settings and configurations
      </p>
    </div>
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
            <label className="text-sm font-medium text-gray-700">
              Company Name
            </label>
            <input type="text" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Enter company name" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Time Zone
            </label>
            <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
              <option>UTC</option>
              <option>Eastern Time</option>
              <option>Pacific Time</option>
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
                <input type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
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
                <input type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
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
            <label className="text-sm font-medium text-gray-700">
              Default Evaluation Period
            </label>
            <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
              <option>Quarterly</option>
              <option>Semi-Annual</option>
              <option>Annual</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Review Deadline (Days)
            </label>
            <input type="number" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Enter number of days" />
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
                <input type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Password Policy
              </label>
              <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                <option>Standard</option>
                <option>Strong</option>
                <option>Custom</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
    {/* Save Settings Button */}
    <div className="mt-6 flex justify-end">
      <button type="button" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        Save Settings
      </button>
    </div>
  </div>;
};
export default SettingsPage;
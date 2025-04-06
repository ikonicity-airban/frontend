import React, { useState } from 'react';
import { 
  ServerIcon, 
  CheckCircleIcon, 
  AlertCircleIcon, 
  MemoryIcon, 
  DatabaseIcon, 
  MailIcon, 
  ActivityIcon, 
  DownloadIcon 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRoles } from '../lib/roles';
import { useSystemHealth } from '../api/admin';
import { format } from 'date-fns';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  service: string;
}

const mockLogs: LogEntry[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    level: 'info',
    message: 'User authentication successful',
    service: 'auth'
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    level: 'warning',
    message: 'High CPU usage detected',
    service: 'system'
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    level: 'error',
    message: 'Failed to connect to email service',
    service: 'email'
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    level: 'info',
    message: 'Database backup completed',
    service: 'database'
  },
  {
    id: '5',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    level: 'info',
    message: 'System started successfully',
    service: 'system'
  }
];

const SystemPage: React.FC = () => {
  const { user } = useAuth();
  const { data: healthData, isLoading: healthLoading } = useSystemHealth();
  const [activeTab, setActiveTab] = useState<'overview' | 'logs'>('overview');
  const [logFilter, setLogFilter] = useState<'all' | 'info' | 'warning' | 'error'>('all');

  const filteredLogs = mockLogs.filter(log => 
    logFilter === 'all' || log.level === logFilter
  );

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
          System Health
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitor system performance and status
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`${
              activeTab === 'overview'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`${
              activeTab === 'logs'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            System Logs
          </button>
        </nav>
      </div>

      {activeTab === 'overview' ? (
        <>
          {/* Status Cards */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">
            <div 
              className={`p-6 rounded-lg ${
                healthLoading
                  ? 'bg-gray-50'
                  : healthData?.status === 'healthy'
                    ? 'bg-green-50'
                    : 'bg-red-50'
              }`}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {healthLoading ? (
                    <ServerIcon className="h-8 w-8 text-gray-400" />
                  ) : healthData?.status === 'healthy' ? (
                    <CheckCircleIcon className="h-8 w-8 text-green-500" />
                  ) : (
                    <AlertCircleIcon className="h-8 w-8 text-red-500" />
                  )}
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">
                    System Status
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {healthLoading
                      ? 'Checking status...'
                      : healthData?.status === 'healthy'
                        ? 'All systems operational'
                        : 'System issues detected'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-indigo-50 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <MemoryIcon className="h-8 w-8 text-indigo-500" />
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">
                    System Uptime
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {healthLoading
                      ? 'Calculating...'
                      : `${Math.floor((healthData?.uptime || 0) / 86400)} days, ${Math.floor(((healthData?.uptime || 0) % 86400) / 3600)} hours`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-6">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Service Status
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <DatabaseIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-sm font-medium text-gray-900">Database</span>
                </div>
                <span 
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    healthLoading
                      ? 'bg-gray-100 text-gray-800'
                      : healthData?.services.database
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                  }`}
                >
                  {healthLoading
                    ? 'Checking...'
                    : healthData?.services.database
                      ? 'Operational'
                      : 'Offline'}
                </span>
              </div>
              <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <MailIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-sm font-medium text-gray-900">Email Service</span>
                </div>
                <span 
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    healthLoading
                      ? 'bg-gray-100 text-gray-800'
                      : healthData?.services.email
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                  }`}
                >
                  {healthLoading
                    ? 'Checking...'
                    : healthData?.services.email
                      ? 'Operational'
                      : 'Offline'}
                </span>
              </div>
              <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <ActivityIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-sm font-medium text-gray-900">Cache Service</span>
                </div>
                <span 
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    healthLoading
                      ? 'bg-gray-100 text-gray-800'
                      : healthData?.services.cache
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                  }`}
                >
                  {healthLoading
                    ? 'Checking...'
                    : healthData?.services.cache
                      ? 'Operational'
                      : 'Offline'}
                </span>
              </div>
            </div>
          </div>

          {/* System Resources */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                System Resources
              </h2>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">CPU Usage</span>
                  <span className="text-sm font-medium text-gray-700">75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: '75%' }}
                  ></div>
                </div>
              </div>
              <div className="mb-6">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Memory Usage</span>
                  <span className="text-sm font-medium text-gray-700">42%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-green-600 h-2.5 rounded-full" 
                    style={{ width: '42%' }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Disk Usage</span>
                  <span className="text-sm font-medium text-gray-700">27%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-purple-600 h-2.5 rounded-full" 
                    style={{ width: '27%' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Logs */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">
                System Logs
              </h2>
              <div className="flex items-center space-x-2">
                <select
                  value={logFilter}
                  onChange={(e) => setLogFilter(e.target.value as any)}
                  className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="all">All Logs</option>
                  <option value="info">Info</option>
                  <option value="warning">Warnings</option>
                  <option value="error">Errors</option>
                </select>
                <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <DownloadIcon className="h-4 w-4 mr-1" />
                  Export
                </button>
              </div>
            </div>
            <div className="overflow-hidden overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Level
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Message
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(log.timestamp), 'MMM dd, yyyy HH:mm:ss')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            log.level === 'info'
                              ? 'bg-blue-100 text-blue-800'
                              : log.level === 'warning'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {log.level}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.service}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.message}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{filteredLogs.length}</span> logs
                </div>
                <div className="flex-1 flex justify-end">
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Load More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SystemPage;

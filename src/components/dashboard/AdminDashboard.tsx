import React from "react";
import { Link } from "react-router-dom";
import {
  UsersIcon,
  CalendarIcon,
  SettingsIcon,
  DownloadIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  ClipboardCheckIcon,
  ServerIcon,
} from "lucide-react";
import {
  useAdminStats,
  useSystemHealth,
  useEvaluationStats,
  useGetCurrentEvaluationSettings,
  useSendReminderEmails,
  useGetEvaluationProgress,
} from "../../api/admin";
import { useNotification } from "../../context/NotificationContext";
import { format } from 'date-fns';

const AdminDashboard: React.FC = () => {
  const { data: adminStats, isLoading: statsLoading } = useAdminStats();
  const { data: healthData, isLoading: healthLoading } = useSystemHealth();
  const { data: evaluationStats, isLoading: evalStatsLoading } =
    useEvaluationStats();
  const { showNotification } = useNotification();
  const { data: currentSettings } = useGetCurrentEvaluationSettings();
  const { mutate: sendReminders } = useSendReminderEmails();
  const { data: progress } = useGetEvaluationProgress();

  // Current quarter calculation (could be fetched from settings in a real app)
  const getCurrentQuarter = () => {
    const now = new Date();
    const quarter = Math.floor(now.getMonth() / 3) + 1;
    return `Q${quarter} ${format(now, 'yyyy')}`;
  };

  // Mock data for recent activities (would come from an API in a real implementation)
  const recentActivities = [
    {
      id: 1,
      user: "Sam HR",
      action: "updated evaluation settings",
      time: "2 hours ago",
    },
    {
      id: 2,
      user: "Alex Admin",
      action: "added new user Jane Smith",
      time: "5 hours ago",
    },
    {
      id: 3,
      user: "Alex Admin",
      action: "generated Q2 report",
      time: "1 day ago",
    },
    {
      id: 4,
      user: "Sam HR",
      action: "modified HR evaluation form",
      time: "2 days ago",
    },
  ];

  // Handler for maintenance notification
  const handleMaintenanceNotify = () => {
    showNotification(
      "info",
      "Email notification about maintenance has been sent to all admins."
    );
  };

  // Handler for sending reminders
  const handleSendReminders = () => {
    sendReminders(undefined, {
      onSuccess: () => {
        showNotification(
          "success",
          "Reminder emails have been sent successfully"
        );
      },
      onError: (error) => {
        showNotification(
          "error",
          "Failed to send reminder emails: " + error.message
        );
      },
    });
  };

  // Add evaluation period info section
  const renderEvaluationPeriodInfo = () => {
    if (!currentSettings) return null;

    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Current Evaluation Period
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Period</h3>
              <p className="mt-1 text-lg text-gray-900">
                {currentSettings.periodName}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Progress</h3>
              <p className="mt-1 text-lg text-gray-900">
                {progress ? (
                  <>
                    {progress.completed} / {progress.totalStaff} Completed
                    ({Math.round((progress.completed / progress.totalStaff) * 100)}
                    %)
                  </>
                ) : (
                  "Loading..."
                )}
              </p>
            </div>
            <div className="sm:col-span-2">
              <h3 className="text-sm font-medium text-gray-500">Deadlines</h3>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500">Self Evaluation</p>
                  <p className="text-sm font-medium text-gray-900">
                    {format(new Date(currentSettings.selfEvaluationDeadline), 'PP')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Lead Review</p>
                  <p className="text-sm font-medium text-gray-900">
                    {format(new Date(currentSettings.leadReviewDeadline), 'PP')}
                  </p>
                </div>
              </div>
            </div>
            <div className="sm:col-span-2">
              <button
                onClick={handleSendReminders}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Send Reminders to Pending Staff
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                <UsersIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Users
                  </dt>
                  <dd className="text-xl font-semibold text-gray-900">
                    {statsLoading ? (
                      <span className="animate-pulse">...</span>
                    ) : (
                      adminStats?.usersCount || 0
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                <ClockIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Evaluations
                  </dt>
                  <dd className="text-xl font-semibold text-gray-900">
                    {evalStatsLoading ? (
                      <span className="animate-pulse">...</span>
                    ) : (
                      evaluationStats?.pending || 0
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <CheckCircleIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Completed
                  </dt>
                  <dd className="text-xl font-semibold text-gray-900">
                    {evalStatsLoading ? (
                      <span className="animate-pulse">...</span>
                    ) : (
                      evaluationStats?.completed || 0
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                <CalendarIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Current Quarter
                  </dt>
                  <dd className="text-xl font-semibold text-gray-900">
                    {currentSettings ? (
                      `Q${currentSettings.quarter} ${currentSettings.year}`
                    ) : (
                      getCurrentQuarter()
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Evaluation Period Info after Summary Cards */}
      {renderEvaluationPeriodInfo()}

      {/* System Status */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">System Status</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div
              className={`p-4 rounded-lg ${healthLoading
                ? "bg-gray-50"
                : healthData?.status === "healthy"
                  ? "bg-green-50"
                  : "bg-yellow-50"
                }`}
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  {healthLoading ? (
                    <ClockIcon className="h-5 w-5 text-gray-400" />
                  ) : healthData?.status === "healthy" ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-400" />
                  ) : (
                    <AlertCircleIcon className="h-5 w-5 text-yellow-400" />
                  )}
                </div>
                <div className="ml-3">
                  <h3
                    className={`text-sm font-medium ${healthLoading
                      ? "text-gray-800"
                      : healthData?.status === "healthy"
                        ? "text-green-800"
                        : "text-yellow-800"
                      }`}
                  >
                    {healthLoading
                      ? "Checking system status..."
                      : healthData?.status === "healthy"
                        ? "All systems operational"
                        : "System needs attention"}
                  </h3>
                  <div
                    className={`mt-2 text-sm ${healthLoading
                      ? "text-gray-700"
                      : healthData?.status === "healthy"
                        ? "text-green-700"
                        : "text-yellow-700"
                      }`}
                  >
                    <p>
                      {healthLoading
                        ? "Please wait..."
                        : healthData?.status === "healthy"
                          ? `The evaluation system is running normally with uptime of ${Math.floor(
                            healthData.uptime / 3600
                          )} hours.`
                          : "There may be some issues with the system. Check the logs for more details."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircleIcon className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Upcoming maintenance
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      System maintenance scheduled for Sunday, 10:00 PM - 12:00
                      AM.
                    </p>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                      onClick={handleMaintenanceNotify}
                    >
                      Notify all users
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Administrative Actions
          </h2>
        </div>
        <div className="p-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/users"
            className="group relative bg-white p-6 focus:outline-none rounded-lg border border-gray-300 hover:border-indigo-500"
          >
            <div>
              <span className="rounded-lg inline-flex p-3 bg-indigo-50 text-indigo-700 ring-4 ring-white">
                <UsersIcon size={24} />
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900">
                Manage Users
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Add, edit, or deactivate user accounts
              </p>
            </div>
          </Link>
          <Link
            to="/timeline"
            className="group relative bg-white p-6 focus:outline-none rounded-lg border border-gray-300 hover:border-indigo-500"
          >
            <div>
              <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-700 ring-4 ring-white">
                <CalendarIcon size={24} />
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900">
                Timeline Management
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Set up quarters and deadlines
              </p>
            </div>
          </Link>
          <Link
            to="/settings"
            className="group relative bg-white p-6 focus:outline-none rounded-lg border border-gray-300 hover:border-indigo-500"
          >
            <div>
              <span className="rounded-lg inline-flex p-3 bg-purple-50 text-purple-700 ring-4 ring-white">
                <SettingsIcon size={24} />
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900">
                System Settings
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Configure system parameters and notifications
              </p>
            </div>
          </Link>
          <Link
            to="/forms"
            className="group relative bg-white p-6 focus:outline-none rounded-lg border border-gray-300 hover:border-indigo-500"
          >
            <div>
              <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-700 ring-4 ring-white">
                <ClipboardCheckIcon size={24} />
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900">
                Form Builder
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Customize evaluation forms and questions
              </p>
            </div>
          </Link>
          <Link
            to="/export"
            className="group relative bg-white p-6 focus:outline-none rounded-lg border border-gray-300 hover:border-indigo-500"
          >
            <div>
              <span className="rounded-lg inline-flex p-3 bg-yellow-50 text-yellow-700 ring-4 ring-white">
                <DownloadIcon size={24} />
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900">
                Export Reports
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Generate and download CSV/PDF reports
              </p>
            </div>
          </Link>
          <Link
            to="/system"
            className="group relative bg-white p-6 focus:outline-none rounded-lg border border-gray-300 hover:border-indigo-500"
          >
            <div>
              <span className="rounded-lg inline-flex p-3 bg-red-50 text-red-700 ring-4 ring-white">
                <ServerIcon size={24} />
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900">
                System Health
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Monitor system performance and logs
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="text-sm font-medium text-indigo-600">
                    {activity.user}
                  </div>
                  <div className="mx-2 text-sm text-gray-500">
                    {activity.action}
                  </div>
                </div>
                <div className="text-sm text-gray-500">{activity.time}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-gray-200">
          <Link
            to="/activity"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            View all activity
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

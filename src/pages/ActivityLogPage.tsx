import React, { useState, useEffect } from 'react';
import { useActivityLogs } from '../api/admin';
import { format, parseISO } from 'date-fns';
import {
  CalendarIcon,
  SearchIcon,
  RefreshCwIcon,
  FilterIcon,
  UserIcon,
  FileTextIcon,
  SettingsIcon,
  UsersIcon,
  ClipboardCheckIcon,
  ActivityIcon
} from 'lucide-react';

// Helper function to get icon for entity type
const getEntityIcon = (entityType: string) => {
  switch (entityType.toLowerCase()) {
    case 'user':
      return <UserIcon className="h-5 w-5 text-blue-500" />;
    case 'evaluation':
      return <ClipboardCheckIcon className="h-5 w-5 text-green-500" />;
    case 'setting':
      return <SettingsIcon className="h-5 w-5 text-purple-500" />;
    case 'report':
      return <FileTextIcon className="h-5 w-5 text-yellow-500" />;
    case 'team':
      return <UsersIcon className="h-5 w-5 text-indigo-500" />;
    default:
      return <ActivityIcon className="h-5 w-5 text-gray-500" />;
  }
};

const ITEMS_PER_PAGE = 10;

const ActivityLogPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [entityTypeFilter, setEntityTypeFilter] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);

  // Prepare date range when filter changes
  useEffect(() => {
    const now = new Date();
    let start: Date | undefined;
    let end: Date | undefined = now;

    switch (dateRange) {
      case 'today':
        start = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'yesterday':
        start = new Date(now);
        start.setDate(start.getDate() - 1);
        start.setHours(0, 0, 0, 0);
        end = new Date(now);
        end.setDate(end.getDate() - 1);
        end.setHours(23, 59, 59, 999);
        break;
      case 'week':
        start = new Date(now);
        start.setDate(start.getDate() - 7);
        break;
      case 'month':
        start = new Date(now);
        start.setMonth(start.getMonth() - 1);
        break;
      case 'custom':
        // Custom range is handled by the date inputs
        return;
      case 'all':
      default:
        start = undefined;
        end = undefined;
        break;
    }

    setStartDate(start ? start.toISOString() : undefined);
    setEndDate(end ? end.toISOString() : undefined);
  }, [dateRange]);

  // Get activity logs based on current filters
  const { data: activityLogs, isLoading, refetch } = useActivityLogs({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    entityType: entityTypeFilter || undefined,
    startDate,
    endDate
  });

  const handleSearch = () => {
    setCurrentPage(1);
    // The search would typically be implemented on the backend
    // For now, we'll just refetch the data
    refetch();
  };

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    if (activityLogs && activityLogs.total > currentPage * ITEMS_PER_PAGE) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const formatDateTime = (dateTimeStr: string) => {
    try {
      return format(parseISO(dateTimeStr), 'MMM d, yyyy h:mm a');
    } catch (error) {
      return dateTimeStr;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Activity Log</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track all system activities and user actions
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-6 py-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="search"
                className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>

            <select
              className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              value={entityTypeFilter}
              onChange={(e) => setEntityTypeFilter(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="user">User</option>
              <option value="evaluation">Evaluation</option>
              <option value="setting">Setting</option>
              <option value="report">Report</option>
              <option value="team">Team</option>
            </select>

            <select
              className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="custom">Custom Range</option>
            </select>

            {dateRange === 'custom' && (
              <div className="flex space-x-2 items-center">
                <label className="text-sm text-gray-700">From:</label>
                <input
                  type="date"
                  className="rounded-md border-gray-300 py-2 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : undefined;
                    setStartDate(date?.toISOString());
                  }}
                />
                <label className="text-sm text-gray-700">To:</label>
                <input
                  type="date"
                  className="rounded-md border-gray-300 py-2 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : undefined;
                    if (date) {
                      date.setHours(23, 59, 59, 999);
                      setEndDate(date.toISOString());
                    } else {
                      setEndDate(undefined);
                    }
                  }}
                />
              </div>
            )}

            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ml-auto"
            >
              <RefreshCwIcon className="h-4 w-4 mr-2" />
              Refresh
            </button>

            <button
              type="button"
              onClick={handleSearch}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FilterIcon className="h-4 w-4 mr-2" />
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Activity Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {isLoading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">Loading activities...</p>
            </div>
          ) : !activityLogs || activityLogs.data.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-sm text-gray-500">No activities found.</p>
            </div>
          ) : (
            activityLogs.data.map((activity) => (
              <li key={activity.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getEntityIcon(activity.entityType)}
                      <p className="ml-2 text-sm font-medium text-indigo-600 truncate">
                        {activity.userName}
                      </p>
                      <p className="ml-2 text-sm text-gray-500">
                        {activity.action}
                        {activity.entityType && (
                          <span className="ml-1">
                            ({activity.entityType}
                            {activity.entityId && ` #${activity.entityId}`})
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="h-5 w-5 text-gray-400 mr-1.5" />
                      <p className="text-sm text-gray-500">
                        {formatDateTime(activity.createdAt)}
                      </p>
                    </div>
                  </div>
                  {activity.details && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 whitespace-pre-line">
                        {activity.details}
                      </p>
                    </div>
                  )}
                </div>
              </li>
            ))
          )}
        </ul>

        {/* Pagination */}
        {activityLogs && activityLogs.total > 0 && (
          <nav
            className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
            aria-label="Pagination"
          >
            <div className="hidden sm:block">
              <p className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">
                  {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                </span>{' '}
                to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * ITEMS_PER_PAGE, activityLogs.total)}
                </span>{' '}
                of <span className="font-medium">{activityLogs.total}</span> results
              </p>
            </div>
            <div className="flex-1 flex justify-between sm:justify-end">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={activityLogs.total <= currentPage * ITEMS_PER_PAGE}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </nav>
        )}
      </div>
    </div>
  );
};

export default ActivityLogPage;

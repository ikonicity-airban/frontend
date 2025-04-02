import React, { useState } from 'react';
import { BarChart2Icon, DownloadIcon, FilterIcon, RefreshCwIcon } from 'lucide-react';
const ReportsPage: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState('performance');
  const [dateRange, setDateRange] = useState('quarter');
  return <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and generate evaluation reports
        </p>
      </div>
      {/* Report Controls */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-6 py-4">
          <div className="flex flex-wrap gap-4">
            <select value={selectedReport} onChange={e => setSelectedReport(e.target.value)} className="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
              <option value="performance">Performance Report</option>
              <option value="evaluation">Evaluation Status</option>
              <option value="department">Department Overview</option>
              <option value="compliance">Compliance Report</option>
            </select>
            <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
              <option value="quarter">Current Quarter</option>
              <option value="year">Past Year</option>
              <option value="custom">Custom Range</option>
            </select>
            <button type="button" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <FilterIcon className="h-4 w-4 mr-2" />
              Filters
            </button>
            <button type="button" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <RefreshCwIcon className="h-4 w-4 mr-2" />
              Refresh
            </button>
            <button type="button" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <DownloadIcon className="h-4 w-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>
      </div>
      {/* Report Content */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            {selectedReport === 'performance' && 'Performance Overview'}
            {selectedReport === 'evaluation' && 'Evaluation Status'}
            {selectedReport === 'department' && 'Department Overview'}
            {selectedReport === 'compliance' && 'Compliance Status'}
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center">
                <BarChart2Icon className="h-6 w-6 text-indigo-600" />
                <h3 className="ml-2 text-lg font-medium text-gray-900">
                  Average Rating
                </h3>
              </div>
              <p className="mt-2 text-3xl font-semibold text-gray-900">4.2/5</p>
              <p className="mt-1 text-sm text-gray-500">
                Across all evaluations
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center">
                <BarChart2Icon className="h-6 w-6 text-green-600" />
                <h3 className="ml-2 text-lg font-medium text-gray-900">
                  Completion Rate
                </h3>
              </div>
              <p className="mt-2 text-3xl font-semibold text-gray-900">85%</p>
              <p className="mt-1 text-sm text-gray-500">For current quarter</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center">
                <BarChart2Icon className="h-6 w-6 text-yellow-600" />
                <h3 className="ml-2 text-lg font-medium text-gray-900">
                  Pending Reviews
                </h3>
              </div>
              <p className="mt-2 text-3xl font-semibold text-gray-900">12</p>
              <p className="mt-1 text-sm text-gray-500">Awaiting completion</p>
            </div>
          </div>
          {/* Placeholder for charts and detailed data */}
          <div className="mt-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg h-96 flex items-center justify-center">
            <p className="text-gray-500">
              Chart/Data visualization would appear here
            </p>
          </div>
        </div>
      </div>
    </div>;
};
export default ReportsPage;
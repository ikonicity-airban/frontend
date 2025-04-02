import React from 'react';
import { Link } from 'react-router-dom';
import { ClipboardCheckIcon, UserIcon, AlertCircleIcon, CheckCircleIcon, BarChartIcon } from 'lucide-react';
// Mock data
const pendingEvaluations = [{
  id: '201',
  employeeName: 'Alice Johnson',
  teamLead: 'John Manager',
  quarter: 'Q3 2023',
  submittedDate: '2023-08-12',
  status: 'pending_hr'
}, {
  id: '202',
  employeeName: 'Charlie Brown',
  teamLead: 'John Manager',
  quarter: 'Q3 2023',
  submittedDate: '2023-08-10',
  status: 'pending_hr'
}];
const recentlyProcessedEvaluations = [{
  id: '203',
  employeeName: 'Diana Prince',
  teamLead: 'Sarah Leader',
  quarter: 'Q3 2023',
  processedDate: '2023-08-05',
  status: 'pending_director'
}, {
  id: '204',
  employeeName: 'Bob Smith',
  teamLead: 'Sarah Leader',
  quarter: 'Q2 2023',
  processedDate: '2023-05-18',
  status: 'completed'
}];
const HRDashboard: React.FC = () => {
  return <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                <UserIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Staff
                  </dt>
                  <dd className="text-xl font-semibold text-gray-900">32</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                <AlertCircleIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Pending Reviews
                  </dt>
                  <dd className="text-xl font-semibold text-gray-900">
                    {pendingEvaluations.length}
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
                    Completed Q3
                  </dt>
                  <dd className="text-xl font-semibold text-gray-900">18</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                <BarChartIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Completion Rate
                  </dt>
                  <dd className="text-xl font-semibold text-gray-900">56%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Pending HR Reviews */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">
            Pending HR Reviews
          </h2>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            {pendingEvaluations.length} Pending
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Team Lead
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quarter
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted Date
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingEvaluations.map(evaluation => <tr key={evaluation.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {evaluation.employeeName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {evaluation.teamLead}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {evaluation.quarter}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {evaluation.submittedDate}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/evaluation/${evaluation.id}`} className="text-indigo-600 hover:text-indigo-900">
                      Review
                    </Link>
                  </td>
                </tr>)}
              {pendingEvaluations.length === 0 && <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    No pending evaluations
                  </td>
                </tr>}
            </tbody>
          </table>
        </div>
      </div>
      {/* Recently Processed */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Recently Processed
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Team Lead
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quarter
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Processed Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentlyProcessedEvaluations.map(evaluation => <tr key={evaluation.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {evaluation.employeeName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {evaluation.teamLead}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {evaluation.quarter}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {evaluation.processedDate}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${evaluation.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                      {evaluation.status === 'completed' ? 'Completed' : 'Director Review'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/evaluation/${evaluation.id}`} className="text-indigo-600 hover:text-indigo-900">
                      View
                    </Link>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
        </div>
        <div className="p-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Link to="/reports/compliance" className="group relative bg-white p-6 focus:outline-none rounded-lg border border-gray-300 hover:border-indigo-500">
            <div>
              <span className="rounded-lg inline-flex p-3 bg-indigo-50 text-indigo-700 ring-4 ring-white">
                <ClipboardCheckIcon size={24} />
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900">
                Compliance Report
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Generate quarterly compliance reports
              </p>
            </div>
          </Link>
          <Link to="/reports/attendance" className="group relative bg-white p-6 focus:outline-none rounded-lg border border-gray-300 hover:border-indigo-500">
            <div>
              <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-700 ring-4 ring-white">
                <UserIcon size={24} />
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900">
                Attendance Overview
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                View department attendance statistics
              </p>
            </div>
          </Link>
          <Link to="/reports/performance" className="group relative bg-white p-6 focus:outline-none rounded-lg border border-gray-300 hover:border-indigo-500">
            <div>
              <span className="rounded-lg inline-flex p-3 bg-purple-50 text-purple-700 ring-4 ring-white">
                <BarChartIcon size={24} />
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900">
                Performance Metrics
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Analyze team and individual performance
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>;
};
export default HRDashboard;
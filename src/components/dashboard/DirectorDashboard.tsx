import React from 'react';
import { Link } from 'react-router-dom';
import { ClipboardCheckIcon, UserIcon, BarChartIcon, TrendingUpIcon, UsersIcon } from 'lucide-react';
const pendingDecisions = [{
  id: '301',
  employeeName: 'Diana Prince',
  department: 'Marketing',
  quarter: 'Q3 2023',
  hrReviewDate: '2023-08-05',
  status: 'pending_director'
}, {
  id: '302',
  employeeName: 'Bruce Wayne',
  department: 'Engineering',
  quarter: 'Q3 2023',
  hrReviewDate: '2023-08-02',
  status: 'pending_director'
}];
const departmentPerformance = [{
  department: 'Marketing',
  employeeCount: 12,
  avgScore: 4.2,
  improvementRate: '+5%'
}, {
  department: 'Engineering',
  employeeCount: 18,
  avgScore: 4.5,
  improvementRate: '+8%'
}, {
  department: 'Finance',
  employeeCount: 8,
  avgScore: 4.0,
  improvementRate: '+2%'
}, {
  department: 'Customer Support',
  employeeCount: 15,
  avgScore: 3.8,
  improvementRate: '+4%'
}];
const DirectorDashboard: React.FC = () => {
  return <div className="space-y-6">
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
                    Total Staff
                  </dt>
                  <dd className="text-xl font-semibold text-gray-900">53</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                <ClipboardCheckIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Pending Decisions
                  </dt>
                  <dd className="text-xl font-semibold text-gray-900">
                    {pendingDecisions.length}
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
                <BarChartIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Avg Performance
                  </dt>
                  <dd className="text-xl font-semibold text-gray-900">4.2/5</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                <TrendingUpIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    YoY Improvement
                  </dt>
                  <dd className="text-xl font-semibold text-gray-900">+6.5%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Pending Final Decisions */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">
            Pending Final Decisions
          </h2>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            {pendingDecisions.length} Pending
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
                  Department
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quarter
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  HR Review Date
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingDecisions.map(decision => <tr key={decision.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {decision.employeeName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {decision.department}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {decision.quarter}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {decision.hrReviewDate}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/evaluation/${decision.id}`} className="text-indigo-600 hover:text-indigo-900">
                      Review & Decide
                    </Link>
                  </td>
                </tr>)}
              {pendingDecisions.length === 0 && <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    No pending decisions
                  </td>
                </tr>}
            </tbody>
          </table>
        </div>
      </div>
      {/* Department Performance */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Department Performance Overview
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Staff Count
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg. Score
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Improvement
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {departmentPerformance.map((dept, index) => <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {dept.department}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {dept.employeeCount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {dept.avgScore}/5
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-green-600 font-medium">
                      {dept.improvementRate}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/department/${dept.department.toLowerCase()}`} className="text-indigo-600 hover:text-indigo-900">
                      Details
                    </Link>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
      {/* Strategic Actions */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Strategic Actions
          </h2>
        </div>
        <div className="p-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Link to="/strategic/talent-review" className="group relative bg-white p-6 focus:outline-none rounded-lg border border-gray-300 hover:border-indigo-500">
            <div>
              <span className="rounded-lg inline-flex p-3 bg-indigo-50 text-indigo-700 ring-4 ring-white">
                <UsersIcon size={24} />
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900">
                Talent Review
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Identify high performers and leadership potential
              </p>
            </div>
          </Link>
          <Link to="/strategic/performance-analysis" className="group relative bg-white p-6 focus:outline-none rounded-lg border border-gray-300 hover:border-indigo-500">
            <div>
              <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-700 ring-4 ring-white">
                <BarChartIcon size={24} />
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900">
                Performance Analysis
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Review organizational performance trends
              </p>
            </div>
          </Link>
          <Link to="/strategic/succession-planning" className="group relative bg-white p-6 focus:outline-none rounded-lg border border-gray-300 hover:border-indigo-500">
            <div>
              <span className="rounded-lg inline-flex p-3 bg-purple-50 text-purple-700 ring-4 ring-white">
                <TrendingUpIcon size={24} />
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900">
                Succession Planning
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Develop succession plans for key positions
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>;
};
export default DirectorDashboard;
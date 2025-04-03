import React from "react";
import { Link } from "react-router-dom";
import { ClipboardCheckIcon, ClockIcon } from "lucide-react";
import ProgressTracker from "../common/ProgressTracker";
import { useEvaluations } from "../../api/evaluations";

const currentEvaluation = {
  id: "1",
  quarter: "Q3 2023",
  status: "team_lead_review",
  dueDate: "2023-09-30",
};

const previousEvaluations = [
  {
    id: "2",
    quarter: "Q2 2023",
    status: "completed",
    finalGrade: "Exceeds Expectations",
  },
  {
    id: "3",
    quarter: "Q1 2023",
    status: "completed",
    finalGrade: "Meets Expectations",
  },
  {
    id: "4",
    quarter: "Q4 2022",
    status: "completed",
    finalGrade: "Meets Expectations",
  },
];

const StaffDashboard: React.FC = () => {
  const { data: evaluations } = useEvaluations();
  console.log("🚀 ~ evaluations:", evaluations);

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Current Evaluation Status
          </h2>
        </div>
        <div className="p-6">
          {currentEvaluation ? (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="text-sm font-medium text-gray-500">
                    Quarter
                  </div>
                  <div className="mt-1 text-lg font-semibold">
                    {currentEvaluation.quarter}
                  </div>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <div className="text-sm font-medium text-gray-500">
                    Due Date
                  </div>
                  <div className="mt-1 text-lg font-semibold">
                    {currentEvaluation.dueDate}
                  </div>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <div className="text-sm font-medium text-gray-500">
                    Status
                  </div>
                  <div className="mt-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      In Progress
                    </span>
                  </div>
                </div>
              </div>
              <ProgressTracker currentStatus={currentEvaluation.status} />
              <div>
                <Link
                  to={`/evaluation/${currentEvaluation.id}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <ClipboardCheckIcon size={16} className="mr-2" />
                  View Evaluation
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <ClipboardCheckIcon size={40} className="mx-auto text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No active evaluation
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                You don't have any active evaluation for this quarter.
              </p>
              <div className="mt-6">
                <Link
                  to="/evaluation/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Start New Evaluation
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Previous Evaluations
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {evaluations && evaluations.length > 0 ? (
            previousEvaluations.map((evaluation) => (
              <div
                key={evaluation.id}
                className="px-6 py-4 flex items-center justify-between"
              >
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {evaluation.quarter}
                  </div>
                  <div className="text-sm text-gray-500">
                    Final Grade: {evaluation.finalGrade}
                  </div>
                </div>
                <Link
                  to={`/evaluation/${evaluation.id}`}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  View Details
                </Link>
              </div>
            ))
          ) : (
            <div className="px-6 py-4 text-center text-sm text-gray-500">
              No previous evaluations found
            </div>
          )}
        </div>
      </div>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Quick Links</h2>
        </div>
        <div className="p-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Link
            to="/evaluation/new"
            className="group relative bg-white p-6 focus:outline-none rounded-lg border border-gray-300 hover:border-indigo-500"
          >
            <div>
              <span className="rounded-lg inline-flex p-3 bg-indigo-50 text-indigo-700 ring-4 ring-white">
                <ClipboardCheckIcon size={24} />
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900">
                Start Self-Evaluation
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Begin your quarterly self-assessment and performance review
              </p>
            </div>
          </Link>
          <Link
            to="/history"
            className="group relative bg-white p-6 focus:outline-none rounded-lg border border-gray-300 hover:border-indigo-500"
          >
            <div>
              <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-700 ring-4 ring-white">
                <ClockIcon size={24} />
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900">
                Evaluation History
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                View all your past evaluations and performance trends
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default StaffDashboard;

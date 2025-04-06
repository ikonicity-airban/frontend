import { ClipboardCheckIcon, ClockIcon, CalendarIcon, FileTextIcon } from "lucide-react";
import { useEvaluations } from "../../api/evaluations";
import { useEvaluationSettings } from "../../hooks/useEvaluationSettings";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProgressTracker from "../common/ProgressTracker";
import React from "react";
import { Evaluation, EvaluationStatus } from "../../api/types";

const StaffDashboard: React.FC = () => {
  const { data: allEvaluations, isLoading } = useEvaluations();
  const { currentSetting, isDeadlinePassed, getDeadlineForRole } =
    useEvaluationSettings();

  const [previousEvaluations, setPreviousEvaluations] = useState<Evaluation[]>([]);
  const [currentEvaluation, setCurrentEvaluation] = useState<Evaluation | null>(null);

  // Get the staff deadline
  const staffDeadline = getDeadlineForRole("STAFF");
  const isStaffDeadlinePassed = isDeadlinePassed("STAFF");

  // Helper function to get grade color class
  const getGradeColorClass = (grade?: string) => {
    if (!grade) return 'text-gray-600';

    switch (grade.toUpperCase()) {
      case 'A':
        return 'text-green-600';
      case 'B':
        return 'text-blue-600';
      case 'C':
        return 'text-yellow-600';
      case 'D':
        return 'text-orange-600';
      case 'F':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  // Process evaluations
  useEffect(() => {
    if (allEvaluations) {
      // Extract current evaluation (if any)
      const currentEval = allEvaluations.find(e => e.status === EvaluationStatus.PENDING_STAFF);
      setCurrentEvaluation(currentEval || null);

      // Filter previous completed evaluations
      const completed = allEvaluations.filter(
        (evaluation) => evaluation.status === "COMPLETED" || evaluation.directorReview?.finalGrade
      );

      // Sort by completion date (newest first)
      const sorted = [...completed].sort((a, b) => {
        const dateA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
        const dateB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
        return dateB - dateA;
      });

      setPreviousEvaluations(sorted);
    }
  }, [allEvaluations]);

  return (
    <div className="space-y-6">
      {/* Evaluation Period Info Card */}
      {/* <CurrentPeriodInfo className="bg-white shadow" /> */}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Current Evaluation Status
          </h2>
        </div>
        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">Loading evaluation status...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {currentEvaluation ? (
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <div className="text-sm font-medium text-gray-500">
                      Quarter
                    </div>
                    <div className="mt-1 text-lg font-semibold">
                      {currentEvaluation.period}
                    </div>
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <div className="text-sm font-medium text-gray-500">
                      Due Date
                    </div>
                    <div className="mt-1 text-lg font-semibold">
                      {staffDeadline
                        ? new Date(staffDeadline).toLocaleDateString()
                        : currentEvaluation.completedAt}
                      {isStaffDeadlinePassed && (
                        <span className="ml-2 text-sm text-red-600">
                          (Deadline passed)
                        </span>
                      )}
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
              ) : (
                <div className="text-center py-6">
                  <ClipboardCheckIcon size={40} className="mx-auto text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No active evaluation
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {currentSetting
                      ? `The current evaluation period is ${currentSetting.periodName}. Please start your self-evaluation.`
                      : "You don't have any active evaluation for this quarter."}
                  </p>
                  {currentSetting && (
                    <div className="mt-6">
                      <Link
                        to="/evaluation/new"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Start New Evaluation
                      </Link>
                    </div>
                  )}
                </div>
              )}
              {currentEvaluation && (
                <>
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
                </>
              )}
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
        {isLoading ? (
          <div className="px-6 py-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Loading evaluations...</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {previousEvaluations && previousEvaluations.length > 0 ? (
              previousEvaluations.map((evaluation) => (
                <div
                  key={evaluation.id}
                  className="px-6 py-5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <CalendarIcon size={18} className="text-indigo-500 mr-2" />
                        <h3 className="text-md font-medium text-gray-900">
                          {evaluation.period}
                        </h3>
                      </div>
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <div className="text-xs text-gray-500">Completed On</div>
                          <div className="text-sm">
                            {evaluation.completedAt
                              ? new Date(evaluation.completedAt).toLocaleDateString()
                              : "Not completed"}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Final Grade</div>
                          <div className={`text-sm font-bold ${getGradeColorClass(evaluation.directorReview?.finalGrade)}`}>
                            {evaluation.directorReview?.finalGrade || "Pending"}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Status</div>
                          <div className="text-sm">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Completed
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Link
                      to={`/evaluation/${evaluation.id}`}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <FileTextIcon size={16} className="mr-2" />
                      View Details
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center">
                <FileTextIcon size={40} className="mx-auto text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No previous evaluations
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  You don't have any completed evaluations yet.
                </p>
              </div>
            )}
          </div>
        )}
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
              {staffDeadline && (
                <p
                  className={`mt-1 text-sm ${isStaffDeadlinePassed
                      ? "text-red-500 font-bold"
                      : "text-green-500"
                    }`}
                >
                  Due by: {new Date(staffDeadline).toLocaleDateString()}
                  {isStaffDeadlinePassed ? " (Overdue)" : ""}
                </p>
              )}
            </div>
          </Link>
          <Link
            to="/evaluations"
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

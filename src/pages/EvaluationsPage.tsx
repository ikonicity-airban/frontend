import React, { useState } from "react";
import { useEvaluations } from "../api/evaluations";
import { Link } from "react-router-dom";
import { ClipboardCheckIcon, PlusCircleIcon, EyeIcon, CheckCircleIcon, ClockIcon } from "lucide-react";
import { EvaluationStatus } from "../api/types";
import { useAuth } from "../context/AuthContext";
import { UserRoles } from "../lib/roles";

const statusColors: Record<EvaluationStatus, string> = {
  [EvaluationStatus.PENDING_STAFF]: "bg-yellow-100 text-yellow-800",
  [EvaluationStatus.SUBMITTED_BY_STAFF]: "bg-blue-100 text-blue-800",
  [EvaluationStatus.REVIEWED_BY_LEAD]: "bg-indigo-100 text-indigo-800",
  [EvaluationStatus.REVIEWED_BY_HR]: "bg-purple-100 text-purple-800",
  [EvaluationStatus.PENDING_DIRECTOR_REVIEW]: "bg-purple-100 text-purple-800",
  [EvaluationStatus.COMPLETED]: "bg-green-100 text-green-800",
};

const statusIcons: Record<EvaluationStatus, React.ReactNode> = {
  [EvaluationStatus.PENDING_STAFF]: <ClockIcon size={16} className="text-yellow-600" />,
  [EvaluationStatus.SUBMITTED_BY_STAFF]: <ClipboardCheckIcon size={16} className="text-blue-600" />,
  [EvaluationStatus.REVIEWED_BY_LEAD]: <EyeIcon size={16} className="text-indigo-600" />,
  [EvaluationStatus.REVIEWED_BY_HR]: <EyeIcon size={16} className="text-purple-600" />,
  [EvaluationStatus.PENDING_DIRECTOR_REVIEW]: <ClockIcon size={16} className="text-purple-600" />,
  [EvaluationStatus.COMPLETED]: <CheckCircleIcon size={16} className="text-green-600" />,
};

const statusLabels: Record<EvaluationStatus, string> = {
  [EvaluationStatus.PENDING_STAFF]: "Pending Staff",
  [EvaluationStatus.SUBMITTED_BY_STAFF]: "Submitted by Staff",
  [EvaluationStatus.REVIEWED_BY_LEAD]: "Reviewed by Lead",
  [EvaluationStatus.REVIEWED_BY_HR]: "Reviewed by HR",
  [EvaluationStatus.PENDING_DIRECTOR_REVIEW]: "Pending Director Review",
  [EvaluationStatus.COMPLETED]: "Completed",
};

const EvaluationsPage: React.FC = () => {
  const { data: evaluations, isLoading, error } = useEvaluations();
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<EvaluationStatus | "all">("all");
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mt-4">
        Error loading evaluations. Please try again later.
      </div>
    );
  }

  const filteredEvaluations = statusFilter === "all" 
    ? evaluations 
    : evaluations?.filter(evaluation => evaluation.status === statusFilter);

  const canCreateEvaluation = user?.role === UserRoles.STAFF;

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Evaluations</h1>
          <p className="text-gray-600 mt-1">View and manage all your evaluations</p>
        </div>
        {canCreateEvaluation && (
          <Link
            to="/evaluation/new"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2"
          >
            <PlusCircleIcon size={18} />
            New Evaluation
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-100">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-full text-sm font-medium ${
              statusFilter === "all" ? "bg-indigo-100 text-indigo-800" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          {Object.values(EvaluationStatus).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 ${
                statusFilter === status ? statusColors[status] : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {statusIcons[status]}
              {statusLabels[status]}
            </button>
          ))}
        </div>
      </div>

      {/* Evaluations List */}
      {filteredEvaluations?.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-gray-100">
          <ClipboardCheckIcon size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No evaluations found</h3>
          <p className="text-gray-600">
            {statusFilter !== "all" 
              ? `You don't have any evaluations with status "${statusLabels[statusFilter as EvaluationStatus]}"`
              : "You don't have any evaluations yet"}
          </p>
          {canCreateEvaluation && (
            <Link
              to="/evaluation/new"
              className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              <PlusCircleIcon size={16} className="mr-2" />
              Create your first evaluation
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEvaluations?.map((evaluation) => (
                <tr key={evaluation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {evaluation.id.toString().substring(0, 8) + '...'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {evaluation.period || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        statusColors[evaluation.status]
                      }`}
                    >
                      {statusIcons[evaluation.status]}
                      <span className="ml-1.5">{statusLabels[evaluation.status]}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(evaluation.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(evaluation.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/evaluation/${evaluation.id}`}
                      className="text-indigo-600 hover:text-indigo-900 flex items-center justify-end gap-1"
                    >
                      <EyeIcon size={16} />
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EvaluationsPage;

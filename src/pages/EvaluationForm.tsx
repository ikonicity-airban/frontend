import { CheckCircleIcon, SaveIcon, XCircleIcon } from "lucide-react";
import {
  LetterGrade,
  SelfEvaluationValues,
  selfEvaluationSchema,
} from "../types/evaluation";
import { useEvaluation, useSelfEvaluation } from "../api/evaluations";
import { useNavigate, useParams } from "react-router-dom";

import { EvaluationStatus } from "../api/types";
import ProgressTracker from "../components/common/ProgressTracker";
import React from "react";
import { SelfEvaluation } from "../components/forms/SelfEvaluation";
import { UserRoles } from "../lib/roles";
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { useNotification } from "../context/NotificationContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { TeamLeadEvaluation } from "../components/forms/TeamLeadEvaluation";
import { HREvaluation } from "../components/forms/HREvaluation";
import { DirectorEvaluation } from "../components/forms/DirectorEvaluation";

const GRADE_OPTIONS: LetterGrade[] = ["A", "B+", "B-", "C", "D", "F"];

const EvaluationForm: React.FC = () => {
  const { id } = useParams<{
    id: string;
  }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const isNewEvaluation = id === "new";

  const { data: evaluation } = useEvaluation(id ?? "");
  const selfEvaluation = useSelfEvaluation();
  // const { mutateAsync: sendNotification } = useSendEvaluationNotification();

  const canEditSelfEvaluation =
    user &&
    user?.role === UserRoles.STAFF &&
    (isNewEvaluation || evaluation?.status === EvaluationStatus.PENDING_STAFF);
  const canEditTeamLeadEvaluation =
    evaluation &&
    user?.role === UserRoles.LEAD &&
    evaluation?.status == EvaluationStatus.SUBMITTED_BY_STAFF;
  const canEditHREvaluation =
    user?.role === UserRoles.HR &&
    evaluation?.status === EvaluationStatus.REVIEWED_BY_LEAD;
  const canEditDirectorEvaluation =
    user?.role === UserRoles.DIRECTOR &&
    evaluation?.status === EvaluationStatus.PENDING_DIRECTOR_REVIEW;

  const { showNotification } = useNotification();

  // Use the useForm hook with the Zod schema
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SelfEvaluationValues>({
    resolver: zodResolver(selfEvaluationSchema),
    defaultValues: evaluation?.selfEvaluation,
  });

  // Handle form submission
  const onSubmit = async (data: SelfEvaluationValues) => {
    try {
      await selfEvaluation.mutateAsync(data);
      // ...rest of submission logic...
      showNotification("success", "Self-evaluation saved successfully!");
      setSuccessMessage("Self-evaluation saved successfully!");
      setErrorMessage("");
      if (evaluation?.status === EvaluationStatus.PENDING_STAFF) {
        navigate(`/evaluation/${evaluation.id}`);
      }
    } catch (error) {
      // ...error handling...
      showNotification("error", "Failed to save self-evaluation.");
      setErrorMessage("Failed to save self-evaluation.");
      setSuccessMessage("");
    }
  };

  if (!isNewEvaluation && !evaluation) return null;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          {isNewEvaluation
            ? "New Evaluation"
            : `Evaluation: ${evaluation?.period}`}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {isNewEvaluation
            ? "Complete your self-evaluation for the current quarter"
            : `Status: ${evaluation?.status.replace(/_/g, " ").toUpperCase()}`}
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 rounded-md flex items-center">
          <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2" />
          <span className="text-green-800">{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-50 rounded-md flex items-center">
          <XCircleIcon className="h-5 w-5 text-red-400 mr-2" />
          <span className="text-red-800">{errorMessage}</span>
        </div>
      )}
      {!isNewEvaluation && evaluation && (
        <div className="mb-6 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Evaluation Progress
          </h2>
          <ProgressTracker currentStatus={evaluation?.status} />
        </div>
      )}

      {/* Evaluation */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Employee Information
            </h2>
          </div>
          <div className="p-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="employeeName"
                className="block text-sm font-medium text-gray-700"
              >
                Employee Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="employeeName"
                  id="employeeName"
                  value={user?.name}
                  readOnly
                  disabled
                  className="shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 border-[1px] rounded-md bg-gray-50"
                />
              </div>
            </div>
            <div className="sm:col-span-3">
              <label
                htmlFor="position"
                className="block text-sm font-medium text-gray-700"
              >
                Position
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="position"
                  id="position"
                  value={user?.role || "-"}
                  readOnly
                  disabled
                  className="shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 border-[1px] rounded-md bg-gray-50"
                />
              </div>
            </div>
            <div className="sm:col-span-3">
              <label
                htmlFor="department"
                className="block text-sm font-medium text-gray-700"
              >
                Department
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="department"
                  id="department"
                  value={user?.department}
                  readOnly
                  disabled
                  className="shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 border-[1px] rounded-md bg-gray-50"
                />
              </div>
            </div>
            <div className="sm:col-span-3">
              <label
                htmlFor="quarter"
                className="block text-sm font-medium text-gray-700"
              >
                Evaluation Quarter
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="quarter"
                  id="quarter"
                  value={evaluation?.period}
                  readOnly
                  disabled
                  className="shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 border-[1px] rounded-md bg-gray-50"
                />
              </div>
            </div>
          </div>
        </div>
        {
          //#region Self Evaluation
        }
        {/* Self Evaluation begins */}
        <SelfEvaluation
          register={register}
          errors={errors}
          canEdit={!!canEditSelfEvaluation}
          gradeOptions={GRADE_OPTIONS}
        />

        {(user?.role == UserRoles.STAFF) && (
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="py-2 px-4 border border-gray-300 border-[1px] rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSubmit}
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <SaveIcon className="h-5 w-5 mr-2" />
              Save Evaluation
            </button>
          </div>
        )}
      </form>

      {(user?.role === UserRoles.LEAD ||
        user?.role === UserRoles.HR ||
        user?.role === UserRoles.DIRECTOR) && (
        <TeamLeadEvaluation
          defaultValues={evaluation?.leadReview}
          canEdit={!!canEditTeamLeadEvaluation}
          setErrorMessage={setErrorMessage}
          setSuccessMessage={setSuccessMessage}
        />
      )}
      {(user?.role === UserRoles.HR || user?.role === UserRoles.DIRECTOR) && (
        <HREvaluation
          defaultValues={evaluation?.hrReview}
          canEdit={canEditHREvaluation}
          setErrorMessage={setErrorMessage}
          setSuccessMessage={setSuccessMessage}
        />
      )}
      {user?.role === UserRoles.DIRECTOR && (
        <DirectorEvaluation
          defaultValues={evaluation?.directorReview}
          canEdit={canEditDirectorEvaluation}
          gradeOptions={GRADE_OPTIONS}
          setErrorMessage={setErrorMessage}
          setSuccessMessage={setSuccessMessage}
        />
      )}
    </div>
  );
};
export default EvaluationForm;

import { } from "../api/notifications";

import { CheckCircleIcon, SaveIcon, XCircleIcon } from "lucide-react";
import {
  EvaluationFormValues,
  LetterGrade,
  evaluationSchema,
} from "../types/evaluation";
import { useCreateEvaluation, useEvaluation } from "../api/evaluations";
import { useNavigate, useParams } from "react-router-dom";

import { EvaluationStatus } from "../api/types";
import ProgressTracker from "../components/common/ProgressTracker";
import React from "react";
import { SelfEvaluation } from "../components/forms/SelfEvaluation";
import { UserRoles } from "../lib/roles";
import { getFullName } from "../lib/util";
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { useNotification } from "../context/NotificationContext";
import { zodResolver } from "@hookform/resolvers/zod";

const GRADE_OPTIONS: LetterGrade[] = ["A", "B+", "B-", "C", "D", "F"] as const;

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
  console.log("🚀 ~ evaluation:", evaluation)


  const { mutateAsync: createEvaluation } = useCreateEvaluation();
  // const { mutateAsync: sendNotification } = useSendEvaluationNotification();

  const canEditSelfEvaluation =
    user &&
    user?.role === UserRoles.EMPLOYEE &&
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
  } = useForm<EvaluationFormValues>({
    resolver: zodResolver(evaluationSchema),
    defaultValues: evaluation,
  });

  // Function to calculate the suggested final grade
  const getPointsFromGrade = (grade: LetterGrade): number => {
    const gradePoints: Record<LetterGrade, number> = {
      A: 4.0,
      "B+": 3.5,
      "B-": 2.8,
      C: 2.0,
      D: 1.0,
      F: 0.0,
    };
    return gradePoints[grade] || 0;
  };

  const getGradeFromPoints = (points: number): LetterGrade => {
    if (points >= 3.7) return "A";
    if (points >= 3.3) return "B+";
    if (points >= 2.7) return "B-";
    if (points >= 2.0) return "C";
    if (points >= 1.0) return "D";
    return "F";
  };

  // Handle form submission
  const onSubmit = async (data: EvaluationFormValues) => {
    try {
      // Calculate grades
      const teamLeadAvg =
        (data.teamLeadEvaluation.performanceRating +
          data.teamLeadEvaluation.teamworkRating +
          data.teamLeadEvaluation.leadershipRating) /
        3;
      const hrAvg =
        (data.hrEvaluation.attendanceRating +
          data.hrEvaluation.complianceRating) /
        2;
      const selfEvalPoints = getPointsFromGrade(
        data.selfEvaluation.overallSelfGrade
      );
      const suggestedGrade = getGradeFromPoints(
        (selfEvalPoints + teamLeadAvg + hrAvg) / 3
      );

      if (canEditDirectorEvaluation) {
        setValue("directorEvaluation.finalGrade", suggestedGrade);
      }

      // Save evaluation
      const savedEvaluation = await createEvaluation(data);

      // Send notifications based on status
      if (
        isNewEvaluation ||
        evaluation?.status === EvaluationStatus.PENDING_STAFF
      ) {
        await sendNotification({
          evaluationId: savedEvaluation.id,
          type: "EVALUATION_SUBMITTED",
          recipientRole: "LEAD",
          message: "New evaluation submitted for review",
        });
      }

      setSuccessMessage("Evaluation saved successfully!");
      showNotification("success", "Evaluation saved successfully!");
      setErrorMessage("");

      // Redirect after short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      setErrorMessage("Failed to save evaluation. Please try again.");
      setSuccessMessage("");
      console.error("Evaluation submission error:", error);
    }
  };

  if (!evaluation) return null;

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
      {!isNewEvaluation && (
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
                  value={
                    isNewEvaluation
                      ? getFullName(user)
                      : evaluation?.staff.name
                  }
                  readOnly
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md bg-gray-50"
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
                  value={
                    isNewEvaluation
                      ? user?.role
                      : evaluation?.staff.role
                  }
                  readOnly
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md bg-gray-50"
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
                  value={evaluation?.staff.teamId}
                  readOnly
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md bg-gray-50"
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
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md bg-gray-50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Self Evaluation begins */}
        <SelfEvaluation
          register={register}
          errors={errors}
          canEdit={!!canEditSelfEvaluation}
          gradeOptions={GRADE_OPTIONS}
        />

        {(user?.role === UserRoles.LEAD ||
          user?.role === UserRoles.HR ||
          user?.role === UserRoles.DIRECTOR ||
          user?.role === UserRoles.ADMIN ||
          evaluation?.status !== EvaluationStatus.PENDING_STAFF) && (
            <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Team Lead Evaluation
                </h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label
                    htmlFor="performanceRating"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Overall Performance Rating
                  </label>
                  <select
                    id="performanceRating"
                    disabled={!canEditTeamLeadEvaluation}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    {...register("teamLeadEvaluation.performanceRating")}
                  >
                    <option value={0}>Select Rating</option>
                    <option value={1}>1 - Needs Improvement</option>
                    <option value={2}>2 - Developing</option>
                    <option value={3}>3 - Meets Expectations</option>
                    <option value={4}>4 - Exceeds Expectations</option>
                    <option value={5}>5 - Outstanding</option>
                  </select>
                  {errors.teamLeadEvaluation?.performanceRating && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.teamLeadEvaluation.performanceRating.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="strengthsWeaknesses"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Strengths and Areas for Improvement
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="strengthsWeaknesses"
                      rows={4}
                      disabled={!canEditTeamLeadEvaluation}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Describe the employee's strengths and areas that need improvement"
                      {...register("teamLeadEvaluation.strengthsWeaknesses")}
                    />
                    {errors.teamLeadEvaluation?.strengthsWeaknesses && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.teamLeadEvaluation.strengthsWeaknesses.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="teamworkRating"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Teamwork & Collaboration Rating
                    </label>
                    <select
                      id="teamworkRating"
                      disabled={!canEditTeamLeadEvaluation}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      {...register("teamLeadEvaluation.teamworkRating")}
                    >
                      <option value={0}>Select Rating</option>
                      <option value={1}>1 - Needs Improvement</option>
                      <option value={2}>2 - Developing</option>
                      <option value={3}>3 - Meets Expectations</option>
                      <option value={4}>4 - Exceeds Expectations</option>
                      <option value={5}>5 - Outstanding</option>
                    </select>
                    {errors.teamLeadEvaluation?.teamworkRating && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.teamLeadEvaluation.teamworkRating.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="leadershipRating"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Leadership Potential Rating
                    </label>
                    <select
                      id="leadershipRating"
                      disabled={!canEditTeamLeadEvaluation}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      {...register("teamLeadEvaluation.leadershipRating")}
                    >
                      <option value={0}>Select Rating</option>
                      <option value={1}>1 - Needs Improvement</option>
                      <option value={2}>2 - Developing</option>
                      <option value={3}>3 - Meets Expectations</option>
                      <option value={4}>4 - Exceeds Expectations</option>
                      <option value={5}>5 - Outstanding</option>
                    </select>
                    {errors.teamLeadEvaluation?.leadershipRating && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.teamLeadEvaluation.leadershipRating.message}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="promotionRecommendation"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Promotion Recommendation
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="promotionRecommendation"
                      rows={3}
                      disabled={!canEditTeamLeadEvaluation}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Provide your recommendation regarding promotion potential"
                      {...register("teamLeadEvaluation.promotionRecommendation")}
                    />
                    {errors.teamLeadEvaluation?.promotionRecommendation && (
                      <p className="text-red-500 text-sm mt-1">
                        {
                          errors.teamLeadEvaluation.promotionRecommendation
                            .message
                        }
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

        {/* HR */}
        {(user?.role === UserRoles.HR ||
          user?.role === UserRoles.LEAD ||
          user?.role === UserRoles.ADMIN ||
          evaluation?.status === EvaluationStatus.REVIEWED_BY_LEAD ||
          evaluation?.status === EvaluationStatus.COMPLETED) && (
            <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  HR Evaluation
                </h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="attendanceRating"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Attendance & Punctuality Rating
                    </label>
                    <select
                      id="attendanceRating"
                      disabled={!canEditHREvaluation}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      {...register("hrEvaluation.attendanceRating")}
                    >
                      <option value={0}>Select Rating</option>
                      <option value={1}>1 - Needs Improvement</option>
                      <option value={2}>2 - Developing</option>
                      <option value={3}>3 - Meets Expectations</option>
                      <option value={4}>4 - Exceeds Expectations</option>
                      <option value={5}>5 - Outstanding</option>
                    </select>
                    {errors.hrEvaluation?.attendanceRating && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.hrEvaluation.attendanceRating.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="complianceRating"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Policy Compliance Rating
                    </label>
                    <select
                      id="complianceRating"
                      disabled={!canEditHREvaluation}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      {...register("hrEvaluation.complianceRating")}
                    >
                      <option value={0}>Select Rating</option>
                      <option value={1}>1 - Needs Improvement</option>
                      <option value={2}>2 - Developing</option>
                      <option value={3}>3 - Meets Expectations</option>
                      <option value={4}>4 - Exceeds Expectations</option>
                      <option value={5}>5 - Outstanding</option>
                    </select>
                    {errors.hrEvaluation?.complianceRating && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.hrEvaluation.complianceRating.message}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="disciplinaryNotes"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Disciplinary Notes
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="disciplinaryNotes"
                      rows={3}
                      disabled={!canEditHREvaluation}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Document any disciplinary actions or concerns"
                      {...register("hrEvaluation.disciplinaryNotes")}
                    />
                    {errors.hrEvaluation?.disciplinaryNotes && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.hrEvaluation.disciplinaryNotes.message}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="trainingRecommendations"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Training & Development Recommendations
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="trainingRecommendations"
                      rows={3}
                      disabled={!canEditHREvaluation}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Recommend training or development opportunities"
                      {...register("hrEvaluation.trainingRecommendations")}
                    />
                    {errors.hrEvaluation?.trainingRecommendations && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.hrEvaluation.trainingRecommendations.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

        {/* Director */}
        {(user?.role === UserRoles.DIRECTOR ||
          user?.role === UserRoles.ADMIN ||
          evaluation?.status === EvaluationStatus.PENDING_DIRECTOR_REVIEW ||
          evaluation?.status === EvaluationStatus.COMPLETED) && (
            <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Director Evaluation
                </h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label
                    htmlFor="strategicAlignmentRating"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Strategic Alignment Rating
                  </label>
                  <select
                    id="strategicAlignmentRating"
                    disabled={!canEditDirectorEvaluation}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    {...register("directorEvaluation.strategicAlignmentRating")}
                  >
                    <option value={0}>Select Rating</option>
                    <option value={1}>1 - Needs Improvement</option>
                    <option value={2}>2 - Developing</option>
                    <option value={3}>3 - Meets Expectations</option>
                    <option value={4}>4 - Exceeds Expectations</option>
                    <option value={5}>5 - Outstanding</option>
                  </select>
                  {errors.directorEvaluation?.strategicAlignmentRating && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.directorEvaluation.strategicAlignmentRating.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="finalGrade"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Final Grade
                  </label>
                  <select
                    id="finalGrade"
                    disabled={!canEditDirectorEvaluation}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    {...register("directorEvaluation.finalGrade")}
                  >
                    <option value="">Select Final Grade</option>
                    {GRADE_OPTIONS.map((grade) => (
                      <option key={grade} value={grade}>
                        {grade}
                      </option>
                    ))}
                  </select>
                  {errors.directorEvaluation?.finalGrade && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.directorEvaluation.finalGrade.message}
                    </p>
                  )}
                  <p className="mt-1 text-sm text-gray-500">
                    Final grade based on all evaluations and assessments
                  </p>
                </div>
                <div>
                  <label
                    htmlFor="comments"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Director Comments
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="comments"
                      rows={4}
                      disabled={!canEditDirectorEvaluation}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Provide final comments and feedback"
                      {...register("directorEvaluation.comments")}
                    />
                    {errors.directorEvaluation?.comments && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.directorEvaluation.comments.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <SaveIcon className="h-5 w-5 mr-2" />
            Save Evaluation
          </button>
        </div>
      </form>
    </div>
  );
};
export default EvaluationForm;

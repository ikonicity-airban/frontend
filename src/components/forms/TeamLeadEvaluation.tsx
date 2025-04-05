import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { SaveIcon } from "lucide-react";
import {
  TeamLeadEvaluationValues,
  teamLeadEvaluationSchema,
} from "../../types/evaluation";
import { useLeadEvaluation } from "../../api/evaluations";

interface TeamLeadEvaluationProps {
  defaultValues?: TeamLeadEvaluationValues;
  canEdit: boolean;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setSuccessMessage: React.Dispatch<React.SetStateAction<string>>;
}

export const TeamLeadEvaluation = ({
  defaultValues,
  canEdit,
  setErrorMessage,
  setSuccessMessage,
}: TeamLeadEvaluationProps) => {
  const teamLeadReview = useLeadEvaluation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TeamLeadEvaluationValues>({
    resolver: zodResolver(teamLeadEvaluationSchema),
    defaultValues,
  });

  const onFormSubmit = handleSubmit((data) => {
    teamLeadReview.mutate(data, {
      onSuccess: () => {
        setSuccessMessage("Team lead evaluation submitted successfully");
        navigate("/dashboard");
      },
      onError: (error) => {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "An error occurred while submitting the evaluation"
        );
      },
    });
  });

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
      <div className="px-6 py-5 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">
          Team Lead Evaluation
        </h2>
      </div>
      <div className="p-6 space-y-6">
        {/* Rating select */}
        <div>
          <label
            htmlFor="performanceRating"
            className="block text-sm font-medium text-gray-700"
          >
            Overall Performance Rating
          </label>
          <select
            id="performanceRating"
            disabled={!canEdit}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            {...register("performanceRating")}
          >
            {/* ...existing options... */}
          </select>
          {errors.performanceRating && (
            <p className="text-red-500 text-sm mt-1">
              {errors.performanceRating.message}
            </p>
          )}
        </div>
        {/* ...existing fields... */} {/* TextArea fields */}
        {(
          [
            "performanceRating",
            "strengthsWeaknesses",
            "teamworkRating",
            "leadershipRating",
          ] as const
        ).map((field) => (
          <div key={field}>
            <label
              htmlFor={field}
              className="block text-sm font-medium text-gray-700"
            >
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <div className="mt-1">
              <textarea
                id={field}
                rows={4}
                disabled={!canEdit}
                placeholder={"Describe the employee's " + field}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-500 rounded-md p-4"
                {...register(field, {
                  disabled: !canEdit,
                })}
              />
              {errors[field] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[field]?.message}
                </p>
              )}
            </div>
          </div>
        ))}
        {canEdit && (
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              onClick={onFormSubmit}
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <SaveIcon className="h-5 w-5 mr-2" />
              Save Team Lead Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

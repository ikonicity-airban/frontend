import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HREvaluationValues, hrEvaluationSchema } from "../../types/evaluation";
import { useNavigate } from "react-router-dom";
import { SaveIcon } from "lucide-react";
import { useHREvaluation } from "../../api/evaluations";

interface HREvaluationProps {
  defaultValues?: HREvaluationValues;
  canEdit: boolean;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setSuccessMessage: React.Dispatch<React.SetStateAction<string>>;
}

export const HREvaluation = ({ defaultValues, canEdit }: HREvaluationProps) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<HREvaluationValues>({
    resolver: zodResolver(hrEvaluationSchema),
    defaultValues,
  });

  const hrReview = useHREvaluation();
  /* 
  attendanceRating: ZodNumber;
    complianceRating: ZodNumber;
    disciplinaryNotes: ZodString;
    trainingRecommendations: ZodString;
  */

  const onFormSubmit = handleSubmit(async (data) => {
    try {
      await hrReview.mutateAsync(data);
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to submit HR evaluation:", error);
    }
  });

  return (
    <form
      onSubmit={onFormSubmit}
      className="bg-white shadow rounded-lg overflow-hidden mb-6"
    >
      <div className="px-6 py-5 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">HR Evaluation</h2>
      </div>
      <div className="p-6 space-y-6">
        {/* ...existing fields... */}{" "}
        {(
          [
            "attendanceRating",
            "complianceRating",
            "disciplinaryNotes",
            "trainingRecommendations",
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
        {/* Rating select */}
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
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <SaveIcon className="h-5 w-5 mr-2" />
              Save HR Review
            </button>
          </div>
        )}
      </div>
    </form>
  );
};

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HREvaluationValues, hrEvaluationSchema } from "../../types/evaluation";
import { useNavigate } from "react-router-dom";
import { SaveIcon } from "lucide-react";

interface HREvaluationProps {
  defaultValues?: HREvaluationValues;
  canEdit: boolean;
  onSubmit: (data: HREvaluationValues) => void;
}

export const HREvaluation = ({
  defaultValues,
  canEdit,
  onSubmit,
}: HREvaluationProps) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<HREvaluationValues>({
    resolver: zodResolver(hrEvaluationSchema),
    defaultValues,
  });

  const onFormSubmit = handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
      <div className="px-6 py-5 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">HR Evaluation</h2>
      </div>
      <div className="p-6 space-y-6">
        {/* ...existing fields... */}
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
              Save HR Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

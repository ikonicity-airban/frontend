import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { SaveIcon } from "lucide-react";
import {
  DirectorEvaluationValues,
  directorEvaluationSchema,
} from "../../types/evaluation";
import { useDirectorEvaluation, useEvaluation } from "../../api/evaluations";

interface DirectorEvaluationProps {
  defaultValues?: DirectorEvaluationValues;
  canEdit: boolean;
  gradeOptions: string[];
  onSubmit: (data: DirectorEvaluationValues) => void;
}

export const DirectorEvaluation = ({
  defaultValues,
  canEdit,
  gradeOptions,
  onSubmit,
}: DirectorEvaluationProps) => {
  const navigate = useNavigate();

  const directorEvaluation = useDirectorEvaluation();

  // Function to calculate points from grade
  const getPointsFromGrade = (grade: string): number => {
    const gradePoints: Record<string, number> = {
      A: 4.0,
      "B+": 3.5,
      "B-": 2.8,
      C: 2.0,
      D: 1.0,
      F: 0.0,
    };
    return gradePoints[grade] || 0;
  };

  // Function to calculate grade from points
  const getGradeFromPoints = (points: number): string => {
    if (points >= 3.7) return "A";
    if (points >= 3.3) return "B+";
    if (points >= 2.7) return "B-";
    if (points >= 2.0) return "C";
    if (points >= 1.0) return "D";
    return "F";
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DirectorEvaluationValues>({
    resolver: zodResolver(directorEvaluationSchema),
    defaultValues,
  });

  const onFormSubmit = handleSubmit((data) => {
    directorEvaluation.mutate(data);
  });

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
      <div className="px-6 py-5 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">
          Director Evaluation
        </h2>
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
              Save Director Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

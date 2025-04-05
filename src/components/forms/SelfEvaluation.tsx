import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import {
  EvaluationFormValues,
  LetterGrade,
  SelfEvaluationValues,
} from "../../types/evaluation";

interface SelfEvaluationProps {
  register: UseFormRegister<SelfEvaluationValues>;
  errors: FieldErrors<EvaluationFormValues>;
  canEdit: boolean;
  gradeOptions: LetterGrade[];
}

export const SelfEvaluation: React.FC<SelfEvaluationProps> = ({
  register,
  errors,
  canEdit,
  gradeOptions,
}) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
      <div className="px-6 py-5 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Self Evaluation</h2>
      </div>
      <div className="p-6 space-y-6">
        {/* TextArea fields */}
        {(["achievements", "challenges", "goals"] as const).map((field) => (
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
                placeholder={"Describe your " + field}
                className="shadow-sm focus:ring-indigo-500 border-[1px] focus:border-indigo-500 block w-full sm:text-sm border-gray-200 rounded-md p-4"
                {...register(field, {
                  disabled: !canEdit,
                })}
              />
              {errors.selfEvaluation?.[field] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.selfEvaluation[field]?.message}
                </p>
              )}
            </div>
          </div>
        ))}

        {/* Grade selections */}
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              "skillsGrade",
              "communicationGrade",
              "initiativeGrade",
              "overallSelfGrade",
            ] as const
          ).map((field) => (
            <div key={field}>
              <label
                htmlFor={field}
                className="block text-sm font-medium text-gray-700"
              >
                {field.replace("Grade", "")} Grade
              </label>
              <select
                id={field}
                disabled={!canEdit}
                className="mt-1 block w-full py-2 px-3 border border-gray-200 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                {...register(field, {
                  disabled: !canEdit,
                })}
              >
                <option value="">Select Grade</option>
                {gradeOptions.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
              {errors.selfEvaluation?.[field] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.selfEvaluation[field]?.message}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

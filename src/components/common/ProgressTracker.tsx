import { CheckCircleIcon, Circle } from "lucide-react";

import { EvaluationStatus } from "../../api/types";
import React from "react";

interface ProgressTrackerProps {
  currentStatus: EvaluationStatus;
}
const steps: {
  id: EvaluationStatus | "DRAFT";
  name: string;
  description: string;
}[] = [
  {
    id: EvaluationStatus.PENDING_STAFF,
    name: "Summitted by Staff",
    description: "Evaluation draft",
  },
  {
    id: EvaluationStatus.SUBMITTED_BY_STAFF,
    name: "Team Lead",
    description: "Performance review",
  },
  {
    id: EvaluationStatus.REVIEWED_BY_LEAD,
    name: "HR Review",
    description: "Compliance check",
  },
  {
    id: EvaluationStatus.PENDING_DIRECTOR_REVIEW,
    name: "Director Review",
    description: "Final decision",
  },
  {
    id: EvaluationStatus.COMPLETED,
    name: "Completed",
    description: "Process finished",
  },
];

const statusOrder: Record<EvaluationStatus, number> = {
  PENDING_STAFF: 0,
  SUBMITTED_BY_STAFF: 0,
  REVIEWED_BY_HR: 1,
  REVIEWED_BY_LEAD: 2,
  COMPLETED: 3,
};

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ currentStatus }) => {
  const currentStep = statusOrder[currentStatus];
  console.log("🚀 ~ currentStep:", currentStep);
  return (
    <div className="py-6">
      <nav aria-label="Progress">
        <ol className="overflow-hidden">
          {steps.map((step, stepIdx) => {
            const stepStatus = statusOrder[step.id as EvaluationStatus];
            let status: "complete" | "current" | "upcoming" = "upcoming";
            if (currentStep > stepStatus) {
              status = "complete";
            } else if (currentStep === stepStatus) {
              status = "current";
            }
            return (
              <li
                key={step.name}
                className={`relative ${
                  stepIdx !== steps.length - 1 ? "pb-8" : ""
                }`}
              >
                {stepIdx !== steps.length - 1 ? (
                  <div
                    className={`absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5 ${
                      status === "complete" ? "bg-indigo-600" : "bg-gray-300"
                    }`}
                    aria-hidden="true"
                  />
                ) : null}
                <div className="group relative flex items-start">
                  <span className="flex h-9 items-center">
                    {status === "complete" ? (
                      <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600">
                        <CheckCircleIcon
                          className="h-5 w-5 text-white"
                          aria-hidden="true"
                        />
                      </span>
                    ) : status === "current" ? (
                      <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-indigo-600 bg-white">
                        <Circle
                          className="h-5 w-5 text-indigo-600"
                          aria-hidden="true"
                        />
                      </span>
                    ) : (
                      <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white">
                        <Circle
                          className="h-5 w-5 text-gray-300"
                          aria-hidden="true"
                        />
                      </span>
                    )}
                  </span>
                  <div className="ml-4 min-w-0 flex flex-col">
                    <span
                      className={`text-sm font-medium ${
                        status === "complete"
                          ? "text-indigo-600"
                          : status === "current"
                          ? "text-indigo-600"
                          : "text-gray-500"
                      }`}
                    >
                      {step.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {step.description}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};
export default ProgressTracker;

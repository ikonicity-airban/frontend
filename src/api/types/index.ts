import { UserRoles } from "../../lib/roles";
import { EvaluationFormValues, EvaluationStatus } from "../../types/evaluation";

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRoles;
  department: string;
  position: string;
  evaluations?: Evaluation[]; // Assuming a one-to-many relationship
  reviewedEvaluations?: Evaluation[];
  hrReviewedEvaluations?: Evaluation[];
  directorReviewedEvaluations?: Evaluation[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
}

export type Evaluation = {
  id: number;
  staff: User; // Assuming User type exists
  teamLead: User; // Assuming User type exists
  hrUser: User; // Assuming User type exists
  director: User; // Assuming User type exists
  period: string;
  status: EvaluationStatus;
  selfEvaluation: EvaluationFormValues["selfEvaluation"];
  leadReview: EvaluationFormValues["teamLeadEvaluation"];
  hrReview: EvaluationFormValues["hrEvaluation"];
  directorReview: EvaluationFormValues["directorEvaluation"];
  createdAt: Date;
  updatedAt: Date | null;
  leadReviewedAt: Date | null;
  hrReviewedAt: Date | null;
  directorReviewedAt: Date | null;
  completedAt: Date | null;
};

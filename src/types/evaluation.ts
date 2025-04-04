import { z } from "zod";

export type LetterGrade = "A" | "B+" | "B-" | "C" | "D" | "F";
export type Rating = number | 0 | 1 | 2 | 3 | 4 | 5;

export interface EvaluationBase {
  id: string;
  staffId: string;
  period: string;
  status: EvaluationStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum EvaluationStatus {
  PENDING_STAFF = "PENDING_STAFF",
  // Add other status values as needed
}

// Self Evaluation
export interface SelfEvaluationValues {
  communicationGrade: LetterGrade;
  initiativeGrade: LetterGrade;
  overallSelfGrade: LetterGrade;
  skillsGrade: LetterGrade;
  achievements: string;
  challenges: string;
  goals: string;
}

// Team Lead Evaluation
export interface TeamLeadEvaluationValues {
  performanceRating: Rating;
  strengthsWeaknesses: string;
  teamworkRating: Rating;
  leadershipRating: Rating;
  promotionRecommendation: string;
}

// HR Evaluation
export interface HREvaluationValues {
  attendanceRating: Rating;
  complianceRating: Rating;
  disciplinaryNotes: string;
  trainingRecommendations: string;
}

// Director Evaluation
export interface DirectorEvaluationValues {
  strategicAlignmentRating: Rating;
  finalGrade: LetterGrade;
  comments: string;
}

export interface EvaluationFormValues extends EvaluationBase {
  selfEvaluation: SelfEvaluationValues;
  selfEvaluationSubmittedAt: Date | null;
  teamLeadId: string | null;
  leadReview: TeamLeadEvaluationValues | null;
  leadReviewedAt: Date | null;
  hrUserId: string | null;
  hrReview: HREvaluationValues | null;
  hrReviewedAt: Date | null;
  directorId: string | null;
  directorDecision: DirectorEvaluationValues | null;
  directorDecisionAt: Date | null;
}

// Zod schemas
export const selfEvaluationSchema = z.object({
  communicationGrade: z.enum(["A", "B+", "B-", "C", "D", "F"]),
  initiativeGrade: z.enum(["A", "B+", "B-", "C", "D", "F"]),
  overallSelfGrade: z.enum(["A", "B+", "B-", "C", "D", "F"]),
  skillsGrade: z.enum(["A", "B+", "B-", "C", "D", "F"]),
  achievements: z.string(),
  challenges: z.string(),
  goals: z.string(),
});

export const teamLeadEvaluationSchema = z.object({
  performanceRating: z.number().min(0).max(5),
  strengthsWeaknesses: z.string(),
  teamworkRating: z.number().min(0).max(5),
  leadershipRating: z.number().min(0).max(5),
  promotionRecommendation: z.string(),
});

export const hrEvaluationSchema = z.object({
  attendanceRating: z.number().min(0).max(5),
  complianceRating: z.number().min(0).max(5),
  disciplinaryNotes: z.string(),
  trainingRecommendations: z.string(),
});

export const directorEvaluationSchema = z.object({
  strategicAlignmentRating: z.number().min(0).max(5),
  finalGrade: z.enum(["A", "B+", "B-", "C", "D", "F"]),
  comments: z.string(),
});

export const evaluationSchema = z.object({
  id: z.string().uuid(),
  staffId: z.string(),
  period: z.string(),
  status: z.nativeEnum(EvaluationStatus),
  selfEvaluation: selfEvaluationSchema.nullable(),
  selfEvaluationSubmittedAt: z.date().nullable(),
  teamLeadId: z.string().nullable(),
  leadReview: teamLeadEvaluationSchema.nullable(),
  leadReviewedAt: z.date().nullable(),
  hrUserId: z.string().nullable(),
  hrReview: hrEvaluationSchema.nullable(),
  hrReviewedAt: z.date().nullable(),
  directorId: z.string().nullable(),
  directorDecision: directorEvaluationSchema.nullable(),
  directorDecisionAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

import { z } from "zod";

export const letterGrade = ["A", "B+", "B-", "C", "D", "F"] as const;
export type LetterGrade = (typeof letterGrade)[number];

export const evaluationSchema = z.object({
  selfEvaluation: z.object({
    achievements: z.string(),
    challenges: z.string(),
    goals: z.string(),
    skillsGrade: z.enum(letterGrade).nullable(),
    communicationGrade: z.enum(letterGrade),
    initiativeGrade: z.enum(letterGrade),
    overallSelfGrade: z.enum(letterGrade),
  }),

  teamLeadEvaluation: z.object({
    performanceRating: z.number(),
    strengthsWeaknesses: z.string(),
    teamworkRating: z.number(),
    leadershipRating: z.number(),
    promotionRecommendation: z.string(),
  }),
  hrEvaluation: z.object({
    attendanceRating: z.number(),
    complianceRating: z.number(),
    disciplinaryNotes: z.string(),
    trainingRecommendations: z.string(),
  }),
  directorEvaluation: z.object({
    strategicAlignmentRating: z.number(),
    finalGrade: z.enum(letterGrade),
    comments: z.string(),
  }),
});

export type EvaluationFormValues = z.infer<typeof evaluationSchema>;

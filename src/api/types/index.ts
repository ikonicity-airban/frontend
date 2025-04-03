// src/types/index.ts

import { UserRoles } from "../../lib/roles";

// Enum types (matching backend)
export enum UserRole {
  STAFF = "STAFF",
  LEAD = "LEAD",
  HR = "HR",
  DIRECTOR = "DIRECTOR",
  ADMIN = "ADMIN",
  EMPLOYEE = "EMPLOYEE",
}

export enum EvaluationStatus {
  PENDING_STAFF = "PENDING_STAFF",
  PENDING_LEAD_REVIEW = "PENDING_LEAD_REVIEW",
  PENDING_HR_REVIEW = "PENDING_HR_REVIEW",
  PENDING_DIRECTOR_REVIEW = "PENDING_DIRECTOR_REVIEW",
  COMPLETED = "COMPLETED",
}

// User types
export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  role: UserRoles;
  teamId?: string;
  teamLead?: User;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserRoleDto {
  role: string;
}

// Evaluation related types
export interface Evaluation {
  id: number;
  staff: User;
  teamLead?: User;
  hrUser?: User;
  director?: User;
  period: string;
  status: EvaluationStatus;
  selfEvaluation?: SelfEvaluationDto;
  leadReview?: LeadReviewDto;
  hrReview?: HrReviewDto;
  directorReview?: DirectorReviewDto;
  createdAt: string;
  updatedAt: string;
  leadReviewedAt?: string;
  hrReviewedAt?: string;
  directorReviewedAt?: string;
  completedAt?: string;
}

export interface CreateEvaluationDto {
  staffId: string;
  teamLeadId?: string;
  period: string;
}

export interface UpdateEvaluationDto {
  teamLeadId?: string;
  status?: EvaluationStatus;
}

export interface SelfEvaluationDto {
  achievements: string;
  challenges: string;
  goals: string;
  skillsGrade: string;
  communicationGrade: string;
  initiativeGrade: string;
  overallSelfGrade: string;
}

export interface LeadReviewDto {
  performanceRating: number;
  strengthsWeaknesses: string;
  teamworkRating: number;
  leadershipRating: number;
  promotionRecommendation: string;
}

export interface HrReviewDto {
  attendanceRating: number;
  complianceRating: number;
  disciplinaryNotes: string;
  trainingRecommendations: string;
}

export interface DirectorReviewDto {
  strategicAlignmentRating: number;
  finalGrade: string;
  comments: string;
}

// Notifications related types
export interface Notification {
  id: string;
  recipient: User;
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationPreference {
  userId: string;
  emailEnabled: boolean;
  reminderFrequency: "DAILY" | "WEEKLY" | "NONE";
}

export interface EvaluationNotificationDto {
  to: string;
  employeeName: string;
  evaluationDate: Date;
}

export interface EvaluationCompleteDto {
  to: string;
  employeeName: string;
  reviewerId: string;
}

export interface EvaluationReminderDto {
  to: string;
  reviewerName: string;
  employeeName: string;
  dueDate: Date;
}

// Admin related types
export interface DeadlinesDto {
  startDate: string;
  endDate: string;
}

export interface EvaluationStats {
  total: number;
  completed: number;
  pending: number;
  pendingByStatus?: Record<EvaluationStatus, number>;
}

export interface AdminStats {
  usersCount: number;
  evaluationsCount: number;
  notificationsCount: number;
}

export interface SystemHealth {
  status: string;
  uptime: number;
}

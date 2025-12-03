/**
 * TypeScript types for Recruitsss application
 * Based on Django backend models
 */

export type UserRole = "CANDIDATE" | "RECRUITER" | "ADMIN";
export type UserStatus = "PENDING" | "ACTIVE" | "SUSPENDED" | "DELETED";

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
  is_active: boolean;
}

export interface Candidate {
  id: string;
  user?: User;
  email: string;
  full_name: string;
  bio?: string;
  skills: string[];
  experience_years: number;
  education?: string;
  desired_salary_min?: number;
  desired_salary_max?: number;
  salary_currency: string;
  available_from?: string;
  location?: string;
  is_available: boolean;
  cv_url?: string;
  cv_filename?: string;
  cv_uploaded_at?: string;
  profile_picture_url?: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  profile_completeness: number;
  created_at: string;
  updated_at: string;
}

export interface Recruiter {
  id: string;
  user?: User;
  email: string;
  full_name: string;
  company_name: string;
  company_description?: string;
  company_logo_url?: string;
  website?: string;
  company_size?: string;
  industry?: string;
  location?: string;
  payment_status: "PENDING" | "ACTIVE" | "EXPIRED" | "SUSPENDED";
  subscription_valid_until?: string;
  verified: boolean;
  is_subscription_valid: boolean;
  created_at: string;
  updated_at: string;
}

export type ContractType =
  | "CDI"
  | "CDD"
  | "FREELANCE"
  | "INTERNSHIP"
  | "APPRENTICESHIP";
export type ExperienceLevel = "JUNIOR" | "INTERMEDIATE" | "SENIOR" | "EXPERT";
export type JobStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "CLOSED"
  | "ARCHIVED"
  | "REJECTED";
export type SalaryPeriod = "HOURLY" | "MONTHLY" | "YEARLY";

export interface JobOffer {
  id: string;
  recruiter: string;
  recruiter_info?: {
    company_name: string;
    company_logo: string;
    verified: boolean;
  };
  title: string;
  description: string;
  requirements?: string;
  responsibilities?: string;
  salary_min?: number;
  salary_max?: number;
  salary_currency: string;
  salary_period?: SalaryPeriod;
  contract_type: ContractType;
  location?: string;
  is_remote: boolean;
  skills_required: string[];
  experience_level?: ExperienceLevel;
  education_required?: string;
  status: JobStatus;
  rejection_reason?: string;
  published_at?: string;
  expires_at?: string;
  closed_at?: string;
  views_count: number;
  applications_count: number;
  is_active: boolean;
  days_remaining?: number;
  created_at: string;
  updated_at: string;
}

export type ApplicationStatus =
  | "SUBMITTED"
  | "VIEWED"
  | "SHORTLISTED"
  | "INTERVIEW_SCHEDULED"
  | "REJECTED"
  | "ACCEPTED"
  | "WITHDRAWN";

export interface Application {
  id: string;
  candidate: string;
  candidate_info?: {
    full_name: string;
    email: string;
    profile_completeness: number;
  };
  job_offer: string;
  job_info?: {
    title: string;
    company_name: string;
  };
  cover_letter?: string;
  status: ApplicationStatus;
  match_score?: number;
  recruiter_notes?: string;
  interview_date?: string;
  applied_at: string;
  updated_at: string;
  viewed_at?: string;
  responded_at?: string;
}

export type NotificationType =
  | "ACCOUNT_CREATED"
  | "APPLICATION_SUBMITTED"
  | "APPLICATION_STATUS_CHANGED"
  | "NEW_MESSAGE"
  | "JOB_MATCH"
  | "PASSWORD_RESET"
  | "PAYMENT_REMINDER"
  | "INTERVIEW_SCHEDULED";

export type NotificationChannel = "EMAIL" | "WHATSAPP" | "IN_APP";

export interface Notification {
  id: string;
  user: string;
  type: NotificationType;
  channel: NotificationChannel;
  title: string;
  message: string;
  data: any;
  read: boolean;
  sent: boolean;
  sent_at?: string;
  error_message?: string;
  created_at: string;
}

export type PaymentMethod =
  | "MANUAL"
  | "MOBILE_MONEY"
  | "STRIPE"
  | "WHATSAPP_BUSINESS";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

export interface Payment {
  id: string;
  recruiter: string;
  recruiter_info?: {
    company_name: string;
  };
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  transaction_id?: string;
  external_reference?: string;
  payment_proof_url?: string;
  notes?: string;
  created_at: string;
  paid_at?: string;
  valid_until?: string;
  refunded_at?: string;
  refund_reason?: string;
}

export interface SavedJob {
  id: string;
  candidate: string;
  job_offer: string;
  job_details?: JobOffer;
  saved_at: string;
}

// API Response types
export interface LoginResponse {
  user: User;
  tokens: {
    access: string;
    refresh: string;
  };
  message: string;
}

export interface RegisterResponse {
  user: User;
  tokens: {
    access: string;
    refresh: string;
  };
  message: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
}

export interface ErrorResponse {
  error: string;
  details?: any;
}

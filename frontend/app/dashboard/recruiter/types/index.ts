import { LucideIcon } from "lucide-react";
import { User } from "@/lib/types";

export interface RecruiterStats {
  activeJobs: number;
  totalApplications: number;
  pendingReview: number;
}

export interface RecruiterStatCardProps {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
  iconBgColor: string;
  iconTextColor: string;
  delay: number;
}
export interface RecruiterDashboardHeaderProps {
    user: User | null;
}

export interface RecruiterQuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconBgColor: string;
  href: string;
}

export interface RecruiterDashboardContainerProps {
  user: User | null;
  stats: RecruiterStats;
  loading: boolean;
}

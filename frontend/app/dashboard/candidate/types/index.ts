import { LucideIcon } from "lucide-react";
import { User } from "@/lib/types";

export interface CandidateStats {
  applications: number;
  interviews: number;
  savedJobs: number;
}

export interface CandidateStatCardProps {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
  iconBgColor: string;
  iconTextColor: string;
  delay: number;
}

export interface CandidateQuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconBgColor: string;
  href: string;
}

export interface CandidateDashboardContainerProps {
  user: User | null;
  stats: CandidateStats;
  loading: boolean;
}
export interface CandidateDashboardHeaderProps {
    user: User | null;
}
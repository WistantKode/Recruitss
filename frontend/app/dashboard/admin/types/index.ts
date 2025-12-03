import {LucideIcon} from "lucide-react";

export interface AdminStats {
    totalUsers: number;
    totalCandidates: number;
    totalRecruiters: number;
    totalJobs: number;
    publishedJobs: number;
    totalApplications: number;
    pendingApplications: number;
    totalRevenue: number;
}
export interface JobStatsCardProps {
    stats: AdminStats;
}
export interface DetailedStatsGridProps {
    stats: AdminStats;
}
export interface MainStatsGridProps {
    stats: AdminStats;
}
export interface UserBreakdownCardProps {
    stats: AdminStats;
}

export interface StatCardProps {
    title: string;
    value: number | string;
    icon: LucideIcon;
    iconBgColor: string;
    iconTextColor: string;
    borderColor: string;
    trend?: {
        value: string;
        isPositive: boolean;
    };
}

export interface QuickActionCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    iconBgColor: string;
    iconTextColor: string;
    href: string;
}

export interface SystemHealthItemProps {
    title: string;
    status: string;
    icon: LucideIcon;
    iconColor: string;
}

export interface AdminDashboardProps {
    stats: AdminStats;
    loading: boolean;
}

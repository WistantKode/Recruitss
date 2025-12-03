"use client";

import { Briefcase, Users, Clock } from "lucide-react";
import { RecruiterStatCard } from "./RecruiterStatCard";
import { RecruiterStats } from "../types";

interface RecruiterStatsGridProps {
  stats: RecruiterStats;
}

export function RecruiterStatsGrid({ stats }: RecruiterStatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <RecruiterStatCard
        title="Offres actives"
        value={stats.activeJobs}
        description="Postes publiés"
        icon={Briefcase}
        iconBgColor="bg-blue-500/10"
        iconTextColor="text-blue-600"
        delay={0.1}
      />
      <RecruiterStatCard
        title="Candidatures"
        value={stats.totalApplications}
        description="Total reçues"
        icon={Users}
        iconBgColor="bg-green-500/10"
        iconTextColor="text-green-600"
        delay={0.2}
      />
      <RecruiterStatCard
        title="En attente"
        value={stats.pendingReview}
        description="À examiner"
        icon={Clock}
        iconBgColor="bg-yellow-500/10"
        iconTextColor="text-yellow-600"
        delay={0.3}
      />
    </div>
  );
}

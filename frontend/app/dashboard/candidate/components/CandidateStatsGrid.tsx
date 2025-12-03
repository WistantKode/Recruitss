"use client";

import { Briefcase, Calendar, Heart } from "lucide-react";
import { CandidateStatCard } from "./CandidateStatCard";
import { CandidateStats } from "../types";

interface CandidateStatsGridProps {
  stats: CandidateStats;
}

export function CandidateStatsGrid({ stats }: CandidateStatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <CandidateStatCard
        title="Candidatures"
        value={stats.applications}
        description="Postulations actives"
        icon={Briefcase}
        iconBgColor="bg-blue-500/10"
        iconTextColor="text-blue-600"
        delay={0.1}
      />
      <CandidateStatCard
        title="Entretiens"
        value={stats.interviews}
        description="Rendez-vous planifiés"
        icon={Calendar}
        iconBgColor="bg-green-500/10"
        iconTextColor="text-green-600"
        delay={0.2}
      />
      <CandidateStatCard
        title="Offres sauvegardées"
        value={stats.savedJobs}
        description="À postuler plus tard"
        icon={Heart}
        iconBgColor="bg-purple-500/10"
        iconTextColor="text-purple-600"
        delay={0.3}
      />
    </div>
  );
}

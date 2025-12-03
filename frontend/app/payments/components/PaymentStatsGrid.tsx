"use client";

import { Receipt, CheckCircle, Clock, XCircle } from "lucide-react";
import { PaymentStatCard } from "./PaymentStatCard";
import { PaymentStats } from "../types";

interface PaymentStatsGridProps {
  stats: PaymentStats;
}

export function PaymentStatsGrid({ stats }: PaymentStatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <PaymentStatCard
        title="Total paiements"
        value={stats.total}
        icon={Receipt}
        iconBgColor="bg-blue-100"
        iconTextColor="text-blue-600"
      />
      <PaymentStatCard
        title="Vérifiés"
        value={stats.verified}
        icon={CheckCircle}
        iconBgColor="bg-green-100"
        iconTextColor="text-green-600"
      />
      <PaymentStatCard
        title="En attente"
        value={stats.pending}
        icon={Clock}
        iconBgColor="bg-yellow-100"
        iconTextColor="text-yellow-600"
      />
      <PaymentStatCard
        title="Refusés"
        value={stats.rejected}
        icon={XCircle}
        iconBgColor="bg-red-100"
        iconTextColor="text-red-600"
      />
    </div>
  );
}

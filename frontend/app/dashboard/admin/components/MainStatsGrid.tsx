"use client";

import {Users, Briefcase, FileText, DollarSign} from "lucide-react";
import {motion} from "framer-motion";
import {StatCard} from "@/app/dashboard/admin/components/StatCard";
import {MainStatsGridProps} from "@/app/dashboard/admin/types";


export function MainStatsGrid({stats}: MainStatsGridProps) {
    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.3, delay: 0.1}}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
            <StatCard
                title="Utilisateurs totaux"
                value={stats.totalUsers.toLocaleString()}
                icon={Users}
                iconBgColor="bg-blue-500/10"
                iconTextColor="text-blue-600"
                borderColor="border-l-blue-500"
                trend={{value: "+12% ce mois", isPositive: true}}
            />
            <StatCard
                title="Offres d'emploi"
                value={stats.totalJobs}
                icon={Briefcase}
                iconBgColor="bg-green-500/10"
                iconTextColor="text-green-600"
                borderColor="border-l-green-500"
                trend={{value: "+8% ce mois", isPositive: true}}
            />
            <StatCard
                title="Candidatures"
                value={stats.totalApplications.toLocaleString()}
                icon={FileText}
                iconBgColor="bg-purple-500/10"
                iconTextColor="text-purple-600"
                borderColor="border-l-purple-500"
                trend={{value: "+15% ce mois", isPositive: true}}
            />
            <StatCard
                title="Revenus"
                value={`${stats.totalRevenue.toLocaleString()} €`}
                icon={DollarSign}
                iconBgColor="bg-yellow-500/10"
                iconTextColor="text-yellow-600"
                borderColor="border-l-yellow-500"
                trend={{value: "+5% ce mois", isPositive: true}}
            />
        </motion.div>
    );
}

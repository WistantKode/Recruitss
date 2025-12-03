"use client";

import {Users, Briefcase, FileText, DollarSign} from "lucide-react";
import {motion} from "framer-motion";
import {QuickActionCard} from "./QuickActionCard";

export function QuickActionsGrid() {
    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.3, delay: 0.3}}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
            <QuickActionCard
                title="Gérer les utilisateurs"
                description="Voir et gérer tous les utilisateurs"
                icon={Users}
                iconBgColor="bg-blue-500/10"
                iconTextColor="text-blue-600"
                href="/admin/users"
            />
            <QuickActionCard
                title="Gérer les emplois"
                description="Superviser les offres d'emploi"
                icon={Briefcase}
                iconBgColor="bg-green-500/10"
                iconTextColor="text-green-600"
                href="/admin/jobs"
            />
            <QuickActionCard
                title="Candidatures"
                description="Surveiller les candidatures"
                icon={FileText}
                iconBgColor="bg-purple-500/10"
                iconTextColor="text-purple-600"
                href="/admin/applications"
            />
            <QuickActionCard
                title="Paiements"
                description="Gérer les paiements"
                icon={DollarSign}
                iconBgColor="bg-yellow-500/10"
                iconTextColor="text-yellow-600"
                href="/admin/payments"
            />
        </motion.div>
    );
}

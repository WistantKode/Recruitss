"use client";

import {Search, User as UserIcon, FileText} from "lucide-react";
import {motion} from "framer-motion";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {CandidateQuickActionCard} from "./CandidateQuickActionCard";

export function CandidateQuickActionsGrid() {
    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.4}}
        >
            <Card className="mb-12">
                <CardHeader>
                    <CardTitle>Actions rapides</CardTitle>
                    <CardDescription>Accédez rapidement aux fonctionnalités principales</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <CandidateQuickActionCard
                            title="Rechercher des offres"
                            description="Parcourir les offres d'emploi disponibles"
                            icon={Search}
                            iconBgColor="bg-gradient-to-br from-blue-500 to-blue-600"
                            href="/jobs"
                        />
                        <CandidateQuickActionCard
                            title="Compléter mon profil"
                            description="Améliorer ma visibilité auprès des recruteurs"
                            icon={UserIcon}
                            iconBgColor="bg-gradient-to-br from-purple-500 to-purple-600"
                            href="/profile/candidate"
                        />
                        <CandidateQuickActionCard
                            title="Mes candidatures"
                            description="Suivre le statut de mes postulations"
                            icon={FileText}
                            iconBgColor="bg-gradient-to-br from-green-500 to-green-600"
                            href="/applications"
                        />
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

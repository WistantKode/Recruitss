"use client";

import {PlusCircle, FileText, BarChart3} from "lucide-react";
import {motion} from "framer-motion";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {RecruiterQuickActionCard} from "./RecruiterQuickActionCard";

export function RecruiterQuickActionsGrid() {
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
                        <RecruiterQuickActionCard
                            title="Créer une offre"
                            description="Publier un nouveau poste à pourvoir"
                            icon={PlusCircle}
                            iconBgColor="bg-gradient-to-br from-blue-500 to-blue-600"
                            href="/jobs/create"
                        />
                        <RecruiterQuickActionCard
                            title="Voir les candidatures"
                            description="Examiner les postulations reçues"
                            icon={FileText}
                            iconBgColor="bg-gradient-to-br from-purple-500 to-purple-600"
                            href="/applications"
                        />
                        <RecruiterQuickActionCard
                            title="Gérer mes offres"
                            description="Modifier ou clôturer des postes"
                            icon={BarChart3}
                            iconBgColor="bg-gradient-to-br from-green-500 to-green-600"
                            href="/admin/jobs"
                        />
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

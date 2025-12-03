"use client";

import {Card, CardContent, CardHeader, CardTitle, CardDescription} from "@/components/ui/card";
import {Activity, CheckCircle, AlertCircle} from "lucide-react";
import {motion} from "framer-motion";
import {SystemHealthItemProps} from "../types";

function SystemHealthItem({title, status, icon: Icon, iconColor}: SystemHealthItemProps) {
    return (
        <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg">
            <Icon className={`h-6 w-6 ${iconColor} flex-shrink-0`}/>
            <div>
                <p className="text-sm font-medium">{title}</p>
                <p className={`text-xs font-semibold ${iconColor}`}>{status}</p>
            </div>
        </div>
    );
}

export function SystemHealthCard() {
    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.3, delay: 0.4}}
        >
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5"/>
                        Santé du système
                    </CardTitle>
                    <CardDescription>
                        État des services de la plateforme
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <SystemHealthItem
                            title="Base de données"
                            status="Opérationnelle"
                            icon={CheckCircle}
                            iconColor="text-green-600"
                        />
                        <SystemHealthItem
                            title="API"
                            status="Opérationnelle"
                            icon={CheckCircle}
                            iconColor="text-green-600"
                        />
                        <SystemHealthItem
                            title="Celery"
                            status="En maintenance"
                            icon={AlertCircle}
                            iconColor="text-yellow-600"
                        />
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

"use client";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Briefcase, CheckCircle, Clock, Activity} from "lucide-react";
import {JobStatsCardProps} from "@/app/dashboard/admin/types";

export function JobStatsCard({stats}: JobStatsCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5"/>
                    Statistiques des emplois
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600"/>
                        <span className="text-sm font-medium">Publiées</span>
                    </div>
                    <span className="font-bold text-green-600">
                      {stats.publishedJobs}
                    </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg">
                    <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-yellow-600"/>
                        <span className="text-sm font-medium">Brouillons</span>
                    </div>
                    <span className="font-bold text-yellow-600">
                      {stats.totalJobs - stats.publishedJobs}
                    </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg">
                    <div className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-blue-600"/>
                        <span className="text-sm font-medium">Candidatures en attente</span>
                    </div>
                    <span className="font-bold text-blue-600">
                      {stats.pendingApplications.toLocaleString()}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}

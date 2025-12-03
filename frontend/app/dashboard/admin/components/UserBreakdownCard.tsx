"use client";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {BarChart3} from "lucide-react";
import {UserBreakdownCardProps} from "../types";



export function UserBreakdownCard({stats}: UserBreakdownCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5"/>
                    Répartition des utilisateurs
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Candidats</span>
                        <span className="text-sm font-bold">
              {stats.totalCandidates.toLocaleString()}
            </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2.5">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-500"
                            style={{
                                width: `${(stats.totalCandidates / stats.totalUsers) * 100}%`,
                            }}
                        />
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Recruteurs</span>
                        <span className="text-sm font-bold">
              {stats.totalRecruiters.toLocaleString()}
            </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2.5">
                        <div
                            className="bg-gradient-to-r from-green-500 to-green-600 h-2.5 rounded-full transition-all duration-500"
                            style={{
                                width: `${(stats.totalRecruiters / stats.totalUsers) * 100}%`,
                            }}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

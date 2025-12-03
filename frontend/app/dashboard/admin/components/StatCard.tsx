"use client";

import {Card, CardContent} from "@/components/ui/card";
import {TrendingUp, TrendingDown} from "lucide-react";
import {StatCardProps} from "../types";

export function StatCard({
                             title,
                             value,
                             icon: Icon,
                             iconBgColor,
                             iconTextColor,
                             borderColor,
                             trend,
                         }: StatCardProps) {
    return (
        <Card className={`border-l-4 ${borderColor}`}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground font-medium">{title}</p>
                        <p className="text-3xl font-bold mt-2">{value}</p>
                        {trend && (
                            <div
                                className={`flex items-center mt-2 text-sm ${
                                    trend.isPositive ? "text-green-600" : "text-red-600"
                                }`}
                            >
                                {trend.isPositive ? (
                                    <TrendingUp className="h-4 w-4 mr-1"/>
                                ) : (
                                    <TrendingDown className="h-4 w-4 mr-1"/>
                                )}
                                {trend.value}
                            </div>
                        )}
                    </div>
                    <div className={`p-3 rounded-full ${iconBgColor}`}>
                        <Icon className={`h-8 w-8 ${iconTextColor}`}/>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

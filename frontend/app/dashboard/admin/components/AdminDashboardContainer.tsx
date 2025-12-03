"use client";

import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import {useAuthStore} from "@/lib/store";
import {Skeleton} from "@/components/ui/skeleton";
import {Header} from "@/components/layouts/header";
import {Card, CardContent} from "@/components/ui/card";

import {AdminDashboardHeader} from "@/app/dashboard/admin/components/AdminDashboardHeader";
import {MainStatsGrid} from "@/app/dashboard/admin/components/MainStatsGrid";
import {DetailedStatsGrid} from "@/app/dashboard/admin/components/DetailedStatsGrid";
import {QuickActionsGrid} from "@/app/dashboard/admin/components/QuickActionsGrid";
import {SystemHealthCard} from "@/app/dashboard/admin/components/SystemHealthCard";
import {AdminStats} from "@/app/dashboard/admin/types";

export function AdminDashboardContainer() {
    const router = useRouter();
    const {isAuthenticated, user} = useAuthStore();
    const [stats, setStats] = useState<AdminStats>({
        totalUsers: 0,
        totalCandidates: 0,
        totalRecruiters: 0,
        totalJobs: 0,
        publishedJobs: 0,
        totalApplications: 0,
        pendingApplications: 0,
        totalRevenue: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated || user?.role !== "ADMIN") {
            router.push("/auth/login");
            return;
        }
        loadStats();
    }, [isAuthenticated, user, router]);

    const loadStats = async () => {
        try {
            setLoading(true);
            // Simulate API call - replace with actual API when ready
            await new Promise((resolve) => setTimeout(resolve, 500));
            setStats({
                totalUsers: 1547,
                totalCandidates: 1124,
                totalRecruiters: 423,
                totalJobs: 342,
                publishedJobs: 267,
                totalApplications: 5632,
                pendingApplications: 1243,
                totalRevenue: 45780,
            });
        } catch (error) {
            console.error("Failed to load stats:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Header/>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="space-y-6">
                        <Skeleton className="h-12 w-64"/>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <Card key={i}>
                                    <CardContent className="pt-6">
                                        <Skeleton className="h-24"/>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header/>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <AdminDashboardHeader/>
                <MainStatsGrid stats={stats}/>
                <DetailedStatsGrid stats={stats}/>
                <QuickActionsGrid/>
                <SystemHealthCard/>
            </div>
        </div>
    );
}

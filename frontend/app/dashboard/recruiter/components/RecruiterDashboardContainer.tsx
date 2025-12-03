'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {useAuthStore} from '@/lib/store';
import apiClient from '@/lib/api/client';
import {Header} from '@/components/layouts/header';
import {Card, CardHeader} from '@/components/ui/card';
import {Skeleton} from '@/components/ui/skeleton';
import {RecruiterDashboardHeader} from './RecruiterDashboardHeader';
import {RecruiterStatsGrid} from './RecruiterStatsGrid';
import {RecruiterQuickActionsGrid} from './RecruiterQuickActionsGrid';
import {RecentActivityCard} from './RecentActivityCard';
import {RecruiterStats} from '../types';

export function RecruiterDashboardContainer() {
    const router = useRouter();
    const {user, isAuthenticated} = useAuthStore();
    const [stats, setStats] = useState<RecruiterStats>({
        activeJobs: 0,
        totalApplications: 0,
        pendingReview: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated || user?.role !== 'RECRUITER') {
            router.push('/auth/login');
            return;
        }

        const fetchStats = async () => {
            try {
                const [jobs, applications] = await Promise.all([
                    apiClient.get('/jobs/my_jobs/'),
                    apiClient.get('/applications/'),
                ]);

                const activeCount = Array.isArray(jobs) ? jobs.filter((job: {
                    status: string
                }) => job.status === 'PUBLISHED').length : 0;
                const pendingCount = Array.isArray(applications) ? applications.filter((app: {
                    status: string
                }) => app.status === 'SUBMITTED').length : 0;

                setStats({
                    activeJobs: activeCount,
                    totalApplications: Array.isArray(applications) ? applications.length : 0,
                    pendingReview: pendingCount,
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [isAuthenticated, user, router]); // next bug to fix here

    if (loading) {
        return (
            <div className="min-h-screen">
                <Header/>
                <main className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <Card key={i}>
                                <CardHeader>
                                    <Skeleton className="h-6 w-32"/>
                                    <Skeleton className="h-10 w-20 mt-2"/>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <Header/>
            <main className="container mx-auto px-4 py-12">
                <RecruiterDashboardHeader user={user}/>
                <RecruiterStatsGrid stats={stats}/>
                <RecruiterQuickActionsGrid/>
                <RecentActivityCard/>
            </main>
        </div>
    );
}

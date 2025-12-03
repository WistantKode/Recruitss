'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {useAuthStore} from '@/lib/store';
import apiClient from '@/lib/api/client';
import {Header} from '@/components/layouts/header';
import {Card, CardHeader} from '@/components/ui/card';
import {Skeleton} from '@/components/ui/skeleton';
import {CandidateDashboardHeader} from './CandidateDashboardHeader';
import {CandidateStatsGrid} from './CandidateStatsGrid';
import {CandidateQuickActionsGrid} from './CandidateQuickActionsGrid';
import {RecentActivityCard} from './RecentActivityCard';
import {CandidateStats} from '../types';

export function CandidateDashboardContainer() {
    const router = useRouter();
    const {user, isAuthenticated} = useAuthStore();
    const [stats, setStats] = useState<CandidateStats>({
        applications: 0,
        interviews: 0,
        savedJobs: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated || user?.role !== 'CANDIDATE') {
            router.push('/auth/login');
            return;
        }

        const fetchStats = async () => {
            try {
                const [applications, savedJobs] = await Promise.all([
                    apiClient.get('/applications/my_applications/'),
                    apiClient.get('/saved-jobs/'),
                ]);

                const interviewCount = Array.isArray(applications) ? applications.filter(
                    (app: { status: string }) => app.status === 'INTERVIEW_SCHEDULED'
                ).length : 0;

                setStats({
                    applications: Array.isArray(applications) ? applications.length : 0,
                    interviews: interviewCount,
                    savedJobs: Array.isArray(savedJobs) ? savedJobs.length : 0,
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [isAuthenticated, user, router]); // next problem to fix

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
                <CandidateDashboardHeader user={user}/>
                <CandidateStatsGrid stats={stats}/>
                <CandidateQuickActionsGrid/>
                <RecentActivityCard/>
            </main>
        </div>
    );
}

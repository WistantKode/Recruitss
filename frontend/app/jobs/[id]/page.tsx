'use client';

import {useEffect, useState} from 'react';
import {useRouter, useParams} from 'next/navigation';
import {
    MapPin, Briefcase, Building2, Heart, Send, ArrowLeft,
    Loader2, DollarSign, Eye, Users, CheckCircle2,
    FileText, TrendingUp
} from 'lucide-react';
import {motion} from 'framer-motion';
import apiClient from '@/lib/api/client';
import type {JobOffer} from '@/lib/types';
import {useAuthStore} from '@/lib/store';
import {Header} from '@/components/layouts/header';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {Skeleton} from '@/components/ui/skeleton';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import {toast} from 'sonner';
import Link from 'next/link';

export default function JobDetailPage() {
    const router = useRouter();
    const params = useParams();
    const jobId = params.id as string;
    const {user, isAuthenticated} = useAuthStore();

    const [job, setJob] = useState<JobOffer | null>(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [saved, setSaved] = useState(false);
    const [coverLetter, setCoverLetter] = useState('');
    const [showApplyForm, setShowApplyForm] = useState(false);

    useEffect(() => {
        fetchJob();
    }, [jobId]);

    const fetchJob = async () => {
        try {
            const data = await apiClient.getJob(jobId);
            setJob(data);
        } catch (error) {
            console.error('Error fetching job:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isAuthenticated) {
            router.push(`/auth/login?redirect=/jobs/${jobId}`);
            return;
        }

        if (user?.role !== 'CANDIDATE') {
            toast.error('Seuls les candidats peuvent postuler');
            return;
        }

        setApplying(true);
        try {
            await apiClient.createApplication({
                job_offer: jobId,
                cover_letter: coverLetter,
            });

            toast.success('Candidature envoyée !', {
                description: 'Nous vous notifierons de la réponse du recruteur'
            });
            setShowApplyForm(false);
            setCoverLetter('');
        } catch (error: unknown) {
            const err = error as { response?: { data?: { error?: string } } };
            toast.error('Erreur', {
                description: err.response?.data?.error || 'Erreur lors de la candidature'
            });
        } finally {
            setApplying(false);
        }
    };

    const handleSaveJob = async () => {
        if (!isAuthenticated) {
            router.push(`/auth/login?redirect=/jobs/${jobId}`);
            return;
        }

        try {
            if (saved) {
                setSaved(false);
                toast.success('Offre retirée des favoris');
            } else {
                await apiClient.saveJob(jobId);
                setSaved(true);
            }
        } catch (error) {
            console.error('Error saving job:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Header/>
                <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="space-y-6">
                        <Skeleton className="h-12 w-3/4"/>
                        <Skeleton className="h-6 w-1/2"/>
                        <Skeleton className="h-64 w-full"/>
                        <Skeleton className="h-48 w-full"/>
                    </div>
                </main>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="min-h-screen bg-background">
                <Header/>
                <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <Card className="text-center py-12">
                        <CardContent>
                            <Briefcase className="w-16 h-16 mx-auto text-muted-foreground mb-4"/>
                            <h2 className="text-2xl font-bold mb-2">Offre non trouvée</h2>
                            <p className="text-muted-foreground mb-6">
                                Cette offre n&#39;existe pas ou a été supprimée
                            </p>
                            <Button asChild>
                                <Link href="/jobs">
                                    <ArrowLeft className="w-4 h-4 mr-2"/>
                                    Retour aux offres
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header/>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.3}}
                    className="space-y-6"
                >
                    {/* Back Button */}
                    <Button variant="ghost" asChild>
                        <Link href="/jobs">
                            <ArrowLeft className="w-4 h-4 mr-2"/>
                            Retour aux offres
                        </Link>
                    </Button>

                    {/* Job Header Card */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="mb-6">
                                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    {job.title}
                                </h1>

                                <div className="flex flex-wrap gap-4 mb-4">
                                    {job.recruiter_info?.company_name && (
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Building2 className="w-4 h-4"/>
                                            <span>{job.recruiter_info.company_name}</span>
                                        </div>
                                    )}
                                    {job.location && (
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <MapPin className="w-4 h-4"/>
                                            <span>{job.location}</span>
                                        </div>
                                    )}
                                    {job.contract_type && (
                                        <Badge variant="secondary">
                                            <Briefcase className="w-3 h-3 mr-1"/>
                                            {job.contract_type}
                                        </Badge>
                                    )}
                                    {job.is_remote && (
                                        <Badge variant="outline">
                                            💻 Télétravail possible
                                        </Badge>
                                    )}
                                </div>

                                {job.salary_min && job.salary_max && (
                                    <div className="flex items-center gap-2 text-2xl font-bold text-green-600">
                                        <DollarSign className="w-6 h-6"/>
                                        {job.salary_min.toLocaleString()} - {job.salary_max.toLocaleString()} {job.salary_currency}
                                        {job.salary_period && ` / ${job.salary_period.toLowerCase()}`}
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-4">
                                <Dialog open={showApplyForm} onOpenChange={setShowApplyForm}>
                                    <DialogTrigger asChild>
                                        <Button variant="gradient" size="lg" className="flex-1 md:flex-none">
                                            <Send className="w-4 h-4 mr-2"/>
                                            Postuler maintenant
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Postuler pour {job.title}</DialogTitle>
                                            <DialogDescription>
                                                Envoyez votre candidature avec une lettre de motivation
                                            </DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={handleApply} className="space-y-4">
                                            <div>
                                                <label htmlFor="coverLetter" className="block text-sm font-medium mb-2">
                                                    Lettre de motivation (optionnel)
                                                </label>
                                                <textarea
                                                    id="coverLetter"
                                                    rows={6}
                                                    value={coverLetter}
                                                    onChange={(e) => setCoverLetter(e.target.value)}
                                                    className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring focus:outline-none"
                                                    placeholder="Pourquoi êtes-vous le candidat idéal pour ce poste ?"
                                                />
                                            </div>
                                            <div className="flex gap-4">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => setShowApplyForm(false)}
                                                    className="flex-1"
                                                >
                                                    Annuler
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    disabled={applying}
                                                    variant="gradient"
                                                    className="flex-1"
                                                >
                                                    {applying ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 mr-2 animate-spin"/>
                                                            Envoi...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Send className="w-4 h-4 mr-2"/>
                                                            Envoyer
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </form>
                                    </DialogContent>
                                </Dialog>

                                <Button
                                    variant={saved ? "default" : "outline"}
                                    size="lg"
                                    onClick={handleSaveJob}
                                >
                                    <Heart className={`w-4 h-4 mr-2 ${saved ? 'fill-current' : ''}`}/>
                                    {saved ? 'Sauvegardé' : 'Sauvegarder'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Job Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                    <Users className="w-4 h-4"/>
                                    <span className="text-sm">Candidatures</span>
                                </div>
                                <p className="text-2xl font-bold">{job.applications_count || 0}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                    <Eye className="w-4 h-4"/>
                                    <span className="text-sm">Vues</span>
                                </div>
                                <p className="text-2xl font-bold">{job.views_count || 0}</p>
                            </CardContent>
                        </Card>
                        {job.experience_level && (
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                        <TrendingUp className="w-4 h-4"/>
                                        <span className="text-sm">Expérience</span>
                                    </div>
                                    <p className="text-lg font-semibold">{job.experience_level}</p>
                                </CardContent>
                            </Card>
                        )}
                        {job.education_required && (
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                        <CheckCircle2 className="w-4 h-4"/>
                                        <span className="text-sm">Formation</span>
                                    </div>
                                    <p className="text-lg font-semibold">{job.education_required}</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Description */}
                    {job.description && (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-blue-500/10 rounded-lg">
                                        <FileText className="w-5 h-5 text-blue-600"/>
                                    </div>
                                    <CardTitle>Description du poste</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-muted-foreground whitespace-pre-line">
                                    {job.description}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Responsibilities */}
                    {job.responsibilities && (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-purple-500/10 rounded-lg">
                                        <CheckCircle2 className="w-5 h-5 text-purple-600"/>
                                    </div>
                                    <CardTitle>Responsabilités</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-muted-foreground whitespace-pre-line">
                                    {job.responsibilities}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Requirements */}
                    {job.requirements && (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-orange-500/10 rounded-lg">
                                        <FileText className="w-5 h-5 text-orange-600"/>
                                    </div>
                                    <CardTitle>Exigences</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-muted-foreground whitespace-pre-line">
                                    {job.requirements}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Skills */}
                    {job.skills_required && job.skills_required.length > 0 && (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-green-500/10 rounded-lg">
                                        <Briefcase className="w-5 h-5 text-green-600"/>
                                    </div>
                                    <CardTitle>Compétences requises</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {job.skills_required.map((skill, index) => (
                                        <Badge key={index} variant="secondary" className="px-4 py-2">
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Apply Again CTA */}
                    <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
                        <CardContent className="pt-6">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Intéressé par cette offre ?</h3>
                                    <p className="text-muted-foreground">
                                        Postulez maintenant et
                                        rejoignez {job.recruiter_info?.company_name || 'notre équipe'} !
                                    </p>
                                </div>
                                <Button
                                    variant="gradient"
                                    size="lg"
                                    onClick={() => setShowApplyForm(true)}
                                >
                                    <Send className="w-4 h-4 mr-2"/>
                                    Postuler maintenant
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </main>
        </div>
    );
}

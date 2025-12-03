"use client";

import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import {
    FileText,
    Eye,
    Star,
    Calendar,
    CheckCircle,
    XCircle,
    Clock,
    Filter,
} from "lucide-react";
import {motion} from "framer-motion";
import {useAuthStore} from "@/lib/store";
import apiClient from "@/lib/api/client";
import type {Application, ApplicationStatus} from "@/lib/types";
import {Header} from "@/components/layouts/header";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Skeleton} from "@/components/ui/skeleton";
import {toast} from "sonner";

export default function ApplicationsPage() {
    const router = useRouter();
    const {user, isAuthenticated} = useAuthStore();
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/auth/login");
            return;
        }
        loadApplications();
    }, [isAuthenticated, filter, router]);

    const loadApplications = async () => {
        try {
            setLoading(true);
            const params: Record<string, string> = {};
            if (filter !== "all") {
                params.status = filter;
            }
            const data = await apiClient.getApplications(params);
            setApplications(Array.isArray(data) ? data : data.results || []);
        } catch (error) {
            console.error("Error loading applications:", error);
            toast.error("Erreur de chargement", {
                description: "Impossible de charger les candidatures",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleWithdraw = async (applicationId: string) => {
        try {
            await apiClient.withdrawApplication(applicationId);
            toast.success("Candidature retirée");
            loadApplications();
        } catch (error) {
            console.error("Error withdrawing application:", error);
            toast.error("Erreur", {
                description: "Impossible de retirer la candidature",
            });
        }
    };

    const handleStatusUpdate = async (applicationId: string, action: string) => {
        try {
            if (action === "shortlist") {
                await apiClient.shortlistApplication(applicationId);
            } else if (action === "accept") {
                await apiClient.acceptApplication(applicationId);
            } else if (action === "reject") {
                await apiClient.rejectApplication(applicationId);
            }
            toast.success("Statut mis à jour");
            loadApplications();
        } catch (error) {
            console.error("Error updating application:", error);
            toast.error("Erreur", {
                description: "Impossible de mettre à jour le statut",
            });
        }
    };

    const getStatusBadge = (status: string) => {
        const statusConfig: Record<
            string,
            {
                variant:
                    | "default"
                    | "secondary"
                    | "destructive"
                    | "outline"
                    | "success"
                    | "warning";
                label: string;
                icon: React.ReactNode;
            }
        > = {
            PENDING: {
                variant: "warning",
                label: "En attente",
                icon: <Clock className="h-3 w-3"/>,
            },
            VIEWED: {
                variant: "default",
                label: "Vue",
                icon: <Eye className="h-3 w-3"/>,
            },
            SHORTLISTED: {
                variant: "secondary",
                label: "Présélectionné",
                icon: <Star className="h-3 w-3"/>,
            },
            INTERVIEW: {
                variant: "default",
                label: "Entretien",
                icon: <Calendar className="h-3 w-3"/>,
            },
            ACCEPTED: {
                variant: "success",
                label: "Acceptée",
                icon: <CheckCircle className="h-3 w-3"/>,
            },
            REJECTED: {
                variant: "destructive",
                label: "Refusée",
                icon: <XCircle className="h-3 w-3"/>,
            },
            WITHDRAWN: {
                variant: "outline",
                label: "Retirée",
                icon: <XCircle className="h-3 w-3"/>,
            },
        };

        const config = statusConfig[status] || {
            variant: "outline" as const,
            label: status,
            icon: null,
        };
        return (
            <Badge variant={config.variant} className="gap-1">
                {config.icon}
                {config.label}
            </Badge>
        );
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            PENDING: "En attente",
            VIEWED: "Vue",
            SHORTLISTED: "Présélectionné",
            INTERVIEW: "Entretien",
            ACCEPTED: "Acceptée",
            REJECTED: "Refusée",
            WITHDRAWN: "Retirée",
        };
        return labels[status] || status;
    };

    const isCandidate = user?.role === "CANDIDATE";

    if (loading) {
        return (
            <div className="min-h-screen">
                <Header/>
                <main className="container mx-auto px-4 py-12">
                    <Skeleton className="h-10 w-64 mb-4"/>
                    <Skeleton className="h-6 w-96 mb-8"/>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <Card key={i}>
                                <CardHeader>
                                    <Skeleton className="h-6 w-full"/>
                                    <Skeleton className="h-4 w-3/4 mt-2"/>
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
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    className="mb-12"
                >
                    <h1 className="text-4xl font-bold mb-2">
                        {isCandidate ? "Mes Candidatures" : "Candidatures Reçues"}
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        {isCandidate
                            ? "Suivez l'état de vos candidatures"
                            : "Gérez les candidatures"}
                    </p>
                </motion.div>

                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.1}}
                    className="mb-8"
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Filter className="h-5 w-5"/>
                                Filtres
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {["all", "PENDING", "SHORTLISTED", "INTERVIEW", "ACCEPTED"].map(
                                    (status) => (
                                        <Button
                                            key={status}
                                            variant={filter === status ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setFilter(status)}
                                        >
                                            {status === "all"
                                                ? "Toutes"
                                                : status === "PENDING"
                                                    ? "En attente"
                                                    : status === "SHORTLISTED"
                                                        ? "Présélectionnées"
                                                        : status === "INTERVIEW"
                                                            ? "Entretiens"
                                                            : "Acceptées"}
                                        </Button>
                                    )
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {applications.length === 0 ? (
                    <Card>
                        <CardContent className="text-center py-12">
                            <div
                                className="h-16 w-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                                <FileText className="h-8 w-8 text-muted-foreground"/>
                            </div>
                            <p className="text-muted-foreground mb-4">Aucune candidature</p>
                            {isCandidate && (
                                <Button variant="gradient" onClick={() => router.push("/jobs")}>
                                    Rechercher des offres
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {applications.map((application, index) => (
                            <motion.div
                                key={application.id}
                                initial={{opacity: 0, y: 20}}
                                animate={{opacity: 1, y: 0}}
                                transition={{delay: 0.05 * index}}
                            >
                                <Card className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <CardTitle className="mb-2">
                                                    {isCandidate
                                                        ? application.job_info?.title || "Poste"
                                                        : application.candidate_info?.full_name ||
                                                        "Candidat"}
                                                </CardTitle>
                                                <CardDescription>
                                                    {new Date(application.applied_at).toLocaleDateString(
                                                        "fr-FR"
                                                    )}
                                                </CardDescription>
                                            </div>
                                            {getStatusBadge(application.status)}
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex gap-2">
                                            {isCandidate &&
                                                application.status ===
                                                ("PENDING" as ApplicationStatus) && (
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleWithdraw(application.id)}
                                                    >
                                                        <XCircle className="mr-2 h-4 w-4"/>
                                                        Retirer
                                                    </Button>
                                                )}
                                            {!isCandidate &&
                                                application.status ===
                                                ("PENDING" as ApplicationStatus) && (
                                                    <>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleStatusUpdate(application.id, "shortlist")
                                                            }
                                                        >
                                                            <Star className="mr-2 h-4 w-4"/>
                                                            Présélectionner
                                                        </Button>
                                                        <Button
                                                            variant="default"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleStatusUpdate(application.id, "accept")
                                                            }
                                                        >
                                                            <CheckCircle className="mr-2 h-4 w-4"/>
                                                            Accepter
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleStatusUpdate(application.id, "reject")
                                                            }
                                                        >
                                                            <XCircle className="mr-2 h-4 w-4"/>
                                                            Refuser
                                                        </Button>
                                                    </>
                                                )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

"use client";

import {Briefcase} from "lucide-react";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";
import {JobCard} from "./JobCard";
import {JobListSectionProps} from "../types";

export function JobListSection({jobs, loading}: JobListSectionProps) {
    return (
        <main className="container mx-auto px-4 py-12">
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <Card key={i}>
                            <CardHeader>
                                <Skeleton className="h-6 w-3/4 mb-2"/>
                                <Skeleton className="h-4 w-1/2"/>
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-4 w-full mb-2"/>
                                <Skeleton className="h-4 w-full mb-2"/>
                                <Skeleton className="h-4 w-2/3"/>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : jobs.length === 0 ? (
                <Card className="p-12">
                    <div className="text-center">
                        <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4"/>
                        <h3 className="text-lg font-semibold mb-2">
                            Aucune offre trouvée
                        </h3>
                        <p className="text-muted-foreground">
                            Essayez de modifier vos critères de recherche
                        </p>
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map((job, index) => (
                        <JobCard key={job.id} job={job} index={index}/>
                    ))}
                </div>
            )}
        </main>
    );
}

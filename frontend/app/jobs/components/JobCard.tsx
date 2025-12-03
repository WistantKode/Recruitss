"use client";

import Link from "next/link";
import {
    MapPin,
    Clock,
    TrendingUp,
    Building2,
} from "lucide-react";
import {motion} from "framer-motion";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {JobCardProps} from "../types";

export function JobCard({job, index}: JobCardProps) {
    const getContractTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            CDI: "CDI",
            CDD: "CDD",
            FREELANCE: "Freelance",
            INTERNSHIP: "Stage",
            APPRENTICESHIP: "Alternance",
        };
        return labels[type] || type;
    };

    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: index * 0.05}}
        >
            <Link href={`/jobs/${job.id}`}>
                <Card
                    className="h-full hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary group cursor-pointer">
                    <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                                    {job.title}
                                </CardTitle>
                                {job.recruiter_info?.company_name && (
                                    <CardDescription className="flex items-center mt-2">
                                        <Building2 className="h-4 w-4 mr-1"/>
                                        {job.recruiter_info.company_name}
                                    </CardDescription>
                                )}
                            </div>
                            {job.recruiter_info?.verified && (
                                <Badge variant="success" className="ml-2">
                                    Vérifié
                                </Badge>
                            )}
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                            {job.location && (
                                <span className="flex items-center">
                                    <MapPin className="h-3 w-3 mr-1"/>
                                    {job.location}
                                </span>
                            )}
                            {job.contract_type && (
                                <Badge variant="secondary">
                                    {getContractTypeLabel(job.contract_type)}
                                </Badge>
                            )}
                            {job.is_remote && (
                                <Badge variant="outline">Télétravail</Badge>
                            )}
                        </div>

                        {job.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {job.description}
                            </p>
                        )}

                        {job.skills_required && job.skills_required.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                                {job.skills_required.slice(0, 3).map((skill, skillIndex) => (
                                    <Badge
                                        key={skillIndex}
                                        variant="secondary"
                                        className="text-xs"
                                    >
                                        {skill}
                                    </Badge>
                                ))}
                                {job.skills_required.length > 3 && (
                                    <Badge variant="secondary" className="text-xs">
                                        +{job.skills_required.length - 3}
                                    </Badge>
                                )}
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="flex justify-between items-center pt-4">
                        <div className="flex items-center text-sm text-muted-foreground">
                            <TrendingUp className="h-4 w-4 mr-1"/>
                            {job.applications_count || 0} candidature
                            {(job.applications_count || 0) !== 1 ? "s" : ""}
                        </div>
                        {job.published_at && (
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Clock className="h-4 w-4 mr-1"/>
                                {new Date(job.published_at).toLocaleDateString("fr-FR")}
                            </div>
                        )}
                    </CardFooter>
                </Card>
            </Link>
        </motion.div>
    );
}

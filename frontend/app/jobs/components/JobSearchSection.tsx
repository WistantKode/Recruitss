"use client";

import React, {useState, useEffect} from "react";
import {Search, MapPin} from "lucide-react";
import {motion} from "framer-motion";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {JobSearchSectionProps, JobFilters} from "../types";

export function JobSearchSection({
                                     initialFilters,
                                     onSearchSubmit,
                                     jobsCount,
                                 }: JobSearchSectionProps) {
    const [localFilters, setLocalFilters] = useState<JobFilters>(initialFilters);

    // Synchroniser les filtres initiaux avec l'état local si nécessaire
    useEffect(() => {
        setLocalFilters(initialFilters);
    }, [initialFilters]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setLocalFilters((prev) => ({...prev, [e.target.id || e.target.name]: e.target.value}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearchSubmit(localFilters);
    };

    return (
        <section className="border-b bg-background">
            <div className="container mx-auto px-4 py-12">
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5}}
                >
                    <h1 className="text-4xl font-bold mb-2">
                        Trouvez votre prochain emploi
                    </h1>
                    <p className="text-muted-foreground text-lg mb-8">
                        {jobsCount} offres disponibles
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>
                                <Input
                                    id="search"
                                    type="text"
                                    placeholder="Rechercher un poste..."
                                    value={localFilters.search}
                                    onChange={handleChange}
                                    className="pl-10"
                                />
                            </div>

                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>
                                <Input
                                    id="location"
                                    type="text"
                                    placeholder="Localisation"
                                    value={localFilters.location}
                                    onChange={handleChange}
                                    className="pl-10"
                                />
                            </div>

                            <select
                                id="contract_type"
                                name="contract_type"
                                value={localFilters.contract_type}
                                onChange={handleChange}
                                className="flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:bg-slate-950"
                            >
                                <option value="">Tout type de contrat</option>
                                <option value="CDI">CDI</option>
                                <option value="CDD">CDD</option>
                                <option value="FREELANCE">Freelance</option>
                                <option value="INTERNSHIP">Stage</option>
                            </select>

                            <select
                                id="is_remote"
                                name="is_remote"
                                value={localFilters.is_remote}
                                onChange={handleChange}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Tout</option>
                                <option value="true">Télétravail</option>
                                <option value="false">Sur site</option>
                            </select>

                            <Button
                                type="submit"
                                variant="gradient"
                                className="w-full md:w-auto"
                            >
                                <Search className="mr-2 h-4 w-4"/>
                                Rechercher
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </section>
    );
}

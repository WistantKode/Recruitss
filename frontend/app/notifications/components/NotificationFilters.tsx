"use client";

import {Filter} from "lucide-react";
import {motion} from "framer-motion";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {NotificationFiltersProps} from "../types";

export function NotificationFilters({
                                        currentFilter,
                                        onFilterChange,
                                    }: NotificationFiltersProps) {
    return (
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
                        {[
                            {key: "all", label: "Toutes"},
                            {key: "unread", label: "Non lues"},
                            {key: "APPLICATION", label: "Candidatures"},
                            {key: "INTERVIEW", label: "Entretiens"},
                            {key: "MESSAGE", label: "Messages"},
                            {key: "SYSTEM", label: "Système"},
                        ].map(({key, label}) => (
                            <Button
                                key={key}
                                variant={currentFilter === key ? "default" : "outline"}
                                size="sm"
                                onClick={() => onFilterChange(key)}
                            >
                                {label}
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

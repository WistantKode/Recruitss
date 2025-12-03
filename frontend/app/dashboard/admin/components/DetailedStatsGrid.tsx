"use client";

import {motion} from "framer-motion";
import {UserBreakdownCard} from "./UserBreakdownCard";
import {JobStatsCard} from "./JobStatsCard";
import {DetailedStatsGridProps} from "@/app/dashboard/admin/types";


export function DetailedStatsGrid({stats}: DetailedStatsGridProps) {
    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.3, delay: 0.2}}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
            <UserBreakdownCard stats={stats}/>
            <JobStatsCard stats={stats}/>
        </motion.div>
    );
}

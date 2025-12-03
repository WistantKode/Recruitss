"use client";
import {motion} from "framer-motion";
import {CandidateDashboardHeaderProps} from "../types";



export function CandidateDashboardHeader({
                                             user,
                                         }: CandidateDashboardHeaderProps) {
    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            className="mb-12"
        >
            <h1 className="text-4xl font-bold mb-2">
                Bonjour, {user?.first_name || "Candidat"} 👋
            </h1>
            <p className="text-muted-foreground text-lg">
                Gérez vos candidatures et trouvez votre prochain emploi
            </p>
        </motion.div>
    );
}

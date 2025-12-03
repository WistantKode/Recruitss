"use client";

import {motion} from "framer-motion";
import {RecruiterDashboardHeaderProps} from "../types";


export function RecruiterDashboardHeader({
                                             user,
                                         }: RecruiterDashboardHeaderProps) {
    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            className="mb-12"
        >
            <h1 className="text-4xl font-bold mb-2">
                Bonjour, {user?.first_name || "Recruteur"} 👋
            </h1>
            <p className="text-muted-foreground text-lg">
                Gérez vos offres et trouvez les meilleurs talents
            </p>
        </motion.div>
    );
}

"use client";
import {motion} from "framer-motion";


export function AdminDashboardHeader() {
    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.3}}
            className="mb-8"
        >
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Tableau de bord Administrateur
            </h1>
            <p className="text-muted-foreground mt-2">
                Vue d&#39;overview et gestion de la plateforme
            </p>
        </motion.div>
    );
}

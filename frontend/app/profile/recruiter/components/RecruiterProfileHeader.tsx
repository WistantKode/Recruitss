"use client";

import { motion } from "framer-motion";

export function RecruiterProfileHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
        Mon Profil Recruteur
      </h1>
      <p className="text-muted-foreground">
        Gérez les informations de votre entreprise et optimisez votre présence
      </p>
    </motion.div>
  );
}

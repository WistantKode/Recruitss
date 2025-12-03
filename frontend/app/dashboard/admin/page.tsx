"use client";

import { Suspense } from "react";
import { AdminDashboardContainer } from "./components/AdminDashboardContainer";

export default function AdminDashboard() {
  return (
    <Suspense fallback={<div>Chargement du tableau de bord administrateur...</div>}>
      <AdminDashboardContainer />
    </Suspense>
  );
}

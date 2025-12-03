"use client";

import { Suspense } from "react";
import { JobPageContainer } from "./components/JobPageContainer";

export default function JobsPage() {
  return (
    <Suspense fallback={<div>Chargement des offres d'emploi...</div>}>
      <JobPageContainer />
    </Suspense>
  );
}

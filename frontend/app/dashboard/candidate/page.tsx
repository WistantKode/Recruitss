'use client';

import { Suspense } from 'react';
import { CandidateDashboardContainer } from './components/CandidateDashboardContainer';

export default function CandidateDashboard() {
  return (
    <Suspense fallback={<div>Chargement du tableau de bord candidat...</div>}>
      <CandidateDashboardContainer />
    </Suspense>
  );
}

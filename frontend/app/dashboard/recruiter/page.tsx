'use client';

import { Suspense } from 'react';
import { RecruiterDashboardContainer } from './components/RecruiterDashboardContainer';

export default function RecruiterDashboard() {
  return (
    <Suspense fallback={<div>Chargement du tableau de bord recruteur...</div>}>
      <RecruiterDashboardContainer />
    </Suspense>
  );
}

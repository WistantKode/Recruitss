'use client';

import { Suspense } from 'react';
import { Header } from '@/components/layouts/header';
import { CreateJobForm } from './components/CreateJobForm';

export default function CreateJobPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Suspense fallback={<div>Chargement du formulaire...</div>}>
        <CreateJobForm />
      </Suspense>
    </div>
  );
}

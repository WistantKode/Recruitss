'use client';

import { Suspense } from 'react';
import { Header } from '@/components/layouts/header';
import { RecruiterProfileForm } from './components/RecruiterProfileForm';

export default function RecruiterProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Suspense fallback={<div>Chargement du profil recruteur...</div>}>
        <RecruiterProfileForm />
      </Suspense>
    </div>
  );
}

'use client';

import { Suspense } from 'react';
import Navigation from '@/components/Navigation';
import { PaymentsPageContainer } from './components/PaymentsPageContainer';

export default function PaymentsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <Suspense fallback={
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      }>
        <PaymentsPageContainer />
      </Suspense>
    </div>
  );
}

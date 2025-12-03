"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { apiClient } from '@/lib/api/client';
import {
  CreditCard, CheckCircle, Clock, XCircle, Download,
  DollarSign, Calendar, Receipt
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

import { PaymentsHeader } from './PaymentsHeader';
import { PaymentStatsGrid } from './PaymentStatsGrid';
import { CurrentSubscriptionCard } from './CurrentSubscriptionCard';
import { PaymentHistoryList } from './PaymentHistoryList';
import { AddPaymentButton } from './AddPaymentButton';
import { PaymentStats, PaymentItem } from '../types';

export function PaymentsPageContainer() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [stats, setStats] = useState<PaymentStats>({
    total: 0,
    verified: 0,
    pending: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'RECRUITER') {
      router.push('/auth/login');
      return;
    }
    loadPayments();
  }, [isAuthenticated, user, router]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      // Simulate API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockPayments: PaymentItem[] = [
        {
          id: '1',
          amount: 99.00,
          currency: 'EUR',
          payment_method: 'CREDIT_CARD',
          status: 'VERIFIED',
          subscription_type: 'MONTHLY',
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          verified_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '2',
          amount: 99.00,
          currency: 'EUR',
          payment_method: 'CREDIT_CARD',
          status: 'VERIFIED',
          subscription_type: 'MONTHLY',
          created_at: new Date(Date.now() - 37 * 24 * 60 * 60 * 1000).toISOString(),
          verified_at: new Date(Date.now() - 36 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];
      
      setPayments(mockPayments);
      setStats({
        total: mockPayments.length,
        verified: mockPayments.filter(p => p.status === 'VERIFIED').length,
        pending: mockPayments.filter(p => p.status === 'PENDING').length,
        rejected: mockPayments.filter(p => p.status === 'REJECTED').length,
      });
    } catch (error) {
      console.error('Failed to load payments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PaymentsHeader />
      <PaymentStatsGrid stats={stats} />
      <CurrentSubscriptionCard />
      <PaymentHistoryList payments={payments} loading={loading} />
      <AddPaymentButton />
    </div>
  );
}

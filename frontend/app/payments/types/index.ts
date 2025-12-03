import { LucideIcon } from "lucide-react";

export interface PaymentStats {
  total: number;
  verified: number;
  pending: number;
  rejected: number;
}

export interface PaymentStatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  iconBgColor: string;
  iconTextColor: string;
}

export interface PaymentItem {
  id: string;
  amount: number;
  currency: string;
  payment_method: string;
  status: "VERIFIED" | "PENDING" | "REJECTED";
  subscription_type: string;
  created_at: string;
  verified_at?: string;
}

export interface PaymentHistoryListProps {
  payments: PaymentItem[];
  loading: boolean;
}

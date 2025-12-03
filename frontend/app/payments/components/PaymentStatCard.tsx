"use client";

import { PaymentStatCardProps } from "../types";

export function PaymentStatCard({
  title,
  value,
  icon: Icon,
  iconBgColor,
  iconTextColor,
}: PaymentStatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className={`text-3xl font-bold ${iconTextColor} mt-2`}>{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${iconBgColor}`}>
          <Icon className={`h-8 w-8 ${iconTextColor}`} />
        </div>
      </div>
    </div>
  );
}

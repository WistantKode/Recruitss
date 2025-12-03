"use client";

import { CreditCard } from "lucide-react";

export function AddPaymentButton() {
  return (
    <div className="mt-8 text-center">
      <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center">
        <CreditCard className="h-5 w-5 mr-2" />
        Ajouter un nouveau paiement
      </button>
    </div>
  );
}

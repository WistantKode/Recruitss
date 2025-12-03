"use client";

import { DollarSign, Calendar } from "lucide-react";

export function CurrentSubscriptionCard() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-8 mb-8 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Abonnement Mensuel</h2>
          <p className="text-blue-100">Plan actif - Renouvellement automatique</p>
          <div className="flex items-center mt-4 space-x-4">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              <span>Prochaine facturation: {new Date(Date.now() + 23 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              <span className="text-2xl font-bold">99€/mois</span>
            </div>
          </div>
        </div>
        <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
          Gérer l&#39;abonnement
        </button>
      </div>
    </div>
  );
}

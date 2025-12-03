"use client";

import { CreditCard, CheckCircle, Clock, XCircle, Download } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { PaymentHistoryListProps } from "../types";

export function PaymentHistoryList({ payments}: PaymentHistoryListProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'PENDING':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'REJECTED':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return 'Vérifié';
      case 'PENDING':
        return 'En attente';
      case 'REJECTED':
        return 'Refusé';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Historique des paiements</h2>
      </div>
      
      <div className="divide-y divide-gray-200">
        {payments.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucun paiement enregistré</p>
          </div>
        ) : (
          payments.map((payment) => (
            <div key={payment.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(payment.status)}
                  <div>
                    <p className="font-semibold text-gray-900">
                      {payment.amount.toFixed(2)} {payment.currency}
                    </p>
                    <p className="text-sm text-gray-600">
                      {payment.payment_method === 'CREDIT_CARD' && 'Carte bancaire'}
                      {payment.payment_method === 'BANK_TRANSFER' && 'Virement bancaire'}
                      {payment.payment_method === 'MOBILE_MONEY' && 'Mobile Money'}
                      {' '} - {payment.subscription_type === 'MONTHLY' ? 'Mensuel' : 'Annuel'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDistanceToNow(new Date(payment.created_at), {
                        addSuffix: true,
                        locale: fr
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(payment.status)}`}>
                    {getStatusText(payment.status)}
                  </span>
                  {payment.status === 'VERIFIED' && (
                    <button
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Télécharger la facture"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

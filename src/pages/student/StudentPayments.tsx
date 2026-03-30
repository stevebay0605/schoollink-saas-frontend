import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { CreditCard, AlertCircle } from 'lucide-react';
import { paymentsApi } from '../../api/payments';
import { useAuthStore } from '../../store/useAuthStore';
import PageHeader from '../../components/ui/PageHeader';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import Skeleton from '../../components/ui/Skeleton';
import { formatDate, formatAmount, getStatusColor, getStatusLabel } from '../../utils/formatters';
import type { BadgeVariant } from '../../components/ui/Badge';

const StudentPayments: React.FC = () => {
  const { user } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ['student-payments', user?.id],
    queryFn: () =>
      paymentsApi.list({ student_id: user?.id }).then((r) => r.data),
    enabled: !!user,
  });

  const payments = data?.data ?? [];

  const totalPending = payments
    .filter((p) => p.status === 'pending' || p.status === 'overdue')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Mes paiements"
        subtitle="Historique de vos frais scolaires"
      />

      {/* Alerte montant en attente */}
      {!isLoading && totalPending > 0 && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-amber-800 text-sm">Montant en attente</p>
            <p className="text-amber-700 font-bold text-xl mt-0.5">
              {formatAmount(totalPending)}
            </p>
            <p className="text-amber-600/80 text-xs mt-0.5">
              Contactez l'administration pour régulariser votre situation.
            </p>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : !payments.length ? (
        <EmptyState
          icon={<CreditCard size={28} className="text-school-600" />}
          title="Aucun paiement enregistré"
          description="Aucun frais scolaire n'est associé à votre compte pour l'instant."
        />
      ) : (
        <div className="bg-white rounded-xl border border-border overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/40 border-b border-border">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Description
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Année
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Échéance
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Montant
                  </th>
                  <th className="px-5 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-white">
                {payments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-5 py-3 font-medium text-foreground text-sm">
                      {payment.description}
                    </td>
                    <td className="px-5 py-3 text-sm text-muted-foreground">
                      {payment.academic_year}
                    </td>
                    <td className="px-5 py-3 text-sm text-muted-foreground">
                      {formatDate(payment.due_date)}
                    </td>
                    <td className="px-5 py-3 text-right font-bold text-school-600 text-sm">
                      {formatAmount(payment.amount)}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <Badge
                        variant={getStatusColor(payment.status) as BadgeVariant}
                        dot
                      >
                        {getStatusLabel(payment.status)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
              {/* Récapitulatif total payé */}
              {payments.some((p) => p.status === 'paid') && (
                <tfoot>
                  <tr className="bg-school-50 border-t border-border">
                    <td
                      colSpan={3}
                      className="px-5 py-3 text-sm font-semibold text-school-700"
                    >
                      Total réglé
                    </td>
                    <td className="px-5 py-3 text-right font-bold text-school-600">
                      {formatAmount(
                        payments
                          .filter((p) => p.status === 'paid')
                          .reduce((sum, p) => sum + p.amount, 0),
                      )}
                    </td>
                    <td />
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentPayments;

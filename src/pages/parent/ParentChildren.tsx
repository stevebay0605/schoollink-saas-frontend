import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Users, ExternalLink, TrendingUp, UserCheck, CreditCard } from 'lucide-react';
import { dashboardApi } from '../../api/dashboard';
import PageHeader from '../../components/ui/PageHeader';
import Avatar from '../../components/ui/Avatar';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import { formatPercent } from '../../utils/formatters';

const ParentChildren: React.FC = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardApi.get().then((r) => r.data.data),
  });

  const children = stats?.children ?? [];

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Mes enfants"
        subtitle={
          !isLoading && children.length > 0
            ? `${children.length} enfant${children.length > 1 ? 's' : ''} inscrit${children.length > 1 ? 's' : ''}`
            : 'Liste de vos enfants inscrits'
        }
      />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : !children.length ? (
        <EmptyState
          icon={<Users size={28} className="text-school-600" />}
          title="Aucun enfant associé"
          description="Contactez l'administration pour associer vos enfants à votre compte."
        />
      ) : (
        <>
          {/* Vue tableau (md+) */}
          <div className="hidden md:block bg-white rounded-xl border border-border overflow-hidden shadow-card">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/40 border-b border-border">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Enfant
                  </th>
                  <th className="px-5 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Moyenne
                  </th>
                  <th className="px-5 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Présences
                  </th>
                  <th className="px-5 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Impayés
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Détail
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-white">
                {children.map(({ student, average, attendance_rate, pending_payments }) => (
                  <tr
                    key={student.id}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    {/* Élève */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={student.full_name} size="sm" />
                        <div className="min-w-0">
                          <div className="font-medium text-foreground text-sm truncate">
                            {student.full_name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            N° {student.student_number}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Moyenne */}
                    <td className="px-5 py-3 text-center">
                      <span className="font-bold text-school-600 text-sm">
                        {average.toFixed(2)}
                      </span>
                      <span className="text-xs text-muted-foreground">/20</span>
                    </td>

                    {/* Présences */}
                    <td className="px-5 py-3 text-center">
                      <span className="font-medium text-blue-600 text-sm">
                        {formatPercent(attendance_rate * 100)}
                      </span>
                    </td>

                    {/* Impayés */}
                    <td className="px-5 py-3 text-center">
                      {pending_payments > 0 ? (
                        <span className="font-bold text-amber-600 text-sm">
                          {pending_payments}
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-bold">✓</span>
                      )}
                    </td>

                    {/* Lien */}
                    <td className="px-5 py-3 text-right">
                      <Link
                        to={`/parent/children/${student.id}`}
                        className="inline-flex items-center gap-1 text-sm text-school-600 hover:text-school-700 font-medium transition-colors"
                      >
                        Voir
                        <ExternalLink size={13} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Vue cartes (mobile) */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {children.map(({ student, average, attendance_rate, pending_payments }) => (
              <div
                key={student.id}
                className="bg-white rounded-xl border border-border shadow-card overflow-hidden"
              >
                {/* En-tête */}
                <div className="flex items-center gap-3 p-4 border-b border-border">
                  <Avatar name={student.full_name} size="md" />
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-foreground truncate">
                      {student.full_name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      N° {student.student_number}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 divide-x divide-border p-3">
                  <div className="text-center px-2">
                    <TrendingUp size={13} className="text-school-600 mx-auto mb-0.5" />
                    <div className="font-bold text-school-600 text-base leading-none">
                      {average.toFixed(1)}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">Moy.</div>
                  </div>
                  <div className="text-center px-2">
                    <UserCheck size={13} className="text-blue-500 mx-auto mb-0.5" />
                    <div className="font-bold text-blue-600 text-base leading-none">
                      {formatPercent(attendance_rate * 100)}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">Présence</div>
                  </div>
                  <div className="text-center px-2">
                    <CreditCard size={13} className="text-amber-500 mx-auto mb-0.5" />
                    <div
                      className={`font-bold text-base leading-none ${
                        pending_payments > 0 ? 'text-amber-600' : 'text-emerald-600'
                      }`}
                    >
                      {pending_payments}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">Impayés</div>
                  </div>
                </div>

                {/* Lien */}
                <div className="border-t border-border px-4 py-2.5">
                  <Link
                    to={`/parent/children/${student.id}`}
                    className="flex items-center justify-between text-sm text-school-600 font-medium hover:text-school-700 transition-colors"
                  >
                    Voir le bulletin complet
                    <ExternalLink size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ParentChildren;

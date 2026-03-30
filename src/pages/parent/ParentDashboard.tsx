import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, TrendingUp, UserCheck, CreditCard, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../../api/dashboard';
import PageHeader from '../../components/ui/PageHeader';
import Avatar from '../../components/ui/Avatar';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import { formatPercent } from '../../utils/formatters';

const ParentDashboard: React.FC = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardApi.get().then((r) => r.data.data),
  });

  const children = stats?.children ?? [];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Espace parent"
        subtitle="Suivez la scolarité de vos enfants en temps réel"
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-52 rounded-xl" />
          ))}
        </div>
      ) : !children.length ? (
        <EmptyState
          icon={<Users size={28} className="text-school-600" />}
          title="Aucun enfant associé"
          description="Contactez l'administration pour associer vos enfants à votre compte."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {children.map(({ student, average, attendance_rate, pending_payments }) => (
            <div
              key={student.id}
              className="bg-white rounded-xl border border-border shadow-card overflow-hidden"
            >
              {/* En-tête vert */}
              <div className="bg-school-900 p-5 flex items-center gap-4">
                <Avatar
                  name={student.full_name}
                  size="lg"
                  className="ring-2 ring-gold-500 flex-shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="text-white font-semibold text-base leading-snug truncate">
                    {student.full_name}
                  </h3>
                  <p className="text-white/50 text-xs mt-0.5">
                    N° {student.student_number}
                  </p>
                </div>
              </div>

              {/* Statistiques en 3 colonnes */}
              <div className="grid grid-cols-3 divide-x divide-border p-4">
                {/* Moyenne */}
                <div className="text-center px-3">
                  <div className="flex items-center justify-center mb-1">
                    <TrendingUp size={14} className="text-school-600" />
                  </div>
                  <div className="text-xl font-bold text-school-600 leading-none">
                    {average.toFixed(1)}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">Moyenne</div>
                </div>

                {/* Présences */}
                <div className="text-center px-3">
                  <div className="flex items-center justify-center mb-1">
                    <UserCheck size={14} className="text-blue-500" />
                  </div>
                  <div className="text-xl font-bold text-blue-600 leading-none">
                    {formatPercent(attendance_rate * 100)}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">Présences</div>
                </div>

                {/* Impayés */}
                <div className="text-center px-3">
                  <div className="flex items-center justify-center mb-1">
                    <CreditCard size={14} className="text-amber-500" />
                  </div>
                  <div
                    className={`text-xl font-bold leading-none ${
                      pending_payments > 0 ? 'text-amber-600' : 'text-emerald-600'
                    }`}
                  >
                    {pending_payments}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">Impayés</div>
                </div>
              </div>

              {/* Lien détail */}
              <div className="border-t border-border px-5 py-3">
                <Link
                  to={`/parent/children/${student.id}`}
                  className="flex items-center justify-between text-sm text-school-600 font-medium hover:text-school-700 transition-colors group"
                >
                  Voir le détail
                  <ChevronRight
                    size={16}
                    className="group-hover:translate-x-0.5 transition-transform"
                  />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Section résumé global si plusieurs enfants */}
      {!isLoading && children.length > 1 && (
        <div className="bg-school-50 rounded-xl border border-school-200 p-5">
          <h3 className="font-semibold text-school-800 mb-3 text-sm">
            Récapitulatif — {children.length} enfants
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-school-600">
                {(
                  children.reduce((sum, c) => sum + c.average, 0) / children.length
                ).toFixed(1)}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">Moyenne générale</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formatPercent(
                  (children.reduce((sum, c) => sum + c.attendance_rate, 0) /
                    children.length) *
                    100,
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">Taux présence</div>
            </div>
            <div className="text-center">
              <div
                className={`text-2xl font-bold ${
                  children.reduce((sum, c) => sum + c.pending_payments, 0) > 0
                    ? 'text-amber-600'
                    : 'text-emerald-600'
                }`}
              >
                {children.reduce((sum, c) => sum + c.pending_payments, 0)}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">Total impayés</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-school-600">
                {children.length}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">Enfants inscrits</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentDashboard;

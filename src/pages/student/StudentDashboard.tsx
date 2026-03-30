import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, ClipboardList, Calendar } from 'lucide-react';
import { dashboardApi } from '../../api/dashboard';
import StatCard from '../../components/ui/StatCard';
import PageHeader from '../../components/ui/PageHeader';
import Badge from '../../components/ui/Badge';
import Skeleton from '../../components/ui/Skeleton';
import { formatDate, getStatusColor, getStatusLabel } from '../../utils/formatters';
import type { BadgeVariant } from '../../components/ui/Badge';

const StudentDashboard: React.FC = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardApi.get().then((r) => r.data.data),
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Mon tableau de bord"
        subtitle="Bienvenue dans votre espace élève"
      />

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))
        ) : (
          <>
            <StatCard
              title="Mes matières"
              value={stats?.my_subjects?.length ?? 0}
              icon={<BookOpen size={20} />}
              color="primary"
            />
            <StatCard
              title="Devoirs en cours"
              value={stats?.my_assignments?.filter((a) => a.status === 'open').length ?? 0}
              icon={<ClipboardList size={20} />}
              color="warning"
            />
            <StatCard
              title="Cours à venir"
              value={stats?.upcoming_courses?.length ?? 0}
              icon={<Calendar size={20} />}
              color="secondary"
            />
          </>
        )}
      </div>

      {/* Grille Cours + Devoirs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Prochains cours */}
        <div className="bg-white rounded-xl border border-border p-5 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-school-50 flex items-center justify-center">
              <Calendar size={15} className="text-school-600" />
            </div>
            <h2 className="font-semibold text-foreground text-base">Prochains cours</h2>
          </div>

          {isLoading ? (
            <Skeleton lines={5} />
          ) : !stats?.upcoming_courses?.length ? (
            <div className="py-8 text-center">
              <Calendar size={32} className="mx-auto text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">Aucun cours à venir</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {stats.upcoming_courses.slice(0, 5).map((course) => (
                <li
                  key={course.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/40 hover:bg-accent/50 transition-colors"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <div className="font-medium text-foreground text-sm truncate">
                      {course.title}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                      <span className="truncate">{course.subject?.name ?? '—'}</span>
                      <span>·</span>
                      <span className="flex-shrink-0">{formatDate(course.date)}</span>
                    </div>
                  </div>
                  <Badge variant={getStatusColor(course.status) as BadgeVariant} dot>
                    {getStatusLabel(course.status)}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Mes devoirs */}
        <div className="bg-white rounded-xl border border-border p-5 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
              <ClipboardList size={15} className="text-amber-600" />
            </div>
            <h2 className="font-semibold text-foreground text-base">Mes devoirs</h2>
          </div>

          {isLoading ? (
            <Skeleton lines={5} />
          ) : !stats?.my_assignments?.length ? (
            <div className="py-8 text-center">
              <ClipboardList size={32} className="mx-auto text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">Aucun devoir en cours</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {stats.my_assignments.slice(0, 5).map((assignment) => (
                <li
                  key={assignment.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/40 hover:bg-accent/50 transition-colors"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <div className="font-medium text-foreground text-sm truncate">
                      {assignment.title}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                      <span className="truncate">{assignment.subject?.name ?? '—'}</span>
                      <span>·</span>
                      <span className="flex-shrink-0">
                        Échéance&nbsp;: {formatDate(assignment.due_date)}
                      </span>
                      <span>·</span>
                      <span className="flex-shrink-0">/{assignment.max_score}</span>
                    </div>
                  </div>
                  <Badge variant={assignment.status === 'open' ? 'primary' : 'muted'}>
                    {assignment.status === 'open' ? 'Ouvert' : 'Fermé'}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Mes matières */}
      {!isLoading && (stats?.my_subjects?.length ?? 0) > 0 && (
        <div className="bg-white rounded-xl border border-border p-5 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-school-50 flex items-center justify-center">
              <BookOpen size={15} className="text-school-600" />
            </div>
            <h2 className="font-semibold text-foreground text-base">Mes matières</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {stats!.my_subjects!.map((subject) => (
              <div
                key={subject.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/20 hover:bg-accent/40 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-school-600 flex items-center justify-center flex-shrink-0">
                  <BookOpen size={15} className="text-white" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-foreground truncate">
                    {subject.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Coeff.&nbsp;{subject.coefficient}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;

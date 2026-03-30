import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  GraduationCap,
  Users,
  School,
  CreditCard,
  UserCheck,
  Clock,
  BookOpen,
} from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';
import StatCard from '../../components/ui/StatCard';
import PageHeader from '../../components/ui/PageHeader';
import Skeleton from '../../components/ui/Skeleton';
import { formatAmount, formatPercent } from '../../utils/formatters';

const revenueData = [
  { month: 'Sep', revenue: 450000 },
  { month: 'Oct', revenue: 620000 },
  { month: 'Nov', revenue: 580000 },
  { month: 'Déc', revenue: 390000 },
  { month: 'Jan', revenue: 710000 },
  { month: 'Fév', revenue: 650000 },
  { month: 'Mar', revenue: 720000 },
];

const Dashboard: React.FC = () => {
  const { data: stats, isLoading } = useDashboard();

  const attendanceRate = stats?.today_attendance_rate ?? 0.78;
  const circumference = 2 * Math.PI * 50;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Tableau de bord"
        subtitle="Vue d'ensemble de votre établissement"
        breadcrumbs={[{ label: 'Accueil', href: '/' }, { label: 'Tableau de bord' }]}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))
        ) : (
          <>
            <StatCard
              title="Total Élèves"
              value={stats?.total_students ?? 0}
              icon={<GraduationCap size={20} />}
              color="primary"
              trend={5}
              trendLabel="ce mois"
            />
            <StatCard
              title="Enseignants"
              value={stats?.total_teachers ?? 0}
              icon={<Users size={20} />}
              color="secondary"
            />
            <StatCard
              title="Classes"
              value={stats?.total_classrooms ?? 0}
              icon={<School size={20} />}
              color="success"
            />
            <StatCard
              title="Revenus du mois"
              value={formatAmount(stats?.monthly_revenue ?? 0)}
              icon={<CreditCard size={20} />}
              color="warning"
              trend={12}
              trendLabel="vs mois dernier"
            />
          </>
        )}
      </div>

      {/* Ligne 2 : Graphique + Taux présence */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graphique Revenus */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-border p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-foreground text-lg font-heading">
              Revenus mensuels
            </h2>
            <span className="text-xs text-muted-foreground bg-accent px-2.5 py-1 rounded-full">
              Année 2024-2025
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={revenueData}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(value: number) => [formatAmount(value), 'Revenus']}
                contentStyle={{
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: 12,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                }}
                cursor={{ fill: 'hsl(var(--accent))' }}
              />
              <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Taux de présence + stats rapides */}
        <div className="bg-white rounded-xl border border-border p-6 shadow-card">
          <div className="flex items-center gap-2 mb-5">
            <UserCheck size={18} className="text-school-600" />
            <h2 className="font-semibold text-foreground">Présences aujourd'hui</h2>
          </div>

          {isLoading ? (
            <Skeleton className="h-48 rounded-lg" />
          ) : (
            <div className="flex flex-col items-center gap-5">
              {/* Cercle de progression */}
              <div className="relative w-32 h-32">
                <svg
                  className="w-full h-full transform -rotate-90"
                  viewBox="0 0 120 120"
                  aria-hidden="true"
                >
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="hsl(var(--accent))"
                    strokeWidth="10"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="10"
                    strokeDasharray={`${circumference}`}
                    strokeDashoffset={`${circumference * (1 - attendanceRate)}`}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-school-600">
                    {formatPercent(attendanceRate * 100)}
                  </span>
                  <span className="text-xs text-muted-foreground">présents</span>
                </div>
              </div>

              {/* Métriques rapides */}
              <div className="w-full space-y-2.5">
                <div className="flex items-center justify-between text-sm py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock size={13} />
                    <span>Paiements en attente</span>
                  </div>
                  <span className="font-semibold text-amber-600">
                    {stats?.pending_payments ?? 0}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <BookOpen size={13} />
                    <span>Total matières</span>
                  </div>
                  <span className="font-semibold text-foreground">
                    {stats?.total_subjects ?? 0}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm py-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <School size={13} />
                    <span>Taux remplissage</span>
                  </div>
                  <span className="font-semibold text-emerald-600">
                    {stats?.total_classrooms
                      ? `${stats.total_classrooms} classes`
                      : '—'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ligne 3 : Cours à venir (si disponibles) */}
      {!isLoading && stats?.upcoming_courses && stats.upcoming_courses.length > 0 && (
        <div className="bg-white rounded-xl border border-border p-6 shadow-card">
          <h2 className="font-semibold text-foreground text-lg font-heading mb-4">
            Cours à venir
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {stats.upcoming_courses.slice(0, 3).map((course) => (
              <div
                key={course.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 border border-border"
              >
                <div className="w-8 h-8 rounded-lg bg-school-50 flex items-center justify-center flex-shrink-0">
                  <BookOpen size={14} className="text-school-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {course.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {course.subject?.name ?? '—'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

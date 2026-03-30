import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { GraduationCap, TrendingUp } from 'lucide-react';
import { gradesApi } from '../../api/grades';
import { useAuthStore } from '../../store/useAuthStore';
import PageHeader from '../../components/ui/PageHeader';
import Select from '../../components/ui/Select';
import Skeleton from '../../components/ui/Skeleton';
import Badge from '../../components/ui/Badge';
import { ACADEMIC_YEARS } from '../../utils/constants';
import type { BadgeVariant } from '../../components/ui/Badge';

interface MentionInfo {
  label: string;
  variant: BadgeVariant;
}

const getMention = (average: number): MentionInfo => {
  if (average >= 16) return { label: 'Très bien',  variant: 'success'  };
  if (average >= 14) return { label: 'Bien',        variant: 'primary'  };
  if (average >= 12) return { label: 'Assez bien',  variant: 'primary'  };
  if (average >= 10) return { label: 'Passable',    variant: 'warning'  };
  return              { label: 'Insuffisant',        variant: 'danger'   };
};

const StudentBulletin: React.FC = () => {
  const { user } = useAuthStore();
  const [academicYear, setAcademicYear] = useState(ACADEMIC_YEARS[0]);

  const { data: report, isLoading } = useQuery({
    queryKey: ['grades-report', user?.id, academicYear],
    queryFn: () =>
      gradesApi
        .report({ student_id: user!.id, academic_year: academicYear })
        .then((r) => r.data.data),
    enabled: !!user,
  });

  const yearOptions = ACADEMIC_YEARS.map((y) => ({ value: y, label: y }));

  const chartData =
    report?.subjects.map((s) => ({
      name:
        s.subject.name.length > 12
          ? s.subject.name.slice(0, 12) + '…'
          : s.subject.name,
      average: s.average,
    })) ?? [];

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Mon bulletin de notes"
        subtitle="Consultez vos résultats par matière et par année"
        actions={
          <Select
            options={yearOptions}
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            fullWidth={false}
            className="w-40"
          />
        }
      />

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-56 rounded-xl" />
          <Skeleton lines={6} />
        </div>
      ) : !report ? (
        <div className="bg-white rounded-xl border border-border p-16 text-center shadow-card">
          <div className="w-16 h-16 rounded-full bg-school-50 flex items-center justify-center mx-auto mb-4">
            <GraduationCap size={28} className="text-school-600" />
          </div>
          <h3 className="font-semibold text-foreground mb-1">Aucune note disponible</h3>
          <p className="text-sm text-muted-foreground">
            Aucune note enregistrée pour l'année {academicYear}.
          </p>
        </div>
      ) : (
        <>
          {/* Bannière moyenne générale */}
          <div className="bg-school-900 rounded-xl p-6 text-white flex items-center justify-between shadow-card">
            <div>
              <p className="text-white/60 text-sm font-medium">Moyenne générale</p>
              <p className="text-5xl font-bold font-heading mt-1 leading-none">
                {report.overall_average.toFixed(2)}
                <span className="text-2xl text-white/50 font-normal">/20</span>
              </p>
              <p className="text-white/50 text-xs mt-2">Année {academicYear}</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-gold-500 flex items-center justify-center flex-shrink-0 shadow-md">
              <TrendingUp size={28} className="text-white" />
            </div>
          </div>

          {/* Graphique */}
          {chartData.length > 0 && (
            <div className="bg-white rounded-xl border border-border p-5 shadow-card">
              <h3 className="font-semibold text-foreground mb-4">Moyennes par matière</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={chartData}
                  margin={{ top: 5, right: 10, left: -10, bottom: 24 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 20% 89%)" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: 'hsl(215 16% 47%)' }}
                    angle={-20}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis
                    domain={[0, 20]}
                    tick={{ fontSize: 11, fill: 'hsl(215 16% 47%)' }}
                    tickCount={5}
                  />
                  <Tooltip
                    formatter={(v: number) => [`${v.toFixed(2)}/20`, 'Moyenne']}
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid hsl(214 20% 89%)',
                      fontSize: '12px',
                    }}
                  />
                  <Bar
                    dataKey="average"
                    fill="#1a6b3c"
                    radius={[4, 4, 0, 0]}
                    label={{
                      position: 'top',
                      fontSize: 11,
                      fill: '#1a6b3c',
                      formatter: (v: number) => v.toFixed(1),
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Tableau par matière */}
          <div className="bg-white rounded-xl border border-border overflow-hidden shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/40 border-b border-border">
                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Matière
                    </th>
                    <th className="px-5 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Coeff.
                    </th>
                    <th className="px-5 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Nb notes
                    </th>
                    <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Moyenne
                    </th>
                    <th className="px-5 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Mention
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-white">
                  {report.subjects.map(({ subject, average, grades }) => {
                    const mention = getMention(average);
                    return (
                      <tr key={subject.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-5 py-3 font-medium text-foreground text-sm">
                          {subject.name}
                        </td>
                        <td className="px-5 py-3 text-center text-sm text-muted-foreground">
                          {subject.coefficient}
                        </td>
                        <td className="px-5 py-3 text-center text-sm text-muted-foreground">
                          {grades.length}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <span className="font-bold text-school-600 text-lg leading-none">
                            {average.toFixed(2)}
                          </span>
                          <span className="text-xs text-muted-foreground">/20</span>
                        </td>
                        <td className="px-5 py-3 text-center">
                          <Badge variant={mention.variant}>{mention.label}</Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-school-900">
                    <td
                      colSpan={3}
                      className="px-5 py-3 text-white font-semibold text-sm"
                    >
                      Moyenne générale
                    </td>
                    <td className="px-5 py-3 text-right text-white font-bold text-xl leading-none">
                      {report.overall_average.toFixed(2)}
                      <span className="text-base text-white/50 font-normal">/20</span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <Badge variant={getMention(report.overall_average).variant}>
                        {getMention(report.overall_average).label}
                      </Badge>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentBulletin;

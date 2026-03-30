import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Users, BookOpen, School, Calendar, Hash } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useClassroom } from '../../hooks/useClassrooms';
import { classroomsApi } from '../../api/classrooms';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import type { BadgeVariant } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import PageHeader from '../../components/ui/PageHeader';
import Skeleton from '../../components/ui/Skeleton';
import { getStatusColor, getStatusLabel } from '../../utils/formatters';

const ClassroomDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const classroomId = Number(id);
  const navigate = useNavigate();

  const { data: classroom, isLoading } = useClassroom(classroomId);
  const { data: studentsData, isLoading: isLoadingStudents } = useQuery({
    queryKey: ['classrooms', classroomId, 'students'],
    queryFn: () => classroomsApi.students(classroomId).then((r) => r.data.data),
    enabled: !!classroomId,
  });

  if (isLoading) {
    return (
      <div className="space-y-5 max-w-4xl">
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (!classroom) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <School size={48} className="text-muted-foreground mb-4" />
        <h2 className="text-lg font-semibold text-foreground mb-1">Classe introuvable</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Cette classe n'existe pas ou a été supprimée.
        </p>
        <Button variant="outline" onClick={() => navigate('/classrooms')}>
          Retour à la liste
        </Button>
      </div>
    );
  }

  const studentsCount = studentsData?.length ?? classroom.students_count ?? 0;
  const fillRate =
    classroom.capacity > 0
      ? Math.round((studentsCount / classroom.capacity) * 100)
      : 0;
  const fillColor =
    fillRate >= 90 ? 'bg-red-500' : fillRate >= 70 ? 'bg-amber-500' : 'bg-emerald-500';
  const fillTextColor =
    fillRate >= 90
      ? 'text-red-600'
      : fillRate >= 70
      ? 'text-amber-600'
      : 'text-emerald-600';

  return (
    <div className="space-y-5 animate-fade-in max-w-4xl">
      <PageHeader
        title={classroom.name}
        subtitle={`${classroom.level} — ${classroom.academic_year}`}
        breadcrumbs={[
          { label: 'Tableau de bord', href: '/dashboard' },
          { label: 'Classes', href: '/classrooms' },
          { label: classroom.name },
        ]}
        actions={
          <Button
            variant="ghost"
            icon={<ArrowLeft size={16} />}
            onClick={() => navigate('/classrooms')}
          >
            Retour
          </Button>
        }
      />

      {/* Stats de la classe */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            icon: <Hash size={16} className="text-school-600" />,
            label: 'Niveau',
            value: classroom.level,
          },
          {
            icon: <Calendar size={16} className="text-gold-600" />,
            label: 'Année scolaire',
            value: classroom.academic_year,
          },
          {
            icon: <Users size={16} className="text-emerald-600" />,
            label: 'Capacité',
            value: `${studentsCount} / ${classroom.capacity}`,
          },
          {
            icon: <BookOpen size={16} className="text-blue-600" />,
            label: 'Taux de remplissage',
            value: `${fillRate}%`,
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-border p-4 shadow-card"
          >
            <div className="flex items-center gap-2 mb-2">{item.icon}</div>
            <p className="text-xs text-muted-foreground mb-0.5">{item.label}</p>
            <p className={`text-base font-bold ${i === 3 ? fillTextColor : 'text-foreground'}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Barre de remplissage */}
      <div className="bg-white rounded-xl border border-border p-5 shadow-card">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-foreground">Remplissage</span>
          <span className={`text-sm font-semibold ${fillTextColor}`}>{fillRate}%</span>
        </div>
        <div className="w-full h-2 bg-border rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${fillColor}`}
            style={{ width: `${Math.min(fillRate, 100)}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1.5">
          {studentsCount} élèves inscrits sur {classroom.capacity} places disponibles
        </p>
      </div>

      {/* Liste des élèves */}
      <div className="bg-white rounded-xl border border-border p-6 shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <Users size={16} className="text-school-600" />
          <h3 className="font-semibold text-foreground font-heading text-base">
            Élèves inscrits
          </h3>
          <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {studentsCount}
          </span>
        </div>

        {isLoadingStudents ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 rounded-lg" />
            ))}
          </div>
        ) : studentsData && studentsData.length > 0 ? (
          <div className="space-y-2">
            {studentsData.map((student) => (
              <div
                key={student.id}
                onClick={() => navigate(`/students/${student.id}`)}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/40 border border-transparent hover:border-border transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Avatar name={student.full_name} src={student.avatar} size="sm" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {student.full_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      #{student.student_number}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={getStatusColor(student.status) as BadgeVariant}
                  dot
                >
                  {getStatusLabel(student.status)}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">
            Aucun élève inscrit dans cette classe pour le moment.
          </p>
        )}
      </div>
    </div>
  );
};

export default ClassroomDetail;

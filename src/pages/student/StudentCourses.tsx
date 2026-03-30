import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BookMarked, Calendar, FileText, Download } from 'lucide-react';
import { coursesApi } from '../../api/courses';
import PageHeader from '../../components/ui/PageHeader';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import Skeleton from '../../components/ui/Skeleton';
import { formatDate, getStatusColor, getStatusLabel } from '../../utils/formatters';
import type { BadgeVariant } from '../../components/ui/Badge';

const StudentCourses: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['my-courses'],
    queryFn: () =>
      coursesApi.list({ status: 'published' }).then((r) => r.data),
  });

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Mes cours"
        subtitle="Ressources pédagogiques publiées par vos enseignants"
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-xl" />
          ))}
        </div>
      ) : !data?.data.length ? (
        <EmptyState
          icon={<BookMarked size={28} className="text-school-600" />}
          title="Aucun cours disponible"
          description="Vos enseignants n'ont pas encore publié de cours."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.data.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl border border-border p-5 shadow-card hover:shadow-md transition-shadow"
            >
              {/* En-tête carte */}
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-school-50 flex items-center justify-center flex-shrink-0">
                  <FileText size={18} className="text-school-600" />
                </div>
                <Badge variant={getStatusColor(course.status) as BadgeVariant} dot>
                  {getStatusLabel(course.status)}
                </Badge>
              </div>

              {/* Titre & matière */}
              <h3 className="font-semibold text-foreground mb-0.5 leading-snug">
                {course.title}
              </h3>
              <p className="text-xs text-muted-foreground mb-1">
                {course.subject?.name ?? '—'}
                {course.subject?.classroom?.name
                  ? ` · ${course.subject.classroom.name}`
                  : ''}
              </p>

              {/* Description tronquée */}
              {course.description && (
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                  {course.description}
                </p>
              )}

              {/* Pied de carte */}
              <div className="flex items-center justify-between text-xs text-muted-foreground mt-3 pt-3 border-t border-border">
                <span className="flex items-center gap-1">
                  <Calendar size={11} />
                  {formatDate(course.date)}
                  {course.duration ? ` · ${course.duration} min` : ''}
                </span>

                {course.file_url && (
                  <a
                    href={course.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-school-600 hover:text-school-700 font-medium transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Download size={12} />
                    Télécharger
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentCourses;

import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Phone,
  Mail,
  BookOpen,
  Hash,
  User,
  GraduationCap,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useTeacher } from '../../hooks/useTeachers';
import { teachersApi } from '../../api/teachers';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import type { BadgeVariant } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import PageHeader from '../../components/ui/PageHeader';
import Skeleton from '../../components/ui/Skeleton';
import { formatDate } from '../../utils/formatters';

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
      <span className="text-muted-foreground">{icon}</span>
    </div>
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <p className="text-sm font-medium text-foreground">{value || '—'}</p>
    </div>
  </div>
);

const TeacherDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const teacherId = Number(id);
  const navigate = useNavigate();

  const { data: teacher, isLoading } = useTeacher(teacherId);
  const { data: subjectsData, isLoading: isLoadingSubjects } = useQuery({
    queryKey: ['teachers', teacherId, 'subjects'],
    queryFn: () => teachersApi.subjects(teacherId).then((r) => r.data.data),
    enabled: !!teacherId,
  });

  if (isLoading) {
    return (
      <div className="space-y-5 max-w-4xl">
        <Skeleton className="h-16 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 rounded-xl" />
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-64 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <User size={48} className="text-muted-foreground mb-4" />
        <h2 className="text-lg font-semibold text-foreground mb-1">
          Enseignant introuvable
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Cet enseignant n'existe pas ou a été supprimé.
        </p>
        <Button variant="outline" onClick={() => navigate('/teachers')}>
          Retour à la liste
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in max-w-4xl">
      <PageHeader
        title={teacher.full_name}
        subtitle={`Enseignant #${teacher.employee_number}`}
        breadcrumbs={[
          { label: 'Tableau de bord', href: '/dashboard' },
          { label: 'Enseignants', href: '/teachers' },
          { label: teacher.full_name },
        ]}
        actions={
          <Button
            variant="ghost"
            icon={<ArrowLeft size={16} />}
            onClick={() => navigate('/teachers')}
          >
            Retour
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Carte profil */}
        <div className="bg-white rounded-xl border border-border p-6 shadow-card flex flex-col items-center text-center gap-4">
          <Avatar name={teacher.full_name} src={teacher.avatar} size="xl" />
          <div>
            <h2 className="text-lg font-bold text-foreground font-heading">
              {teacher.full_name}
            </h2>
            <p className="text-sm text-muted-foreground">#{teacher.employee_number}</p>
            {teacher.specialization && (
              <p className="text-xs text-school-600 mt-1 font-medium">
                {teacher.specialization}
              </p>
            )}
          </div>
          <Badge
            variant={(teacher.is_active ? 'success' : 'muted') as BadgeVariant}
            dot
          >
            {teacher.is_active ? 'Actif' : 'Inactif'}
          </Badge>
          <div className="w-full pt-2 border-t border-border text-left">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2 font-medium">
              Infos
            </p>
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Rejoint le</span>
                <span className="font-medium text-foreground">
                  {formatDate(teacher.created_at)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Matières</span>
                <span className="font-medium text-foreground">
                  {subjectsData?.length ?? '—'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Colonne droite */}
        <div className="lg:col-span-2 space-y-5">
          {/* Coordonnées */}
          <div className="bg-white rounded-xl border border-border p-6 shadow-card">
            <h3 className="font-semibold text-foreground font-heading text-base mb-2">
              Coordonnées
            </h3>
            <InfoRow icon={<Hash size={14} />} label="Numéro employé" value={teacher.employee_number} />
            <InfoRow icon={<Mail size={14} />} label="Email" value={teacher.email} />
            <InfoRow icon={<Phone size={14} />} label="Téléphone" value={teacher.phone} />
            <InfoRow
              icon={<GraduationCap size={14} />}
              label="Spécialisation"
              value={teacher.specialization}
            />
          </div>

          {/* Matières enseignées */}
          <div className="bg-white rounded-xl border border-border p-6 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={16} className="text-school-600" />
              <h3 className="font-semibold text-foreground font-heading text-base">
                Matières enseignées
              </h3>
            </div>

            {isLoadingSubjects ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 rounded-lg" />
                ))}
              </div>
            ) : subjectsData && subjectsData.length > 0 ? (
              <div className="space-y-2">
                {subjectsData.map((subject) => (
                  <div
                    key={subject.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-school-50 flex items-center justify-center">
                        <BookOpen size={14} className="text-school-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {subject.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Code: {subject.code}
                          {subject.classroom?.name && ` • ${subject.classroom.name}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Coefficient</p>
                      <p className="text-sm font-semibold text-school-600">
                        {subject.coefficient}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">
                Aucune matière assignée pour le moment.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDetail;

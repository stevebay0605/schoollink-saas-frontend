import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Pencil,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Users,
  Hash,
  User,
} from 'lucide-react';
import { useStudent } from '../../hooks/useStudents';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import type { BadgeVariant } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import PageHeader from '../../components/ui/PageHeader';
import Skeleton from '../../components/ui/Skeleton';
import { formatDate, getStatusColor, getStatusLabel } from '../../utils/formatters';

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

const StudentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const studentId = Number(id);
  const navigate = useNavigate();

  const { data: student, isLoading } = useStudent(studentId);

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

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <User size={48} className="text-muted-foreground mb-4" />
        <h2 className="text-lg font-semibold text-foreground mb-1">Élève introuvable</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Cet élève n'existe pas ou a été supprimé.
        </p>
        <Button variant="outline" onClick={() => navigate('/students')}>
          Retour à la liste
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in max-w-4xl">
      <PageHeader
        title={student.full_name}
        subtitle={`Élève #${student.student_number}`}
        breadcrumbs={[
          { label: 'Tableau de bord', href: '/dashboard' },
          { label: 'Élèves', href: '/students' },
          { label: student.full_name },
        ]}
        actions={
          <div className="flex gap-2">
            <Button
              variant="ghost"
              icon={<ArrowLeft size={16} />}
              onClick={() => navigate('/students')}
            >
              Retour
            </Button>
            <Button
              variant="outline"
              icon={<Pencil size={16} />}
              onClick={() => navigate(`/students/${studentId}/edit`)}
            >
              Modifier
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Carte profil */}
        <div className="bg-white rounded-xl border border-border p-6 shadow-card flex flex-col items-center text-center gap-4">
          <Avatar name={student.full_name} src={student.avatar} size="xl" />
          <div>
            <h2 className="text-lg font-bold text-foreground font-heading">
              {student.full_name}
            </h2>
            <p className="text-sm text-muted-foreground">#{student.student_number}</p>
          </div>
          <Badge
            variant={getStatusColor(student.status) as BadgeVariant}
            dot
          >
            {getStatusLabel(student.status)}
          </Badge>
          <div className="w-full pt-2 border-t border-border text-left">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2 font-medium">
              Informations clés
            </p>
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Genre</span>
                <span className="font-medium text-foreground">
                  {student.gender === 'M'
                    ? 'Masculin'
                    : student.gender === 'F'
                    ? 'Féminin'
                    : '—'}
                </span>
              </div>
              {student.date_of_birth && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Naissance</span>
                  <span className="font-medium text-foreground">
                    {formatDate(student.date_of_birth)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Inscrit le</span>
                <span className="font-medium text-foreground">
                  {formatDate(student.created_at)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Détails */}
        <div className="lg:col-span-2 space-y-5">
          {/* Contact */}
          <div className="bg-white rounded-xl border border-border p-6 shadow-card">
            <h3 className="font-semibold text-foreground font-heading text-base mb-2">
              Coordonnées
            </h3>
            <InfoRow icon={<Hash size={14} />} label="Numéro élève" value={student.student_number} />
            <InfoRow icon={<Mail size={14} />} label="Email" value={student.email} />
            <InfoRow icon={<Phone size={14} />} label="Téléphone" value={student.phone} />
            <InfoRow icon={<MapPin size={14} />} label="Adresse" value={student.address} />
            <InfoRow
              icon={<Calendar size={14} />}
              label="Date de naissance"
              value={formatDate(student.date_of_birth)}
            />
          </div>

          {/* Tuteur */}
          <div className="bg-white rounded-xl border border-border p-6 shadow-card">
            <h3 className="font-semibold text-foreground font-heading text-base mb-2">
              Tuteur / Parent
            </h3>
            <InfoRow icon={<Users size={14} />} label="Nom du tuteur" value={student.guardian_name} />
            <InfoRow
              icon={<Phone size={14} />}
              label="Téléphone du tuteur"
              value={student.guardian_phone}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetail;

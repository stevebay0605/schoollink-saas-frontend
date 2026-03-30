import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Building2, Mail, Phone, MapPin, Calendar, Users, GraduationCap } from 'lucide-react';
import { adminApi } from '../../api/admin';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Skeleton from '../../components/ui/Skeleton';
import { formatDate } from '../../utils/formatters';
import type { BadgeVariant } from '../../components/ui/Badge';
import type { School } from '../../types';

const planVariant: Record<School['plan'], BadgeVariant> = {
  basic:      'primary',
  premium:    'secondary',
  enterprise: 'success',
};

const planLabel: Record<School['plan'], string> = {
  basic:      'Basique',
  premium:    'Premium',
  enterprise: 'Entreprise',
};

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="w-8 h-8 rounded-lg bg-school-50 flex items-center justify-center flex-shrink-0 mt-0.5">
      <span className="text-school-600">{icon}</span>
    </div>
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground mt-0.5 break-words">{value}</p>
    </div>
  </div>
);

const AdminSchoolDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: school, isLoading } = useQuery({
    queryKey: ['admin-school', id],
    queryFn: () =>
      adminApi.getSchool(Number(id)).then((r) => r.data.data),
    enabled: !!id,
  });

  const { data: statsData, isLoading: isStatsLoading } = useQuery({
    queryKey: ['admin-school-stats', id],
    queryFn: () =>
      adminApi.schoolStats(Number(id)).then((r) => r.data),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="space-y-5 animate-fade-in">
        <Skeleton className="h-10 rounded-xl w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Skeleton className="lg:col-span-2 h-72 rounded-xl" />
          <Skeleton className="h-72 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!school) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Building2 size={40} className="text-muted-foreground/30 mb-3" />
        <p className="font-medium text-foreground mb-1">École introuvable</p>
        <p className="text-sm text-muted-foreground mb-4">
          Cette école n'existe pas ou a été supprimée.
        </p>
        <Button
          variant="outline"
          icon={<ArrowLeft size={16} />}
          onClick={() => navigate('/admin/schools')}
        >
          Retour à la liste
        </Button>
      </div>
    );
  }

  // Statistiques brutes de l'API
  const rawStats = (statsData as { data?: Record<string, unknown> } | undefined)?.data ?? {};

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title={school.name}
        breadcrumbs={[
          { label: 'Écoles', href: '/admin/schools' },
          { label: school.name },
        ]}
        actions={
          <Button
            variant="ghost"
            size="sm"
            icon={<ArrowLeft size={16} />}
            onClick={() => navigate('/admin/schools')}
          >
            Retour
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ── Informations principales ── */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-border p-6 shadow-card space-y-5">

          {/* En-tête avec logo / code */}
          <div className="flex items-start gap-4 pb-5 border-b border-border">
            <div className="w-14 h-14 rounded-xl bg-school-50 flex items-center justify-center flex-shrink-0">
              {school.logo ? (
                <img
                  src={school.logo}
                  alt={school.name}
                  className="w-full h-full rounded-xl object-cover"
                />
              ) : (
                <Building2 size={28} className="text-school-600" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-bold text-foreground font-heading truncate">
                {school.name}
              </h2>
              <div className="flex items-center flex-wrap gap-2 mt-1.5">
                <span className="text-xs font-mono bg-school-50 text-school-600 border border-school-200 px-2 py-0.5 rounded">
                  {school.code}
                </span>
                <Badge variant={school.is_active ? 'success' : 'muted'} dot>
                  {school.is_active ? 'Active' : 'Inactive'}
                </Badge>
                <Badge variant={planVariant[school.plan]}>
                  {planLabel[school.plan]}
                </Badge>
              </div>
            </div>
          </div>

          {/* Coordonnées */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoRow
              icon={<Mail size={15} />}
              label="Adresse e-mail"
              value={school.email}
            />
            <InfoRow
              icon={<Phone size={15} />}
              label="Téléphone"
              value={school.phone ?? '—'}
            />
            <InfoRow
              icon={<MapPin size={15} />}
              label="Adresse"
              value={school.address ?? '—'}
            />
            <InfoRow
              icon={<Calendar size={15} />}
              label="Date de création"
              value={formatDate(school.created_at)}
            />
          </div>

          {/* Limites du plan */}
          <div className="pt-4 border-t border-border">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Limites du plan
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border">
                <div className="w-8 h-8 rounded-lg bg-school-100 flex items-center justify-center">
                  <GraduationCap size={15} className="text-school-600" />
                </div>
                <div>
                  <div className="text-lg font-bold text-foreground leading-none">
                    {school.max_students}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">Max élèves</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Users size={15} className="text-blue-600" />
                </div>
                <div>
                  <div className="text-lg font-bold text-foreground leading-none">
                    {school.max_teachers}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">Max enseignants</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Statistiques ── */}
        <div className="bg-white rounded-xl border border-border p-5 shadow-card">
          <h3 className="font-semibold text-foreground mb-4">Statistiques</h3>

          {isStatsLoading ? (
            <Skeleton lines={6} />
          ) : Object.keys(rawStats).length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              Aucune statistique disponible.
            </p>
          ) : (
            <dl className="space-y-3">
              {Object.entries(rawStats).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <dt className="text-sm text-muted-foreground capitalize">
                    {key.replace(/_/g, ' ')}
                  </dt>
                  <dd className="text-sm font-semibold text-foreground">
                    {String(value)}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSchoolDetail;

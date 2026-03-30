import React, { useState } from 'react';
import { Search, UserCog, Shield, GraduationCap, UsersIcon, User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import DataTable from '../../components/ui/DataTable';
import type { Column } from '../../components/ui/DataTable';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import type { BadgeVariant } from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import PageHeader from '../../components/ui/PageHeader';
import type { User as UserType, PaginatedResponse } from '../../types';
import { formatDate, getStatusLabel } from '../../utils/formatters';

const ROLE_OPTIONS = [
  { value: '', label: 'Tous les rôles' },
  { value: 'school_admin', label: 'Administrateur' },
  { value: 'teacher', label: 'Enseignant' },
  { value: 'student', label: 'Élève' },
  { value: 'parent', label: 'Parent' },
];

const ROLE_BADGE: Record<string, { variant: BadgeVariant; icon: React.ReactNode }> = {
  super_admin: { variant: 'danger', icon: <Shield size={11} /> },
  school_admin: { variant: 'primary', icon: <UserCog size={11} /> },
  teacher: { variant: 'info', icon: <UsersIcon size={11} /> },
  student: { variant: 'success', icon: <GraduationCap size={11} /> },
  parent: { variant: 'secondary', icon: <User size={11} /> },
};

const Users: React.FC = () => {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['users', { search, role, page }],
    queryFn: () =>
      api
        .get<PaginatedResponse<UserType>>('/users', {
          params: {
            search: search || undefined,
            role: role || undefined,
            page,
            per_page: 15,
          },
        })
        .then((r) => r.data),
  });

  const columns: Column<UserType>[] = [
    {
      key: 'name',
      header: 'Utilisateur',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.name} src={row.avatar} size="sm" />
          <div>
            <div className="font-medium text-foreground">{row.name}</div>
            <div className="text-xs text-muted-foreground">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Rôle',
      render: (val) => {
        const roleKey = String(val);
        const config = ROLE_BADGE[roleKey] ?? { variant: 'muted' as BadgeVariant, icon: null };
        return (
          <Badge variant={config.variant} className="gap-1">
            {config.icon}
            {getStatusLabel(roleKey)}
          </Badge>
        );
      },
    },
    {
      key: 'phone',
      header: 'Téléphone',
      render: (val) => (
        <span className="text-sm text-muted-foreground">{String(val || '—')}</span>
      ),
    },
    {
      key: 'is_active',
      header: 'Statut',
      render: (val) => (
        <Badge variant={(val ? 'success' : 'muted') as BadgeVariant} dot>
          {val ? 'Actif' : 'Inactif'}
        </Badge>
      ),
    },
    {
      key: 'created_at',
      header: 'Créé le',
      render: (val) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(val != null ? String(val) : undefined)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Gestion des utilisateurs"
        subtitle={`${data?.meta.total ?? 0} comptes au total`}
        breadcrumbs={[
          { label: 'Tableau de bord', href: '/dashboard' },
          { label: 'Utilisateurs' },
        ]}
      />

      {/* Filtres */}
      <div className="bg-white rounded-xl border border-border p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Rechercher par nom, email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            icon={<Search size={16} />}
          />
        </div>
        <div className="sm:w-48">
          <Select
            options={ROLE_OPTIONS}
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setPage(1);
            }}
            placeholder="Tous les rôles"
          />
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        loading={isLoading}
        currentPage={page}
        totalPages={data?.meta.last_page}
        onPageChange={setPage}
        emptyTitle="Aucun utilisateur"
        emptyDescription="Aucun compte ne correspond aux critères de recherche."
      />
    </div>
  );
};

export default Users;

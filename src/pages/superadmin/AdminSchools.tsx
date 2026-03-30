import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Building2, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../api/admin';
import PageHeader from '../../components/ui/PageHeader';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import DataTable from '../../components/ui/DataTable';
import type { Column } from '../../components/ui/DataTable';
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

const AdminSchools: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-schools', search, page],
    queryFn: () =>
      adminApi.schools({ search: search || undefined, page }).then((r) => r.data),
  });

  const columns: Column<School>[] = [
    {
      key: 'name',
      header: 'École',
      render: (_val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-school-50 flex items-center justify-center flex-shrink-0">
            <Building2 size={16} className="text-school-600" />
          </div>
          <div className="min-w-0">
            <div className="font-medium text-foreground text-sm truncate">{row.name}</div>
            <div className="text-xs text-muted-foreground font-mono">{row.code}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      render: (val) => (
        <span className="text-sm text-muted-foreground">{String(val ?? '—')}</span>
      ),
    },
    {
      key: 'phone',
      header: 'Téléphone',
      render: (val) => (
        <span className="text-sm text-muted-foreground">{String(val ?? '—')}</span>
      ),
    },
    {
      key: 'plan',
      header: 'Plan',
      render: (val) => {
        const plan = val as School['plan'];
        return (
          <Badge variant={planVariant[plan] ?? 'muted'}>
            {planLabel[plan] ?? String(plan)}
          </Badge>
        );
      },
    },
    {
      key: 'is_active',
      header: 'Statut',
      render: (val) => (
        <Badge variant={val ? 'success' : 'muted'} dot>
          {val ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'max_students',
      header: 'Max élèves',
      render: (val) => (
        <span className="text-sm font-medium text-foreground">{String(val)}</span>
      ),
      headerClassName: 'text-right',
      className: 'text-right',
    },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Gestion des écoles"
        subtitle={
          data
            ? `${data.meta.total} école${data.meta.total > 1 ? 's' : ''} enregistrée${data.meta.total > 1 ? 's' : ''}`
            : 'Toutes les écoles de la plateforme'
        }
      />

      {/* Barre de recherche */}
      <div className="bg-white rounded-xl border border-border p-4 shadow-card">
        <Input
          placeholder="Rechercher par nom, code…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          icon={<Search size={16} />}
        />
      </div>

      {/* Tableau */}
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        loading={isLoading}
        currentPage={page}
        totalPages={data?.meta.last_page}
        onPageChange={setPage}
        onRowClick={(row) => navigate(`/admin/schools/${row.id}`)}
        emptyTitle="Aucune école"
        emptyDescription="Aucune école n'est enregistrée sur la plateforme."
      />
    </div>
  );
};

export default AdminSchools;

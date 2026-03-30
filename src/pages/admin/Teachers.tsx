import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Eye, Trash2, Users } from 'lucide-react';
import { useTeachers, useDeleteTeacher } from '../../hooks/useTeachers';
import DataTable from '../../components/ui/DataTable';
import type { Column } from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import type { BadgeVariant } from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import PageHeader from '../../components/ui/PageHeader';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import type { Teacher } from '../../types';

const Teachers: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading } = useTeachers({
    search: search || undefined,
    page,
    per_page: 15,
  });
  const deleteMutation = useDeleteTeacher();

  const columns: Column<Teacher>[] = [
    {
      key: 'full_name',
      header: 'Enseignant',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.full_name} src={row.avatar} size="sm" />
          <div>
            <div className="font-medium text-foreground">{row.full_name}</div>
            <div className="text-xs text-muted-foreground">#{row.employee_number}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      render: (val) => (
        <span className="text-sm text-foreground">{String(val || '—')}</span>
      ),
    },
    {
      key: 'phone',
      header: 'Téléphone',
      render: (val) => (
        <span className="text-sm text-muted-foreground">{String(val || '—')}</span>
      ),
    },
    {
      key: 'specialization',
      header: 'Spécialisation',
      render: (val) => (
        <span className="text-sm">{String(val || '—')}</span>
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
      key: 'id',
      header: 'Actions',
      render: (_, row) => (
        <div
          className="flex items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => navigate(`/teachers/${row.id}`)}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-school-600 transition-colors"
            title="Voir le profil"
            type="button"
          >
            <Eye size={15} />
          </button>
          <button
            onClick={() => setDeleteId(row.id)}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors"
            title="Supprimer"
            type="button"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
      className: 'w-24',
    },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Gestion des enseignants"
        subtitle={`${data?.meta.total ?? 0} enseignants au total`}
        breadcrumbs={[
          { label: 'Tableau de bord', href: '/dashboard' },
          { label: 'Enseignants' },
        ]}
        actions={
          <Button
            variant="primary"
            icon={<Plus size={16} />}
            onClick={() => navigate('/teachers/new')}
          >
            Nouvel enseignant
          </Button>
        }
      />

      {/* Barre de recherche */}
      <div className="bg-white rounded-xl border border-border p-4">
        <Input
          placeholder="Rechercher par nom, email, spécialisation..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          icon={<Search size={16} />}
        />
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        loading={isLoading}
        currentPage={page}
        totalPages={data?.meta.last_page}
        onPageChange={setPage}
        onRowClick={(row) => navigate(`/teachers/${row.id}`)}
        emptyTitle="Aucun enseignant"
        emptyDescription="Commencez par ajouter votre premier enseignant."
        emptyAction={{
          label: 'Ajouter un enseignant',
          onClick: () => navigate('/teachers/new'),
          icon: <Users size={16} />,
        }}
      />

      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            deleteMutation.mutate(deleteId, {
              onSuccess: () => setDeleteId(null),
            });
          }
        }}
        loading={deleteMutation.isPending}
        message="Cet enseignant sera définitivement supprimé. Cette action est irréversible."
      />
    </div>
  );
};

export default Teachers;

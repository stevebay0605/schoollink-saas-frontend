import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Eye, Pencil, Trash2, GraduationCap } from 'lucide-react';
import { useStudents, useDeleteStudent } from '../../hooks/useStudents';
import DataTable from '../../components/ui/DataTable';
import type { Column } from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import type { BadgeVariant } from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import PageHeader from '../../components/ui/PageHeader';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import type { Student } from '../../types';
import { getStatusColor, getStatusLabel } from '../../utils/formatters';

const STATUS_OPTIONS = [
  { value: '', label: 'Tous les statuts' },
  { value: 'active', label: 'Actif' },
  { value: 'inactive', label: 'Inactif' },
  { value: 'suspended', label: 'Suspendu' },
];

const Students: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading } = useStudents({
    search: search || undefined,
    status: status || undefined,
    page,
    per_page: 15,
  });
  const deleteMutation = useDeleteStudent();

  const columns: Column<Student>[] = [
    {
      key: 'full_name',
      header: 'Élève',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.full_name} src={row.avatar} size="sm" />
          <div>
            <div className="font-medium text-foreground">{row.full_name}</div>
            <div className="text-xs text-muted-foreground">#{row.student_number}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Contact',
      render: (_, row) => (
        <div>
          <div className="text-sm text-foreground">{row.email || '—'}</div>
          <div className="text-xs text-muted-foreground">{row.phone || ''}</div>
        </div>
      ),
    },
    {
      key: 'gender',
      header: 'Genre',
      render: (val) => (val === 'M' ? 'Masculin' : val === 'F' ? 'Féminin' : '—'),
    },
    {
      key: 'guardian_name',
      header: 'Tuteur',
      render: (val) => String(val || '—'),
    },
    {
      key: 'status',
      header: 'Statut',
      render: (val) => (
        <Badge variant={getStatusColor(String(val)) as BadgeVariant} dot>
          {getStatusLabel(String(val))}
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
            onClick={() => navigate(`/students/${row.id}`)}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-school-600 transition-colors"
            title="Voir le profil"
            type="button"
          >
            <Eye size={15} />
          </button>
          <button
            onClick={() => navigate(`/students/${row.id}/edit`)}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-blue-50 hover:text-blue-600 transition-colors"
            title="Modifier"
            type="button"
          >
            <Pencil size={15} />
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
      className: 'w-28',
    },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Gestion des élèves"
        subtitle={`${data?.meta.total ?? 0} élèves au total`}
        breadcrumbs={[
          { label: 'Tableau de bord', href: '/dashboard' },
          { label: 'Élèves' },
        ]}
        actions={
          <Button
            variant="primary"
            icon={<Plus size={16} />}
            onClick={() => navigate('/students/new')}
          >
            Nouvel élève
          </Button>
        }
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
            options={STATUS_OPTIONS}
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            placeholder="Tous les statuts"
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
        onRowClick={(row) => navigate(`/students/${row.id}`)}
        emptyTitle="Aucun élève trouvé"
        emptyDescription="Commencez par ajouter votre premier élève."
        emptyAction={{
          label: 'Ajouter un élève',
          onClick: () => navigate('/students/new'),
          icon: <GraduationCap size={16} />,
        }}
      />

      {/* Confirmation suppression */}
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
        message="Cet élève sera définitivement supprimé. Toutes ses notes et présences seront perdues."
      />
    </div>
  );
};

export default Students;

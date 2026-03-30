import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Eye, Trash2, School } from 'lucide-react';
import { useClassrooms, useDeleteClassroom } from '../../hooks/useClassrooms';
import DataTable from '../../components/ui/DataTable';
import type { Column } from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import PageHeader from '../../components/ui/PageHeader';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import type { Classroom } from '../../types';

const Classrooms: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading } = useClassrooms({ search: search || undefined });
  const deleteMutation = useDeleteClassroom();

  const columns: Column<Classroom>[] = [
    {
      key: 'name',
      header: 'Classe',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-school-50 flex items-center justify-center flex-shrink-0">
            <School size={14} className="text-school-600" />
          </div>
          <div>
            <div className="font-medium text-foreground">{row.name}</div>
            <div className="text-xs text-muted-foreground">{row.level}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'level',
      header: 'Niveau',
      render: (val) => <span className="text-sm text-foreground">{String(val || '—')}</span>,
    },
    {
      key: 'academic_year',
      header: 'Année scolaire',
      render: (val) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent text-school-600 border border-school-200">
          {String(val || '—')}
        </span>
      ),
    },
    {
      key: 'capacity',
      header: 'Capacité',
      render: (val) => (
        <span className="text-sm font-medium text-foreground">{String(val || '—')}</span>
      ),
    },
    {
      key: 'students_count',
      header: 'Élèves inscrits',
      render: (val, row) => {
        const count = Number(val ?? 0);
        const cap = row.capacity;
        const pct = cap > 0 ? Math.round((count / cap) * 100) : 0;
        const color =
          pct >= 90 ? 'text-red-600' : pct >= 70 ? 'text-amber-600' : 'text-emerald-600';
        return (
          <div className="flex items-center gap-2">
            <span className={`text-sm font-semibold ${color}`}>
              {count} / {cap}
            </span>
            <div className="w-16 h-1.5 bg-border rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(pct, 100)}%` }}
              />
            </div>
          </div>
        );
      },
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
            onClick={() => navigate(`/classrooms/${row.id}`)}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-school-600 transition-colors"
            title="Voir le détail"
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
        title="Gestion des classes"
        subtitle={`${data?.meta.total ?? data?.data.length ?? 0} classes au total`}
        breadcrumbs={[
          { label: 'Tableau de bord', href: '/dashboard' },
          { label: 'Classes' },
        ]}
        actions={
          <Button
            variant="primary"
            icon={<Plus size={16} />}
            onClick={() => navigate('/classrooms/new')}
          >
            Nouvelle classe
          </Button>
        }
      />

      {/* Barre de recherche */}
      <div className="bg-white rounded-xl border border-border p-4">
        <Input
          placeholder="Rechercher par nom ou niveau..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search size={16} />}
        />
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        loading={isLoading}
        currentPage={data?.meta.current_page}
        totalPages={data?.meta.last_page}
        onRowClick={(row) => navigate(`/classrooms/${row.id}`)}
        emptyTitle="Aucune classe"
        emptyDescription="Commencez par créer votre première classe."
        emptyAction={{
          label: 'Créer une classe',
          onClick: () => navigate('/classrooms/new'),
          icon: <School size={16} />,
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
        message="Cette classe sera définitivement supprimée. Les élèves inscrits seront désinscrits."
      />
    </div>
  );
};

export default Classrooms;

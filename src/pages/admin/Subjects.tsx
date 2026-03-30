import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { subjectsApi } from '../../api/subjects';
import DataTable from '../../components/ui/DataTable';
import type { Column } from '../../components/ui/DataTable';
import Avatar from '../../components/ui/Avatar';
import Input from '../../components/ui/Input';
import PageHeader from '../../components/ui/PageHeader';
import type { Subject } from '../../types';

const Subjects: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['subjects', { search, page }],
    queryFn: () =>
      subjectsApi.list({ search: search || undefined }).then((r) => r.data),
  });

  const columns: Column<Subject>[] = [
    {
      key: 'name',
      header: 'Matière',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
            <BookOpen size={14} className="text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-foreground">{row.name}</div>
            <div className="text-xs text-muted-foreground">{row.description || ''}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'code',
      header: 'Code',
      render: (val) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono font-semibold bg-muted text-foreground border border-border">
          {String(val || '—')}
        </span>
      ),
    },
    {
      key: 'classroom',
      header: 'Classe',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          {row.classroom ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/classrooms/${row.classroom_id}`);
              }}
              className="text-sm text-school-600 hover:underline font-medium"
            >
              {row.classroom.name}
            </button>
          ) : (
            <span className="text-sm text-muted-foreground">—</span>
          )}
        </div>
      ),
    },
    {
      key: 'teacher',
      header: 'Enseignant',
      render: (_, row) =>
        row.teacher ? (
          <div className="flex items-center gap-2">
            <Avatar name={row.teacher.full_name} src={row.teacher.avatar} size="xs" />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/teachers/${row.teacher_id}`);
              }}
              className="text-sm text-foreground hover:text-school-600 transition-colors"
            >
              {row.teacher.full_name}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users size={13} />
            <span className="text-sm">Non assigné</span>
          </div>
        ),
    },
    {
      key: 'coefficient',
      header: 'Coefficient',
      render: (val) => (
        <div className="flex items-center gap-1">
          <span className="text-sm font-semibold text-school-600">×{String(val || '1')}</span>
        </div>
      ),
    },
    {
      key: 'hours_per_week',
      header: 'H/semaine',
      render: (val) => (
        <span className="text-sm text-muted-foreground">
          {val ? `${String(val)}h` : '—'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Matières"
        subtitle={`${data?.meta.total ?? data?.data.length ?? 0} matières au total`}
        breadcrumbs={[
          { label: 'Tableau de bord', href: '/dashboard' },
          { label: 'Matières' },
        ]}
      />

      {/* Barre de recherche */}
      <div className="bg-white rounded-xl border border-border p-4">
        <Input
          placeholder="Rechercher une matière..."
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
        emptyTitle="Aucune matière"
        emptyDescription="Les matières sont créées automatiquement lors de la configuration des classes."
      />
    </div>
  );
};

export default Subjects;

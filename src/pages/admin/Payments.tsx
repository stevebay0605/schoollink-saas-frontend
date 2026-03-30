import React, { useState } from 'react';
import { CheckCircle, CreditCard, Clock, AlertCircle } from 'lucide-react';
import { usePayments, useConfirmPayment } from '../../hooks/usePayments';
import DataTable from '../../components/ui/DataTable';
import type { Column } from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import type { BadgeVariant } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import PageHeader from '../../components/ui/PageHeader';
import Skeleton from '../../components/ui/Skeleton';
import {
  formatAmount,
  formatDate,
  getStatusColor,
  getStatusLabel,
} from '../../utils/formatters';
import { ACADEMIC_YEARS } from '../../utils/constants';
import type { Payment } from '../../types';

const STATUS_OPTIONS = [
  { value: '', label: 'Tous les statuts' },
  { value: 'pending', label: 'En attente' },
  { value: 'paid', label: 'Payé' },
  { value: 'overdue', label: 'En retard' },
  { value: 'cancelled', label: 'Annulé' },
];

const YEAR_OPTIONS = [
  { value: '', label: 'Toutes les années' },
  ...ACADEMIC_YEARS.map((y) => ({ value: y, label: y })),
];

const Payments: React.FC = () => {
  const [status, setStatus] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [page, setPage] = useState(1);
  const confirmMutation = useConfirmPayment();

  const { data, isLoading } = usePayments({
    status: status || undefined,
    academic_year: academicYear || undefined,
  });

  // Calcul des totaux filtrés
  const payments = data?.data ?? [];
  const totalPaid = payments
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);
  const totalOverdue = payments
    .filter((p) => p.status === 'overdue')
    .reduce((sum, p) => sum + p.amount, 0);

  const columns: Column<Payment>[] = [
    {
      key: 'description',
      header: 'Description',
      render: (_, row) => (
        <div>
          <div className="font-medium text-foreground">{row.description}</div>
          <div className="text-xs text-muted-foreground">{row.payment_type}</div>
        </div>
      ),
    },
    {
      key: 'student',
      header: 'Élève',
      render: (_, row) => (
        <span className="text-sm text-foreground">
          {row.student?.full_name ?? '—'}
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Montant',
      render: (val) => (
        <span className="font-semibold text-school-600 text-sm">
          {formatAmount(Number(val))}
        </span>
      ),
    },
    {
      key: 'academic_year',
      header: 'Année',
      render: (val) => (
        <span className="text-xs text-muted-foreground font-medium">
          {String(val || '—')}
        </span>
      ),
    },
    {
      key: 'due_date',
      header: 'Échéance',
      render: (val) => (
        <span className="text-sm text-foreground">
          {formatDate(val != null ? String(val) : undefined)}
        </span>
      ),
    },
    {
      key: 'paid_at',
      header: 'Payé le',
      render: (val) => (
        <span className="text-sm text-muted-foreground">
          {val ? formatDate(String(val)) : '—'}
        </span>
      ),
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
      render: (_, row) =>
        row.status === 'pending' ? (
          <Button
            variant="outline"
            size="sm"
            icon={<CheckCircle size={13} />}
            loading={confirmMutation.isPending}
            onClick={(e) => {
              e.stopPropagation();
              confirmMutation.mutate(row.id);
            }}
          >
            Confirmer
          </Button>
        ) : null,
      className: 'w-36',
    },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Gestion des paiements"
        subtitle="Suivi des frais scolaires"
        breadcrumbs={[
          { label: 'Tableau de bord', href: '/dashboard' },
          { label: 'Paiements' },
        ]}
      />

      {/* Résumé financier */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-border p-4 shadow-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
              <CheckCircle size={18} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total encaissé</p>
              <p className="text-base font-bold text-emerald-600">
                {formatAmount(totalPaid)}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-border p-4 shadow-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
              <Clock size={18} className="text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">En attente</p>
              <p className="text-base font-bold text-amber-600">
                {formatAmount(totalPending)}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-border p-4 shadow-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
              <AlertCircle size={18} className="text-red-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">En retard</p>
              <p className="text-base font-bold text-red-600">
                {formatAmount(totalOverdue)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filtres */}
      <div className="bg-white rounded-xl border border-border p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-end">
        <div className="sm:w-52">
          <Select
            label="Statut"
            options={STATUS_OPTIONS}
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="sm:w-48">
          <Select
            label="Année scolaire"
            options={YEAR_OPTIONS}
            value={academicYear}
            onChange={(e) => {
              setAcademicYear(e.target.value);
              setPage(1);
            }}
          />
        </div>
        {(status || academicYear) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setStatus('');
              setAcademicYear('');
              setPage(1);
            }}
            className="sm:mb-0.5"
          >
            Réinitialiser
          </Button>
        )}
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={payments}
        loading={isLoading}
        currentPage={page}
        totalPages={data?.meta.last_page}
        onPageChange={setPage}
        emptyTitle="Aucun paiement"
        emptyDescription="Aucun paiement ne correspond aux filtres sélectionnés."
        emptyAction={
          status || academicYear
            ? {
                label: 'Voir tous les paiements',
                onClick: () => {
                  setStatus('');
                  setAcademicYear('');
                },
                icon: <CreditCard size={16} />,
              }
            : undefined
        }
      />
    </div>
  );
};

export default Payments;

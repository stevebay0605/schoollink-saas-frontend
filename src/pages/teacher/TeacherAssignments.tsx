import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, ClipboardList, Calendar } from 'lucide-react';
import { assignmentsApi } from '../../api/assignments';
import { subjectsApi } from '../../api/subjects';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import EmptyState from '../../components/ui/EmptyState';
import Skeleton from '../../components/ui/Skeleton';
import { formatDate, getStatusColor, getStatusLabel } from '../../utils/formatters';
import type { BadgeVariant } from '../../components/ui/Badge';
import toast from 'react-hot-toast';

const TeacherAssignments: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [maxScore, setMaxScore] = useState('20');

  const queryClient = useQueryClient();

  const { data: assignmentsData, isLoading } = useQuery({
    queryKey: ['assignments'],
    queryFn: () => assignmentsApi.list().then((r) => r.data),
  });

  const { data: subjectsData } = useQuery({
    queryKey: ['my-subjects'],
    queryFn: () => subjectsApi.list().then((r) => r.data),
  });

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSelectedSubjectId('');
    setDueDate('');
    setMaxScore('20');
  };

  const createMutation = useMutation({
    mutationFn: () =>
      assignmentsApi.create({
        subject_id: Number(selectedSubjectId),
        title,
        description: description || undefined,
        due_date: dueDate,
        max_score: Number(maxScore),
        status: 'open',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Devoir créé avec succès');
      setShowModal(false);
      resetForm();
    },
    onError: () => toast.error('Erreur lors de la création du devoir'),
  });

  const subjectOptions =
    subjectsData?.data.map((s) => ({
      value: s.id,
      label: s.classroom ? `${s.name} — ${s.classroom.name}` : s.name,
    })) ?? [];

  const handleClose = () => {
    setShowModal(false);
    resetForm();
  };

  const isFormValid =
    title.trim() !== '' &&
    selectedSubjectId !== '' &&
    dueDate !== '' &&
    Number(maxScore) > 0;

  // Regrouper par statut pour un affichage plus clair
  const openAssignments = assignmentsData?.data.filter((a) => a.status === 'open') ?? [];
  const closedAssignments = assignmentsData?.data.filter((a) => a.status === 'closed') ?? [];

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Mes devoirs"
        subtitle="Gérez vos devoirs et évaluations"
        actions={
          <Button
            variant="primary"
            icon={<Plus size={16} />}
            onClick={() => setShowModal(true)}
          >
            Nouveau devoir
          </Button>
        }
      />

      {/* Liste */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : !assignmentsData?.data.length ? (
        <div className="bg-white rounded-xl border border-border shadow-card">
          <EmptyState
            icon={<ClipboardList size={28} className="text-amber-500" />}
            title="Aucun devoir"
            description="Créez votre premier devoir pour vos élèves."
            action={{
              label: 'Créer un devoir',
              onClick: () => setShowModal(true),
              icon: <Plus size={16} />,
            }}
          />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Devoirs ouverts */}
          {openAssignments.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
                Ouverts ({openAssignments.length})
              </h2>
              <div className="space-y-3">
                {openAssignments.map((assignment) => (
                  <AssignmentRow
                    key={assignment.id}
                    assignment={assignment}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Devoirs fermés */}
          {closedAssignments.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
                Fermés ({closedAssignments.length})
              </h2>
              <div className="space-y-3">
                {closedAssignments.map((assignment) => (
                  <AssignmentRow
                    key={assignment.id}
                    assignment={assignment}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Modal création */}
      <Modal
        isOpen={showModal}
        onClose={handleClose}
        title="Nouveau devoir"
        footer={
          <>
            <Button variant="ghost" onClick={handleClose}>
              Annuler
            </Button>
            <Button
              variant="primary"
              onClick={() => createMutation.mutate()}
              loading={createMutation.isPending}
              disabled={!isFormValid}
            >
              Créer le devoir
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Titre du devoir *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex. : Contrôle de mathématiques n°2..."
            required
          />

          <Select
            label="Matière *"
            options={subjectOptions}
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            placeholder="Choisir une matière"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Date limite *"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
            <Input
              label="Note maximale *"
              type="number"
              min={1}
              max={100}
              value={maxScore}
              onChange={(e) => setMaxScore(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground">
              Description / Consignes
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground bg-white resize-none focus:outline-none focus:ring-2 focus:ring-school-600 focus:border-school-600 transition-colors hover:border-muted-foreground"
              placeholder="Consignes optionnelles..."
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

/* ── Sous-composant ligne devoir ─────────────────────────────────────── */
interface AssignmentRowProps {
  assignment: {
    id: number;
    title: string;
    due_date: string;
    max_score: number;
    status: 'open' | 'closed';
    description?: string;
    subject?: { name: string; classroom?: { name: string } };
  };
}

const AssignmentRow: React.FC<AssignmentRowProps> = ({ assignment }) => (
  <div className="bg-white rounded-xl border border-border p-4 flex items-center gap-4 shadow-card hover:shadow-md transition-shadow">
    {/* Icône */}
    <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
      <ClipboardList size={18} className="text-amber-600" />
    </div>

    {/* Contenu */}
    <div className="flex-1 min-w-0">
      <div className="font-semibold text-foreground text-sm truncate">
        {assignment.title}
      </div>
      <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-2 mt-0.5">
        {assignment.subject && (
          <span className="font-medium text-school-600">
            {assignment.subject.name}
          </span>
        )}
        {assignment.subject?.classroom && (
          <span className="bg-muted px-1.5 py-0.5 rounded text-[11px]">
            {assignment.subject.classroom.name}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Calendar size={11} />
          Échéance&nbsp;: {formatDate(assignment.due_date)}
        </span>
        <span className="font-medium">/{assignment.max_score} pts</span>
      </div>
      {assignment.description && (
        <p className="text-xs text-muted-foreground mt-1 truncate">
          {assignment.description}
        </p>
      )}
    </div>

    {/* Badge statut */}
    <Badge
      variant={getStatusColor(assignment.status) as BadgeVariant}
      dot
    >
      {getStatusLabel(assignment.status)}
    </Badge>
  </div>
);

export default TeacherAssignments;

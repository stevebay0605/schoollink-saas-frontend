import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, BookMarked, Calendar, FileText } from 'lucide-react';
import { coursesApi } from '../../api/courses';
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

const TeacherCourses: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const queryClient = useQueryClient();

  const { data: coursesData, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: () => coursesApi.list().then((r) => r.data),
  });

  const { data: subjectsData } = useQuery({
    queryKey: ['my-subjects'],
    queryFn: () => subjectsApi.list().then((r) => r.data),
  });

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSelectedSubjectId('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const createMutation = useMutation({
    mutationFn: () =>
      coursesApi.create({
        subject_id: Number(selectedSubjectId),
        title,
        description: description || undefined,
        date,
        status: 'published',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Cours créé avec succès');
      setShowModal(false);
      resetForm();
    },
    onError: () => toast.error('Erreur lors de la création du cours'),
  });

  const subjectOptions =
    subjectsData?.data.map((s) => ({
      value: s.id,
      label: s.classroom
        ? `${s.name} — ${s.classroom.name}`
        : s.name,
    })) ?? [];

  const handleClose = () => {
    setShowModal(false);
    resetForm();
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Mes cours"
        subtitle="Gérez vos séances de cours"
        actions={
          <Button
            variant="primary"
            icon={<Plus size={16} />}
            onClick={() => setShowModal(true)}
          >
            Nouveau cours
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
      ) : !coursesData?.data.length ? (
        <div className="bg-white rounded-xl border border-border shadow-card">
          <EmptyState
            icon={<BookMarked size={28} className="text-school-600" />}
            title="Aucun cours"
            description="Créez votre premier cours pour commencer."
            action={{
              label: 'Créer un cours',
              onClick: () => setShowModal(true),
              icon: <Plus size={16} />,
            }}
          />
        </div>
      ) : (
        <div className="space-y-3">
          {coursesData.data.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl border border-border p-4 flex items-center gap-4 shadow-card hover:shadow-md transition-shadow"
            >
              {/* Icône */}
              <div className="w-10 h-10 rounded-lg bg-school-50 flex items-center justify-center flex-shrink-0">
                <FileText size={18} className="text-school-600" />
              </div>

              {/* Contenu */}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-foreground text-sm truncate">
                  {course.title}
                </div>
                <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-2 mt-0.5">
                  {course.subject && (
                    <span className="font-medium text-school-600">
                      {course.subject.name}
                    </span>
                  )}
                  {course.subject?.classroom && (
                    <span className="bg-muted px-1.5 py-0.5 rounded text-[11px]">
                      {course.subject.classroom.name}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar size={11} />
                    {formatDate(course.date)}
                  </span>
                  {course.duration && (
                    <span>{course.duration}&nbsp;min</span>
                  )}
                </div>
                {course.description && (
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {course.description}
                  </p>
                )}
              </div>

              {/* Badge statut */}
              <Badge
                variant={getStatusColor(course.status) as BadgeVariant}
                dot
              >
                {getStatusLabel(course.status)}
              </Badge>
            </div>
          ))}
        </div>
      )}

      {/* Modal création */}
      <Modal
        isOpen={showModal}
        onClose={handleClose}
        title="Nouveau cours"
        footer={
          <>
            <Button variant="ghost" onClick={handleClose}>
              Annuler
            </Button>
            <Button
              variant="primary"
              onClick={() => createMutation.mutate()}
              loading={createMutation.isPending}
              disabled={!title.trim() || !selectedSubjectId}
            >
              Créer le cours
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Titre du cours *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex. : Introduction aux fractions..."
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

          <Input
            label="Date du cours"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground bg-white resize-none focus:outline-none focus:ring-2 focus:ring-school-600 focus:border-school-600 transition-colors hover:border-muted-foreground"
              placeholder="Description optionnelle..."
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TeacherCourses;

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, BookOpen, ClipboardList, CheckCircle2 } from 'lucide-react';
import { subjectsApi } from '../../api/subjects';
import { assignmentsApi } from '../../api/assignments';
import { classroomsApi } from '../../api/classrooms';
import { gradesApi } from '../../api/grades';
import PageHeader from '../../components/ui/PageHeader';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import Skeleton from '../../components/ui/Skeleton';
import toast from 'react-hot-toast';
import type { Student, GradeForm } from '../../types';

interface GradeEntry {
  student_id: number;
  score: string;
  comment: string;
}

const TeacherGrades: React.FC = () => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | null>(null);
  const [grades, setGrades] = useState<Record<number, GradeEntry>>({});

  const queryClient = useQueryClient();

  /* ── Données ────────────────────────────────────────────────────── */
  const { data: subjectsData } = useQuery({
    queryKey: ['my-subjects'],
    queryFn: () => subjectsApi.list().then((r) => r.data),
  });

  const { data: assignmentsData } = useQuery({
    queryKey: ['assignments', selectedSubjectId],
    queryFn: () =>
      assignmentsApi.list({ subject_id: selectedSubjectId! }).then((r) => r.data),
    enabled: !!selectedSubjectId,
  });

  const selectedSubject = subjectsData?.data.find((s) => s.id === selectedSubjectId);
  const classroomId = selectedSubject?.classroom?.id;

  const { data: studentsData, isLoading: studentsLoading } = useQuery({
    queryKey: ['classroom-students', classroomId],
    queryFn: () => classroomsApi.students(classroomId!).then((r) => r.data),
    enabled: !!classroomId,
  });

  const selectedAssignment = assignmentsData?.data.find(
    (a) => a.id === selectedAssignmentId,
  );

  /* ── Initialiser la grille quand les élèves arrivent ─────────── */
  useEffect(() => {
    if (studentsData?.data) {
      const initial: Record<number, GradeEntry> = {};
      studentsData.data.forEach((s: Student) => {
        initial[s.id] = { student_id: s.id, score: '', comment: '' };
      });
      setGrades(initial);
    }
  }, [studentsData]);

  /* ── Mutation bulk save ─────────────────────────────────────────── */
  const saveMutation = useMutation({
    mutationFn: (gradeList: GradeForm[]) =>
      gradesApi.createBulk(gradeList),
    onSuccess: () => {
      toast.success('Notes enregistrées avec succès !');
      queryClient.invalidateQueries({ queryKey: ['grades'] });
    },
    onError: () => toast.error("Erreur lors de l'enregistrement des notes"),
  });

  const handleSave = () => {
    if (!selectedAssignmentId) {
      toast.error('Veuillez sélectionner un devoir');
      return;
    }
    const gradeList: GradeForm[] = Object.values(grades)
      .filter((g) => g.score !== '')
      .map((g) => ({
        student_id: g.student_id,
        assignment_id: selectedAssignmentId,
        score: parseFloat(g.score),
        comment: g.comment || undefined,
      }));
    if (!gradeList.length) {
      toast.error('Aucune note à enregistrer');
      return;
    }
    saveMutation.mutate(gradeList);
  };

  /* ── Helpers ─────────────────────────────────────────────────────── */
  const updateGrade = (
    studentId: number,
    field: 'score' | 'comment',
    value: string,
  ) => {
    setGrades((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], [field]: value },
    }));
  };

  const filledCount = Object.values(grades).filter((g) => g.score !== '').length;
  const totalStudents = studentsData?.data?.length ?? 0;

  const subjectOptions =
    subjectsData?.data.map((s) => ({
      value: s.id,
      label: s.classroom ? `${s.name} — ${s.classroom.name}` : s.name,
    })) ?? [];

  const assignmentOptions =
    assignmentsData?.data.map((a) => ({
      value: a.id,
      label: `${a.title} (/${a.max_score})`,
    })) ?? [];

  /* ── Rendu ────────────────────────────────────────────────────────── */
  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Saisie des notes"
        subtitle="Enregistrez les notes de vos élèves par devoir"
      />

      {/* Sélecteurs */}
      <div className="bg-white rounded-xl border border-border p-5 shadow-card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Matière"
            options={subjectOptions}
            value={selectedSubjectId?.toString() ?? ''}
            onChange={(e) => {
              setSelectedSubjectId(Number(e.target.value) || null);
              setSelectedAssignmentId(null);
            }}
            placeholder="Sélectionner une matière"
          />
          <Select
            label="Devoir"
            options={assignmentOptions}
            value={selectedAssignmentId?.toString() ?? ''}
            onChange={(e) => setSelectedAssignmentId(Number(e.target.value) || null)}
            placeholder={
              !selectedSubjectId
                ? 'Choisissez d\'abord une matière'
                : assignmentOptions.length === 0
                ? 'Aucun devoir pour cette matière'
                : 'Sélectionner un devoir'
            }
            disabled={!selectedSubjectId}
          />
        </div>
      </div>

      {/* Tableau de saisie */}
      {selectedSubjectId && selectedAssignmentId ? (
        <div className="bg-white rounded-xl border border-border overflow-hidden shadow-card">
          {/* En-tête du tableau */}
          <div className="px-5 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold text-foreground">
                {selectedSubject?.name}
                {selectedSubject?.classroom && (
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    · {selectedSubject.classroom.name}
                  </span>
                )}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {selectedAssignment?.title} · Note sur&nbsp;
                <strong>{selectedAssignment?.max_score}</strong>
                {totalStudents > 0 && (
                  <span className="ml-2">
                    · {filledCount}/{totalStudents} notes saisies
                  </span>
                )}
              </p>
            </div>
            <Button
              variant="primary"
              icon={<Save size={16} />}
              onClick={handleSave}
              loading={saveMutation.isPending}
              disabled={filledCount === 0}
            >
              Enregistrer
            </Button>
          </div>

          {/* Barre de progression */}
          {totalStudents > 0 && (
            <div className="px-5 py-2 bg-muted/30 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-muted rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-school-600 rounded-full transition-all duration-300"
                    style={{ width: `${(filledCount / totalStudents) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground flex-shrink-0">
                  {Math.round((filledCount / totalStudents) * 100)}%
                </span>
              </div>
            </div>
          )}

          {/* Corps du tableau */}
          {studentsLoading ? (
            <div className="p-5">
              <Skeleton lines={6} />
            </div>
          ) : !studentsData?.data?.length ? (
            <div className="p-10 text-center">
              <BookOpen size={36} className="mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">Aucun élève dans cette classe</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/40">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Élève
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide w-36">
                      Note /{selectedAssignment?.max_score}
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Commentaire
                    </th>
                    <th className="px-4 py-3 w-10" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {studentsData.data.map((student: Student) => {
                    const gradeEntry = grades[student.id];
                    const isFilled = gradeEntry?.score !== '' && gradeEntry?.score !== undefined;
                    return (
                      <tr
                        key={student.id}
                        className="hover:bg-muted/20 transition-colors"
                      >
                        {/* Élève */}
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2.5">
                            <Avatar name={student.full_name} size="xs" />
                            <div>
                              <div className="text-sm font-medium text-foreground">
                                {student.full_name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                #{student.student_number}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Note */}
                        <td className="px-5 py-3">
                          <input
                            type="number"
                            min={0}
                            max={selectedAssignment?.max_score}
                            step="0.5"
                            value={gradeEntry?.score ?? ''}
                            onChange={(e) =>
                              updateGrade(student.id, 'score', e.target.value)
                            }
                            className="w-24 border border-border rounded-lg px-2.5 py-1.5 text-sm text-center font-medium bg-white focus:outline-none focus:ring-2 focus:ring-school-600 focus:border-school-600 hover:border-muted-foreground transition-colors"
                            placeholder="—"
                          />
                        </td>

                        {/* Commentaire */}
                        <td className="px-5 py-3">
                          <input
                            type="text"
                            value={gradeEntry?.comment ?? ''}
                            onChange={(e) =>
                              updateGrade(student.id, 'comment', e.target.value)
                            }
                            className="w-full border border-border rounded-lg px-2.5 py-1.5 text-sm text-foreground placeholder:text-muted-foreground bg-white focus:outline-none focus:ring-2 focus:ring-school-600 focus:border-school-600 hover:border-muted-foreground transition-colors"
                            placeholder="Optionnel..."
                          />
                        </td>

                        {/* Indicateur rempli */}
                        <td className="px-4 py-3 text-center">
                          {isFilled && (
                            <CheckCircle2
                              size={16}
                              className="text-emerald-500 mx-auto"
                            />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* État vide — pas encore de sélection */
        <div className="bg-white rounded-xl border border-border p-14 text-center shadow-card">
          {!selectedSubjectId ? (
            <>
              <div className="w-14 h-14 rounded-full bg-school-50 flex items-center justify-center mx-auto mb-3">
                <BookOpen size={26} className="text-school-600 opacity-60" />
              </div>
              <p className="text-muted-foreground text-sm">
                Sélectionnez une matière pour commencer la saisie des notes
              </p>
            </>
          ) : (
            <>
              <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-3">
                <ClipboardList size={26} className="text-amber-600 opacity-60" />
              </div>
              <p className="text-muted-foreground text-sm">
                Sélectionnez un devoir pour afficher la liste des élèves
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TeacherGrades;

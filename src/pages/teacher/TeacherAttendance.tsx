import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Save, UserCheck } from 'lucide-react';
import { clsx } from 'clsx';
import { subjectsApi } from '../../api/subjects';
import { classroomsApi } from '../../api/classrooms';
import { attendancesApi } from '../../api/attendances';
import PageHeader from '../../components/ui/PageHeader';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Avatar from '../../components/ui/Avatar';
import Skeleton from '../../components/ui/Skeleton';
import toast from 'react-hot-toast';
import type { Student } from '../../types';

type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

interface StatusConfig {
  label: string;
  short: string;
  activeClass: string;
  inactiveClass: string;
  countLabel: string;
}

const STATUS_CONFIG: Record<AttendanceStatus, StatusConfig> = {
  present: {
    label: 'Présent',
    short: 'P',
    activeClass: 'bg-emerald-500 text-white border-emerald-500 shadow-sm',
    inactiveClass: 'border-border text-muted-foreground hover:border-emerald-300 hover:text-emerald-600',
    countLabel: 'Présents',
  },
  absent: {
    label: 'Absent',
    short: 'A',
    activeClass: 'bg-red-500 text-white border-red-500 shadow-sm',
    inactiveClass: 'border-border text-muted-foreground hover:border-red-300 hover:text-red-600',
    countLabel: 'Absents',
  },
  late: {
    label: 'Retard',
    short: 'R',
    activeClass: 'bg-amber-500 text-white border-amber-500 shadow-sm',
    inactiveClass: 'border-border text-muted-foreground hover:border-amber-300 hover:text-amber-600',
    countLabel: 'En retard',
  },
  excused: {
    label: 'Excusé',
    short: 'E',
    activeClass: 'bg-blue-500 text-white border-blue-500 shadow-sm',
    inactiveClass: 'border-border text-muted-foreground hover:border-blue-300 hover:text-blue-600',
    countLabel: 'Excusés',
  },
};

const STATUSES: AttendanceStatus[] = ['present', 'absent', 'late', 'excused'];

const TeacherAttendance: React.FC = () => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState<Record<number, AttendanceStatus>>({});

  /* ── Données ────────────────────────────────────────────────────── */
  const { data: subjectsData } = useQuery({
    queryKey: ['my-subjects'],
    queryFn: () => subjectsApi.list().then((r) => r.data),
  });

  const selectedSubject = subjectsData?.data.find(
    (s) => s.id === selectedSubjectId,
  );
  const classroomId = selectedSubject?.classroom?.id;

  const { data: studentsData, isLoading: studentsLoading } = useQuery({
    queryKey: ['classroom-students', classroomId],
    queryFn: () => classroomsApi.students(classroomId!).then((r) => r.data),
    enabled: !!classroomId,
  });

  /* ── Pré-remplir "présent" par défaut ──────────────────────────── */
  useEffect(() => {
    if (studentsData?.data) {
      const initial: Record<number, AttendanceStatus> = {};
      studentsData.data.forEach((s: Student) => {
        initial[s.id] = 'present';
      });
      setAttendance(initial);
    }
  }, [studentsData]);

  /* ── Mutation enregistrement ────────────────────────────────────── */
  const saveMutation = useMutation({
    mutationFn: () =>
      attendancesApi.bulkCreate({
        subject_id: selectedSubjectId!,
        date,
        attendances: Object.entries(attendance).map(([student_id, status]) => ({
          student_id: Number(student_id),
          status,
        })),
      }),
    onSuccess: () => toast.success('Présences enregistrées avec succès !'),
    onError: () => toast.error("Erreur lors de l'enregistrement des présences"),
  });

  /* ── Compteurs ──────────────────────────────────────────────────── */
  const counts = Object.values(attendance).reduce<Record<AttendanceStatus, number>>(
    (acc, s) => {
      acc[s]++;
      return acc;
    },
    { present: 0, absent: 0, late: 0, excused: 0 },
  );

  const subjectOptions =
    subjectsData?.data.map((s) => ({
      value: s.id,
      label: s.classroom ? `${s.name} — ${s.classroom.name}` : s.name,
    })) ?? [];

  const students: Student[] = studentsData?.data ?? [];
  const hasStudents = students.length > 0;
  const canSave = !!selectedSubjectId && hasStudents;

  /* ── Rendu ────────────────────────────────────────────────────────── */
  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Feuille de présence"
        subtitle="Enregistrez les présences de vos élèves"
      />

      {/* Sélecteurs */}
      <div className="bg-white rounded-xl border border-border p-5 shadow-card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Matière / Classe"
            options={subjectOptions}
            value={selectedSubjectId?.toString() ?? ''}
            onChange={(e) => setSelectedSubjectId(Number(e.target.value) || null)}
            placeholder="Sélectionner une matière"
          />
          <Input
            label="Date du cours"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <div className="flex items-end">
            <Button
              variant="primary"
              icon={<Save size={16} />}
              onClick={() => saveMutation.mutate()}
              loading={saveMutation.isPending}
              disabled={!canSave}
              fullWidth
            >
              Enregistrer
            </Button>
          </div>
        </div>
      </div>

      {/* Compteurs + légende */}
      {selectedSubjectId && hasStudents && (
        <div className="flex flex-wrap gap-3">
          {STATUSES.map((status) => {
            const cfg = STATUS_CONFIG[status];
            return (
              <div
                key={status}
                className="flex items-center gap-2 bg-white border border-border rounded-lg px-3 py-2"
              >
                <span
                  className={clsx(
                    'w-6 h-6 rounded-full border-2 text-[11px] font-bold flex items-center justify-center flex-shrink-0',
                    cfg.activeClass,
                  )}
                >
                  {cfg.short}
                </span>
                <span className="text-sm text-muted-foreground">
                  {cfg.countLabel}
                </span>
                <span className="text-sm font-bold text-foreground">
                  {counts[status]}
                </span>
              </div>
            );
          })}

          {/* Bouton tout présent */}
          <button
            onClick={() => {
              const all: Record<number, AttendanceStatus> = {};
              students.forEach((s) => { all[s.id] = 'present'; });
              setAttendance(all);
            }}
            className="ml-auto flex items-center gap-1.5 px-3 py-2 bg-white border border-border rounded-lg text-sm text-muted-foreground hover:text-school-600 hover:border-school-200 hover:bg-school-50 transition-colors"
          >
            <UserCheck size={14} />
            Tous présents
          </button>
        </div>
      )}

      {/* Tableau des élèves */}
      {selectedSubjectId ? (
        <div className="bg-white rounded-xl border border-border overflow-hidden shadow-card">
          {/* En-tête */}
          <div className="px-5 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
            <div>
              <span className="font-semibold text-foreground text-sm">
                {selectedSubject?.name}
              </span>
              {selectedSubject?.classroom && (
                <span className="ml-2 text-xs text-muted-foreground">
                  · {selectedSubject.classroom.name}
                </span>
              )}
            </div>
            {hasStudents && (
              <span className="text-xs text-muted-foreground">
                {students.length} élève{students.length > 1 ? 's' : ''}
              </span>
            )}
          </div>

          {studentsLoading ? (
            <div className="p-5">
              <Skeleton lines={6} />
            </div>
          ) : !hasStudents ? (
            <div className="p-12 text-center">
              <UserCheck size={36} className="mx-auto text-muted-foreground/30 mb-3" />
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
                    {STATUSES.map((s) => (
                      <th
                        key={s}
                        className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide"
                        style={{
                          color:
                            s === 'present'
                              ? '#059669'
                              : s === 'absent'
                              ? '#dc2626'
                              : s === 'late'
                              ? '#d97706'
                              : '#2563eb',
                        }}
                      >
                        {STATUS_CONFIG[s].label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {students.map((student) => (
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

                      {/* Boutons de statut */}
                      {STATUSES.map((status) => {
                        const cfg = STATUS_CONFIG[status];
                        const isActive = attendance[student.id] === status;
                        return (
                          <td key={status} className="px-4 py-3 text-center">
                            <button
                              onClick={() =>
                                setAttendance((prev) => ({
                                  ...prev,
                                  [student.id]: status,
                                }))
                              }
                              aria-label={`${student.full_name} — ${cfg.label}`}
                              aria-pressed={isActive}
                              className={clsx(
                                'w-8 h-8 rounded-full border-2 text-xs font-bold transition-all duration-150',
                                isActive
                                  ? cfg.activeClass
                                  : cfg.inactiveClass,
                              )}
                            >
                              {cfg.short}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Placeholder quand aucune matière sélectionnée */
        <div className="bg-white rounded-xl border border-border p-14 text-center shadow-card">
          <div className="w-14 h-14 rounded-full bg-school-50 flex items-center justify-center mx-auto mb-3">
            <UserCheck size={26} className="text-school-600 opacity-50" />
          </div>
          <p className="text-muted-foreground text-sm">
            Sélectionnez une matière pour afficher la liste des élèves
          </p>
        </div>
      )}
    </div>
  );
};

export default TeacherAttendance;

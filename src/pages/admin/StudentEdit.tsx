import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, User, Users } from 'lucide-react';
import { useStudent, useUpdateStudent } from '../../hooks/useStudents';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import PageHeader from '../../components/ui/PageHeader';
import Skeleton from '../../components/ui/Skeleton';
import type { StudentForm } from '../../types';

const schema = z.object({
  first_name: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  last_name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  phone: z.string().optional(),
  date_of_birth: z.string().optional(),
  gender: z.enum(['M', 'F']).optional(),
  address: z.string().optional(),
  guardian_name: z.string().optional(),
  guardian_phone: z.string().optional(),
  status: z.enum(['active', 'inactive']).default('active'),
});

type FormValues = StudentForm & { status: 'active' | 'inactive' };

const GENDER_OPTIONS = [
  { value: 'M', label: 'Masculin' },
  { value: 'F', label: 'Féminin' },
];

const STATUS_OPTIONS = [
  { value: 'active', label: 'Actif' },
  { value: 'inactive', label: 'Inactif' },
];

const StudentEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const studentId = Number(id);
  const navigate = useNavigate();

  const { data: student, isLoading } = useStudent(studentId);
  const updateMutation = useUpdateStudent();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<FormValues>({ resolver: zodResolver(schema) as any, defaultValues: { status: 'active' } });

  // Pré-remplir le formulaire dès que les données arrivent
  useEffect(() => {
    if (student) {
      reset({
        first_name: student.first_name,
        last_name: student.last_name,
        email: student.email ?? '',
        phone: student.phone ?? '',
        date_of_birth: student.date_of_birth ?? '',
        gender: student.gender,
        address: student.address ?? '',
        guardian_name: student.guardian_name ?? '',
        guardian_phone: student.guardian_phone ?? '',
        status: student.status === 'suspended' ? 'inactive' : student.status,
      });
    }
  }, [student, reset]);

  const onSubmit = (data: FormValues) => {
    updateMutation.mutate(
      { id: studentId, data: data as Partial<StudentForm> },
      { onSuccess: () => navigate(`/students/${studentId}`) },
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-5 max-w-3xl">
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in max-w-3xl">
      <PageHeader
        title={`Modifier — ${student?.full_name ?? 'Élève'}`}
        breadcrumbs={[
          { label: 'Élèves', href: '/students' },
          { label: student?.full_name ?? 'Élève', href: `/students/${studentId}` },
          { label: 'Modifier' },
        ]}
        actions={
          <Button
            variant="ghost"
            icon={<ArrowLeft size={16} />}
            onClick={() => navigate(`/students/${studentId}`)}
          >
            Retour
          </Button>
        }
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl border border-border p-6 space-y-6"
        noValidate
      >
        {/* Section Identité */}
        <section>
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
            <div className="w-7 h-7 rounded-lg bg-school-50 flex items-center justify-center">
              <User size={14} className="text-school-600" />
            </div>
            <h3 className="font-semibold text-foreground text-base font-heading">
              Identité de l'élève
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Prénom *"
              {...register('first_name')}
              error={errors.first_name?.message}
              placeholder="Amadou"
            />
            <Input
              label="Nom *"
              {...register('last_name')}
              error={errors.last_name?.message}
              placeholder="Traoré"
            />
            <Input
              label="Email"
              type="email"
              {...register('email')}
              error={errors.email?.message}
              placeholder="amadou@gmail.com"
            />
            <Input
              label="Téléphone"
              {...register('phone')}
              placeholder="+225 07 00 00 00"
            />
            <Input
              label="Date de naissance"
              type="date"
              {...register('date_of_birth')}
            />
            <Select
              label="Genre"
              options={GENDER_OPTIONS}
              placeholder="Sélectionner..."
              {...register('gender')}
            />
            <div className="md:col-span-2">
              <Input
                label="Adresse"
                {...register('address')}
                placeholder="Quartier, Ville"
              />
            </div>
          </div>
        </section>

        {/* Section Tuteur */}
        <section>
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
            <div className="w-7 h-7 rounded-lg bg-gold-50 flex items-center justify-center">
              <Users size={14} className="text-gold-600" />
            </div>
            <h3 className="font-semibold text-foreground text-base font-heading">
              Tuteur / Parent
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nom du tuteur"
              {...register('guardian_name')}
              placeholder="Mamadou Traoré"
            />
            <Input
              label="Téléphone du tuteur"
              {...register('guardian_phone')}
              placeholder="+225 05 00 00 00"
            />
          </div>
        </section>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-border">
          <div className="sm:w-48">
            <Select
              label="Statut"
              options={STATUS_OPTIONS}
              {...register('status')}
            />
          </div>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              type="button"
              onClick={() => navigate(`/students/${studentId}`)}
            >
              Annuler
            </Button>
            <Button
              variant="primary"
              type="submit"
              loading={updateMutation.isPending}
            >
              Enregistrer les modifications
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default StudentEdit;

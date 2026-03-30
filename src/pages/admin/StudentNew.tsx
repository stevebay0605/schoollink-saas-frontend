import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Users } from 'lucide-react';
import { useCreateStudent } from '../../hooks/useStudents';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import PageHeader from '../../components/ui/PageHeader';
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

// Use StudentForm from types to keep resolver happy
type FormValues = StudentForm & { status: 'active' | 'inactive' };

const GENDER_OPTIONS = [
  { value: 'M', label: 'Masculin' },
  { value: 'F', label: 'Féminin' },
];

const STATUS_OPTIONS = [
  { value: 'active', label: 'Actif' },
  { value: 'inactive', label: 'Inactif' },
];

const StudentNew: React.FC = () => {
  const navigate = useNavigate();
  const createMutation = useCreateStudent();

  const {
    register,
    handleSubmit,
    formState: { errors },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<FormValues>({ resolver: zodResolver(schema) as any, defaultValues: { status: 'active' } });

  const onSubmit = (data: FormValues) => {
    createMutation.mutate(data as StudentForm, {
      onSuccess: () => navigate('/students'),
    });
  };

  return (
    <div className="space-y-5 animate-fade-in max-w-3xl">
      <PageHeader
        title="Nouvel élève"
        breadcrumbs={[
          { label: 'Élèves', href: '/students' },
          { label: 'Nouveau' },
        ]}
        actions={
          <Button
            variant="ghost"
            icon={<ArrowLeft size={16} />}
            onClick={() => navigate('/students')}
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
              autoComplete="given-name"
            />
            <Input
              label="Nom *"
              {...register('last_name')}
              error={errors.last_name?.message}
              placeholder="Traoré"
              autoComplete="family-name"
            />
            <Input
              label="Email"
              type="email"
              {...register('email')}
              error={errors.email?.message}
              placeholder="amadou@gmail.com"
              autoComplete="email"
            />
            <Input
              label="Téléphone"
              {...register('phone')}
              placeholder="+225 07 00 00 00"
              autoComplete="tel"
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
                autoComplete="street-address"
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
              onClick={() => navigate('/students')}
            >
              Annuler
            </Button>
            <Button
              variant="primary"
              type="submit"
              loading={createMutation.isPending}
            >
              Créer l'élève
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default StudentNew;

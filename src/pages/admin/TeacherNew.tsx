import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User } from 'lucide-react';
import { useCreateTeacher } from '../../hooks/useTeachers';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import PageHeader from '../../components/ui/PageHeader';
import type { TeacherForm } from '../../types';

const schema = z.object({
  first_name: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  last_name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  phone: z.string().optional(),
  specialization: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const TeacherNew: React.FC = () => {
  const navigate = useNavigate();
  const createMutation = useCreateTeacher();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormValues) => {
    createMutation.mutate(data as TeacherForm, {
      onSuccess: () => navigate('/teachers'),
    });
  };

  return (
    <div className="space-y-5 animate-fade-in max-w-2xl">
      <PageHeader
        title="Nouvel enseignant"
        breadcrumbs={[
          { label: 'Enseignants', href: '/teachers' },
          { label: 'Nouveau' },
        ]}
        actions={
          <Button
            variant="ghost"
            icon={<ArrowLeft size={16} />}
            onClick={() => navigate('/teachers')}
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
              Informations de l'enseignant
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Prénom *"
              {...register('first_name')}
              error={errors.first_name?.message}
              placeholder="Kouassi"
              autoComplete="given-name"
            />
            <Input
              label="Nom *"
              {...register('last_name')}
              error={errors.last_name?.message}
              placeholder="Yao"
              autoComplete="family-name"
            />
            <Input
              label="Email *"
              type="email"
              {...register('email')}
              error={errors.email?.message}
              placeholder="k.yao@ecole.ci"
              autoComplete="email"
            />
            <Input
              label="Téléphone"
              {...register('phone')}
              placeholder="+225 07 00 00 00"
              autoComplete="tel"
            />
            <div className="md:col-span-2">
              <Input
                label="Spécialisation"
                {...register('specialization')}
                placeholder="Mathématiques, Physique-Chimie..."
              />
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-2 border-t border-border">
          <Button
            variant="ghost"
            type="button"
            onClick={() => navigate('/teachers')}
          >
            Annuler
          </Button>
          <Button
            variant="primary"
            type="submit"
            loading={createMutation.isPending}
          >
            Créer l'enseignant
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TeacherNew;

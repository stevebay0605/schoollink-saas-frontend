import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, School } from 'lucide-react';
import { useCreateClassroom } from '../../hooks/useClassrooms';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import PageHeader from '../../components/ui/PageHeader';
import type { ClassroomForm } from '../../types';
import { ACADEMIC_YEARS } from '../../utils/constants';

const schema = z.object({
  name: z.string().min(1, 'Le nom de la classe est requis'),
  level: z.string().min(1, 'Le niveau est requis'),
  academic_year: z.string().min(1, "L'année scolaire est requise"),
  capacity: z.coerce
    .number()
    .int('La capacité doit être un entier')
    .min(1, 'La capacité doit être supérieure à 0')
    .max(200, 'La capacité ne peut pas dépasser 200'),
});

type FormValues = ClassroomForm;

const LEVEL_OPTIONS = [
  { value: 'CP', label: 'CP' },
  { value: 'CE1', label: 'CE1' },
  { value: 'CE2', label: 'CE2' },
  { value: 'CM1', label: 'CM1' },
  { value: 'CM2', label: 'CM2' },
  { value: '6ème', label: '6ème' },
  { value: '5ème', label: '5ème' },
  { value: '4ème', label: '4ème' },
  { value: '3ème', label: '3ème' },
  { value: '2nde', label: '2nde' },
  { value: '1ère', label: '1ère' },
  { value: 'Terminale', label: 'Terminale' },
];

const YEAR_OPTIONS = ACADEMIC_YEARS.map((y) => ({ value: y, label: y }));

const ClassroomNew: React.FC = () => {
  const navigate = useNavigate();
  const createMutation = useCreateClassroom();

  const {
    register,
    handleSubmit,
    formState: { errors },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<FormValues>({ resolver: zodResolver(schema) as any, defaultValues: { academic_year: ACADEMIC_YEARS[0], capacity: 30 } });

  const onSubmit = (data: FormValues) => {
    createMutation.mutate(data, {
      onSuccess: () => navigate('/classrooms'),
    });
  };

  return (
    <div className="space-y-5 animate-fade-in max-w-xl">
      <PageHeader
        title="Nouvelle classe"
        breadcrumbs={[
          { label: 'Classes', href: '/classrooms' },
          { label: 'Nouvelle' },
        ]}
        actions={
          <Button
            variant="ghost"
            icon={<ArrowLeft size={16} />}
            onClick={() => navigate('/classrooms')}
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
        <section>
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
            <div className="w-7 h-7 rounded-lg bg-school-50 flex items-center justify-center">
              <School size={14} className="text-school-600" />
            </div>
            <h3 className="font-semibold text-foreground text-base font-heading">
              Informations de la classe
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Nom de la classe *"
                {...register('name')}
                error={errors.name?.message}
                placeholder="Ex: 3ème A, Terminale S1..."
              />
            </div>
            <Select
              label="Niveau *"
              options={LEVEL_OPTIONS}
              placeholder="Sélectionner un niveau..."
              {...register('level')}
              error={errors.level?.message}
            />
            <Select
              label="Année scolaire *"
              options={YEAR_OPTIONS}
              {...register('academic_year')}
              error={errors.academic_year?.message}
            />
            <div className="sm:col-span-2">
              <Input
                label="Capacité maximale *"
                type="number"
                min="1"
                max="200"
                {...register('capacity')}
                error={errors.capacity?.message}
                placeholder="30"
                hint="Nombre maximum d'élèves dans cette classe"
              />
            </div>
          </div>
        </section>

        <div className="flex justify-end gap-3 pt-2 border-t border-border">
          <Button
            variant="ghost"
            type="button"
            onClick={() => navigate('/classrooms')}
          >
            Annuler
          </Button>
          <Button
            variant="primary"
            type="submit"
            loading={createMutation.isPending}
          >
            Créer la classe
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ClassroomNew;

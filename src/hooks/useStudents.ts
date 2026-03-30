import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentsApi } from '../api/students';
import type { StudentFilters, StudentForm } from '../types';
import toast from 'react-hot-toast';

export const useStudents = (filters?: StudentFilters) => {
  return useQuery({
    queryKey: ['students', filters],
    queryFn: () => studentsApi.list(filters).then((r) => r.data),
  });
};

export const useStudent = (id: number) => {
  return useQuery({
    queryKey: ['students', id],
    queryFn: () => studentsApi.get(id).then((r) => r.data.data),
    enabled: !!id,
  });
};

export const useCreateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: StudentForm) => studentsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Élève créé avec succès');
    },
    onError: () => toast.error('Erreur lors de la création'),
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<StudentForm> }) =>
      studentsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Élève modifié avec succès');
    },
    onError: () => toast.error('Erreur lors de la modification'),
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => studentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Élève supprimé');
    },
    onError: () => toast.error('Erreur lors de la suppression'),
  });
};

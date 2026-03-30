import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teachersApi } from '../api/teachers';
import type { TeacherForm } from '../types';
import toast from 'react-hot-toast';

export const useTeachers = (params?: { search?: string; per_page?: number; page?: number }) => {
  return useQuery({
    queryKey: ['teachers', params],
    queryFn: () => teachersApi.list(params).then((r) => r.data),
  });
};

export const useTeacher = (id: number) => {
  return useQuery({
    queryKey: ['teachers', id],
    queryFn: () => teachersApi.get(id).then((r) => r.data.data),
    enabled: !!id,
  });
};

export const useCreateTeacher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TeacherForm) => teachersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      toast.success('Enseignant créé avec succès');
    },
    onError: () => toast.error('Erreur lors de la création'),
  });
};

export const useUpdateTeacher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<TeacherForm> }) =>
      teachersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      toast.success('Enseignant modifié avec succès');
    },
    onError: () => toast.error('Erreur lors de la modification'),
  });
};

export const useDeleteTeacher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => teachersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      toast.success('Enseignant supprimé');
    },
    onError: () => toast.error('Erreur lors de la suppression'),
  });
};

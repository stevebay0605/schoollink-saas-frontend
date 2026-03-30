import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { classroomsApi } from '../api/classrooms';
import type { ClassroomForm } from '../types';
import toast from 'react-hot-toast';

export const useClassrooms = (params?: { search?: string }) => {
  return useQuery({
    queryKey: ['classrooms', params],
    queryFn: () => classroomsApi.list(params).then((r) => r.data),
  });
};

export const useClassroom = (id: number) => {
  return useQuery({
    queryKey: ['classrooms', id],
    queryFn: () => classroomsApi.get(id).then((r) => r.data.data),
    enabled: !!id,
  });
};

export const useCreateClassroom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ClassroomForm) => classroomsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classrooms'] });
      toast.success('Classe créée avec succès');
    },
    onError: () => toast.error('Erreur lors de la création'),
  });
};

export const useDeleteClassroom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => classroomsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classrooms'] });
      toast.success('Classe supprimée');
    },
    onError: () => toast.error('Erreur lors de la suppression'),
  });
};

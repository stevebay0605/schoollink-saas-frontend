import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentsApi } from '../api/payments';
import type { PaymentFilters, PaymentForm } from '../types';
import toast from 'react-hot-toast';

export const usePayments = (filters?: PaymentFilters) => {
  return useQuery({
    queryKey: ['payments', filters],
    queryFn: () => paymentsApi.list(filters).then((r) => r.data),
  });
};

export const usePaymentStats = () => {
  return useQuery({
    queryKey: ['payments', 'stats'],
    queryFn: () => paymentsApi.stats().then((r) => r.data),
  });
};

export const useCreatePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PaymentForm) => paymentsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast.success('Paiement créé avec succès');
    },
    onError: () => toast.error('Erreur lors de la création'),
  });
};

export const useConfirmPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => paymentsApi.confirm(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast.success('Paiement confirmé');
    },
    onError: () => toast.error('Erreur lors de la confirmation'),
  });
};

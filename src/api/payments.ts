import api from './axios';
import type { Payment, PaymentForm, PaymentFilters, PaginatedResponse } from '../types';

export const paymentsApi = {
  list: (filters?: PaymentFilters) =>
    api.get<PaginatedResponse<Payment>>('/payments', { params: filters }),

  create: (data: PaymentForm) =>
    api.post<{ data: Payment }>('/payments', data),

  get: (id: number) =>
    api.get<{ data: Payment }>(`/payments/${id}`),

  update: (id: number, data: Partial<PaymentForm>) =>
    api.put<{ data: Payment }>(`/payments/${id}`, data),

  confirm: (id: number) =>
    api.post(`/payments/${id}/confirm`),

  stats: () =>
    api.get('/payments/stats'),

  studentSummary: (studentId: number) =>
    api.get(`/payments/student/${studentId}/summary`),
};

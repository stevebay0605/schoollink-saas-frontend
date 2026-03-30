import api from './axios';
import type { Subject, SubjectForm, PaginatedResponse } from '../types';

export const subjectsApi = {
  list: (params?: { classroom_id?: number; search?: string }) =>
    api.get<PaginatedResponse<Subject>>('/subjects', { params }),

  create: (data: SubjectForm) =>
    api.post<{ data: Subject }>('/subjects', data),

  get: (id: number) =>
    api.get<{ data: Subject }>(`/subjects/${id}`),

  update: (id: number, data: Partial<SubjectForm>) =>
    api.put<{ data: Subject }>(`/subjects/${id}`, data),

  delete: (id: number) =>
    api.delete(`/subjects/${id}`),
};

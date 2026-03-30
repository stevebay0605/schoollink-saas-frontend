import api from './axios';
import type { Assignment, Grade, PaginatedResponse } from '../types';

interface AssignmentForm {
  subject_id: number;
  title: string;
  description?: string;
  due_date: string;
  max_score: number;
  status?: 'open' | 'closed';
  file?: File;
}

export const assignmentsApi = {
  list: (params?: { subject_id?: number; status?: string }) =>
    api.get<PaginatedResponse<Assignment>>('/assignments', { params }),

  create: (data: AssignmentForm) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'file' && value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });
    return api.post<{ data: Assignment }>('/assignments', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  get: (id: number) =>
    api.get<{ data: Assignment }>(`/assignments/${id}`),

  update: (id: number, data: Partial<AssignmentForm>) =>
    api.put<{ data: Assignment }>(`/assignments/${id}`, data),

  delete: (id: number) =>
    api.delete(`/assignments/${id}`),

  grades: (id: number) =>
    api.get<{ data: Grade[] }>(`/assignments/${id}/grades`),
};

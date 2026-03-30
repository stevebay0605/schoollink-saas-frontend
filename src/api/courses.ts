import api from './axios';
import type { Course, PaginatedResponse } from '../types';

interface CourseForm {
  subject_id: number;
  title: string;
  description?: string;
  date: string;
  duration?: number;
  status?: 'draft' | 'published';
  file?: File;
}

export const coursesApi = {
  list: (params?: { subject_id?: number; status?: string; date_from?: string; date_to?: string }) =>
    api.get<PaginatedResponse<Course>>('/courses', { params }),

  create: (data: CourseForm) => {
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
    return api.post<{ data: Course }>('/courses', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  get: (id: number) =>
    api.get<{ data: Course }>(`/courses/${id}`),

  update: (id: number, data: Partial<CourseForm>) =>
    api.put<{ data: Course }>(`/courses/${id}`, data),

  delete: (id: number) =>
    api.delete(`/courses/${id}`),
};

import api from './axios';
import type { Teacher, TeacherForm, PaginatedResponse, Subject, Course } from '../types';

export const teachersApi = {
  list: (params?: { search?: string; per_page?: number; page?: number }) =>
    api.get<PaginatedResponse<Teacher>>('/teachers', { params }),

  create: (data: TeacherForm) =>
    api.post<{ data: Teacher }>('/teachers', data),

  get: (id: number) =>
    api.get<{ data: Teacher }>(`/teachers/${id}`),

  update: (id: number, data: Partial<TeacherForm>) =>
    api.put<{ data: Teacher }>(`/teachers/${id}`, data),

  delete: (id: number) =>
    api.delete(`/teachers/${id}`),

  subjects: (id: number) =>
    api.get<{ data: Subject[] }>(`/teachers/${id}/subjects`),

  schedule: (id: number) =>
    api.get<{ data: Course[] }>(`/teachers/${id}/schedule`),
};

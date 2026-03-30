import api from './axios';
import type { Student, StudentForm, StudentFilters, PaginatedResponse, GradeReport } from '../types';

export const studentsApi = {
  list: (filters?: StudentFilters) =>
    api.get<PaginatedResponse<Student>>('/students', { params: filters }),

  create: (data: StudentForm) =>
    api.post<{ data: Student }>('/students', data),

  get: (id: number) =>
    api.get<{ data: Student }>(`/students/${id}`),

  update: (id: number, data: Partial<StudentForm>) =>
    api.put<{ data: Student }>(`/students/${id}`, data),

  delete: (id: number) =>
    api.delete(`/students/${id}`),

  grades: (id: number, params?: { academic_year?: string; term?: string }) =>
    api.get<{ data: GradeReport }>(`/students/${id}/grades`, { params }),
};

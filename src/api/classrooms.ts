import api from './axios';
import type { Classroom, ClassroomForm, PaginatedResponse, Student } from '../types';

export const classroomsApi = {
  list: (params?: { search?: string; per_page?: number; page?: number }) =>
    api.get<PaginatedResponse<Classroom>>('/classrooms', { params }),

  create: (data: ClassroomForm) =>
    api.post<{ data: Classroom }>('/classrooms', data),

  get: (id: number) =>
    api.get<{ data: Classroom }>(`/classrooms/${id}`),

  update: (id: number, data: Partial<ClassroomForm>) =>
    api.put<{ data: Classroom }>(`/classrooms/${id}`, data),

  delete: (id: number) =>
    api.delete(`/classrooms/${id}`),

  students: (id: number) =>
    api.get<{ data: Student[] }>(`/classrooms/${id}/students`),

  enroll: (id: number, data: { student_ids: number[]; academic_year: string }) =>
    api.post(`/classrooms/${id}/enroll`, data),

  unenroll: (classroomId: number, studentId: number) =>
    api.delete(`/classrooms/${classroomId}/unenroll/${studentId}`),
};

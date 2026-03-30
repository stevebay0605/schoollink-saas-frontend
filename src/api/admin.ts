import api from './axios';
import type { School, PaginatedResponse } from '../types';

export const adminApi = {
  schools: (params?: { search?: string; page?: number }) =>
    api.get<PaginatedResponse<School>>('/admin/schools', { params }),

  getSchool: (id: number) =>
    api.get<{ data: School }>(`/admin/schools/${id}`),

  updateSchool: (id: number, data: Partial<School>) =>
    api.put<{ data: School }>(`/admin/schools/${id}`, data),

  deleteSchool: (id: number) =>
    api.delete(`/admin/schools/${id}`),

  schoolStats: (id: number) =>
    api.get(`/admin/schools/${id}/stats`),
};

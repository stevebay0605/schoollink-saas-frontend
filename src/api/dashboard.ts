import api from './axios';
import type { DashboardStats } from '../types';

export const dashboardApi = {
  get: () => api.get<{ data: DashboardStats }>('/dashboard'),
};

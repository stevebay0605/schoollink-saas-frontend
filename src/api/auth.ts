import api from './axios';
import type { LoginForm, RegisterForm, User } from '../types';

export const authApi = {
  login: (data: LoginForm) =>
    api.post<{ token: string; user: User }>('/auth/login', data),

  logout: () => api.post('/auth/logout'),

  me: () => api.get<{ data: User }>('/auth/me'),

  registerSchool: (data: RegisterForm) =>
    api.post('/auth/schools/register', data),
};

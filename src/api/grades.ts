import api from './axios';
import type { GradeForm, GradeReport } from '../types';

export const gradesApi = {
  create: (data: GradeForm) =>
    api.post('/grades', data),

  createBulk: (grades: GradeForm[]) =>
    api.post('/grades/bulk', { grades }),

  report: (params: { student_id: number; academic_year: string; term?: string }) =>
    api.get<{ data: GradeReport }>('/grades/report', { params }),
};

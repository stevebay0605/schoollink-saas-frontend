import api from './axios';
import type { Attendance, AttendanceBulkForm, AttendanceFilters } from '../types';

export const attendancesApi = {
  bulkCreate: (data: AttendanceBulkForm) =>
    api.post('/attendances/bulk', data),

  list: (filters?: AttendanceFilters) =>
    api.get<{ data: Attendance[] }>('/attendances', { params: filters }),
};

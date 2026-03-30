import { create } from 'zustand';
import type { School } from '../types';

interface TenantState {
  school: School | null;
  currentAcademicYear: string;
  setSchool: (school: School) => void;
  setAcademicYear: (year: string) => void;
}

const getCurrentAcademicYear = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  // Année scolaire commence en septembre
  return month >= 8 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
};

export const useTenantStore = create<TenantState>((set) => ({
  school: null,
  currentAcademicYear: getCurrentAcademicYear(),
  setSchool: (school) => set({ school }),
  setAcademicYear: (year) => set({ currentAcademicYear: year }),
}));

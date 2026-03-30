export const TOKEN_KEY = 'schoollink_token';

export const ACADEMIC_YEARS = [
  '2024-2025',
  '2023-2024',
  '2022-2023',
];

export const TERMS = [
  { value: '1', label: '1er Trimestre' },
  { value: '2', label: '2ème Trimestre' },
  { value: '3', label: '3ème Trimestre' },
];

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  SCHOOL_ADMIN: 'school_admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
  PARENT: 'parent',
} as const;

export const ITEMS_PER_PAGE = 15;

export const PAYMENT_TYPES = [
  { value: 'tuition', label: 'Frais de scolarité' },
  { value: 'registration', label: "Frais d'inscription" },
  { value: 'exam', label: "Frais d'examen" },
  { value: 'canteen', label: 'Cantine' },
  { value: 'transport', label: 'Transport' },
  { value: 'other', label: 'Autre' },
];

export const SCHOOL_PLANS = [
  { value: 'basic', label: 'Basique' },
  { value: 'premium', label: 'Premium' },
  { value: 'enterprise', label: 'Entreprise' },
];

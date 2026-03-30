// Rôles utilisateur
export type UserRole = 'super_admin' | 'school_admin' | 'teacher' | 'student' | 'parent';

// User
export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: string;
  avatar?: string;
  is_active: boolean;
  school_id?: number;
  created_at: string;
  updated_at: string;
}

// School
export interface School {
  id: number;
  name: string;
  code: string;
  email: string;
  phone?: string;
  address?: string;
  logo?: string;
  plan: 'basic' | 'premium' | 'enterprise';
  is_active: boolean;
  max_students: number;
  max_teachers: number;
  created_at: string;
  updated_at: string;
}

// Student
export interface Student {
  id: number;
  user_id: number;
  school_id: number;
  student_number: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  gender?: 'M' | 'F';
  address?: string;
  guardian_name?: string;
  guardian_phone?: string;
  status: 'active' | 'inactive' | 'suspended';
  avatar?: string;
  created_at: string;
  updated_at: string;
}

// Teacher
export interface Teacher {
  id: number;
  user_id: number;
  school_id: number;
  employee_number: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone?: string;
  specialization?: string;
  is_active: boolean;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

// Classroom
export interface Classroom {
  id: number;
  school_id: number;
  name: string;
  level: string;
  academic_year: string;
  capacity: number;
  students_count?: number;
  class_teacher_id?: number;
  created_at: string;
  updated_at: string;
}

// Subject
export interface Subject {
  id: number;
  school_id: number;
  classroom_id: number;
  teacher_id?: number;
  name: string;
  code: string;
  description?: string;
  coefficient: number;
  hours_per_week?: number;
  classroom?: Classroom;
  teacher?: Teacher;
  created_at: string;
  updated_at: string;
}

// Course
export interface Course {
  id: number;
  subject_id: number;
  teacher_id: number;
  title: string;
  description?: string;
  file_path?: string;
  file_url?: string;
  status: 'draft' | 'published';
  date: string;
  duration?: number;
  subject?: Subject;
  teacher?: Teacher;
  created_at: string;
  updated_at: string;
}

// Assignment
export interface Assignment {
  id: number;
  subject_id: number;
  teacher_id: number;
  title: string;
  description?: string;
  file_path?: string;
  file_url?: string;
  due_date: string;
  max_score: number;
  status: 'open' | 'closed';
  subject?: Subject;
  created_at: string;
  updated_at: string;
}

// Grade
export interface Grade {
  id: number;
  student_id: number;
  assignment_id: number;
  score: number;
  comment?: string;
  student?: Student;
  assignment?: Assignment;
  graded_at: string;
  created_at: string;
  updated_at: string;
}

// GradeReport
export interface GradeReport {
  student: Student;
  academic_year: string;
  term?: string;
  subjects: {
    subject: Subject;
    assignments: Assignment[];
    grades: Grade[];
    average: number;
    max_score: number;
  }[];
  overall_average: number;
}

// Attendance
export interface Attendance {
  id: number;
  student_id: number;
  subject_id: number;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  remarks?: string;
  student?: Student;
  subject?: Subject;
  created_at: string;
  updated_at: string;
}

// Payment
export interface Payment {
  id: number;
  student_id: number;
  school_id: number;
  amount: number;
  description: string;
  payment_type: string;
  academic_year: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  due_date?: string;
  paid_at?: string;
  reference?: string;
  student?: Student;
  created_at: string;
  updated_at: string;
}

// Dashboard stats
export interface DashboardStats {
  total_students?: number;
  total_teachers?: number;
  total_classrooms?: number;
  total_subjects?: number;
  today_attendance_rate?: number;
  monthly_revenue?: number;
  pending_payments?: number;
  recent_grades?: Grade[];
  upcoming_courses?: Course[];
  my_subjects?: Subject[];
  my_courses?: Course[];
  my_assignments?: Assignment[];
  children?: Array<{
    student: Student;
    average: number;
    attendance_rate: number;
    pending_payments: number;
  }>;
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
}

// API Response générique
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Formulaires d'authentification
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  school_name: string;
  school_email: string;
  school_phone?: string;
  school_address?: string;
  admin_name: string;
  admin_email: string;
  password: string;
  password_confirmation: string;
}

// Formulaires CRUD
export interface StudentForm {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  gender?: 'M' | 'F';
  address?: string;
  guardian_name?: string;
  guardian_phone?: string;
  status?: 'active' | 'inactive';
}

export interface TeacherForm {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  specialization?: string;
}

export interface ClassroomForm {
  name: string;
  level: string;
  academic_year: string;
  capacity: number;
}

export interface SubjectForm {
  classroom_id: number;
  teacher_id?: number;
  name: string;
  code: string;
  description?: string;
  coefficient: number;
  hours_per_week?: number;
}

export interface PaymentForm {
  student_id: number;
  amount: number;
  description: string;
  payment_type: string;
  academic_year: string;
  due_date?: string;
}

export interface AttendanceBulkForm {
  subject_id: number;
  date: string;
  attendances: Array<{
    student_id: number;
    status: 'present' | 'absent' | 'late' | 'excused';
    remarks?: string;
  }>;
}

export interface GradeForm {
  student_id: number;
  assignment_id: number;
  score: number;
  comment?: string;
}

// Filtres de liste
export interface StudentFilters {
  search?: string;
  status?: string;
  per_page?: number;
  page?: number;
}

export interface PaymentFilters {
  student_id?: number;
  status?: string;
  academic_year?: string;
}

export interface AttendanceFilters {
  student_id?: number;
  subject_id?: number;
  date_from?: string;
  date_to?: string;
}

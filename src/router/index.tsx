import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

// Guards
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';

// Layout
import AppLayout from '../components/layout/AppLayout';

// Pages Auth
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Pages School Admin
import Dashboard from '../pages/admin/Dashboard';
import Students from '../pages/admin/Students';
import StudentNew from '../pages/admin/StudentNew';
import StudentDetail from '../pages/admin/StudentDetail';
import StudentEdit from '../pages/admin/StudentEdit';
import Teachers from '../pages/admin/Teachers';
import TeacherNew from '../pages/admin/TeacherNew';
import TeacherDetail from '../pages/admin/TeacherDetail';
import Classrooms from '../pages/admin/Classrooms';
import ClassroomNew from '../pages/admin/ClassroomNew';
import ClassroomDetail from '../pages/admin/ClassroomDetail';
import Subjects from '../pages/admin/Subjects';
import Payments from '../pages/admin/Payments';
import Users from '../pages/admin/Users';

// Pages Teacher
import TeacherDashboard from '../pages/teacher/TeacherDashboard';
import TeacherGrades from '../pages/teacher/TeacherGrades';
import TeacherAttendance from '../pages/teacher/TeacherAttendance';
import TeacherCourses from '../pages/teacher/TeacherCourses';
import TeacherAssignments from '../pages/teacher/TeacherAssignments';

// Pages Student
import StudentDashboard from '../pages/student/StudentDashboard';
import StudentBulletin from '../pages/student/StudentBulletin';
import StudentCourses from '../pages/student/StudentCourses';
import StudentPayments from '../pages/student/StudentPayments';

// Pages Parent
import ParentDashboard from '../pages/parent/ParentDashboard';
import ParentChildren from '../pages/parent/ParentChildren';
import ParentChildDetail from '../pages/parent/ParentChildDetail';

// Pages Super Admin
import AdminSchools from '../pages/superadmin/AdminSchools';
import AdminSchoolDetail from '../pages/superadmin/AdminSchoolDetail';

// Composant de redirection selon rôle
const RoleRedirect: React.FC = () => {
  const { user } = useAuthStore();

  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case 'super_admin':
      return <Navigate to="/admin/schools" replace />;
    case 'school_admin':
      return <Navigate to="/dashboard" replace />;
    case 'teacher':
      return <Navigate to="/teacher/dashboard" replace />;
    case 'student':
      return <Navigate to="/student/dashboard" replace />;
    case 'parent':
      return <Navigate to="/parent/dashboard" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes publiques */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Routes protégées avec layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            {/* Redirection selon rôle */}
            <Route path="/" element={<RoleRedirect />} />

            {/* School Admin */}
            <Route element={<RoleRoute allowedRoles={['school_admin']} redirectTo="/" />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/students" element={<Students />} />
              <Route path="/students/new" element={<StudentNew />} />
              <Route path="/students/:id" element={<StudentDetail />} />
              <Route path="/students/:id/edit" element={<StudentEdit />} />
              <Route path="/teachers" element={<Teachers />} />
              <Route path="/teachers/new" element={<TeacherNew />} />
              <Route path="/teachers/:id" element={<TeacherDetail />} />
              <Route path="/classrooms" element={<Classrooms />} />
              <Route path="/classrooms/new" element={<ClassroomNew />} />
              <Route path="/classrooms/:id" element={<ClassroomDetail />} />
              <Route path="/subjects" element={<Subjects />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/users" element={<Users />} />
            </Route>

            {/* Teacher */}
            <Route element={<RoleRoute allowedRoles={['teacher']} redirectTo="/" />}>
              <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
              <Route path="/teacher/courses" element={<TeacherCourses />} />
              <Route path="/teacher/assignments" element={<TeacherAssignments />} />
              <Route path="/teacher/grades" element={<TeacherGrades />} />
              <Route path="/teacher/attendance" element={<TeacherAttendance />} />
            </Route>

            {/* Student */}
            <Route element={<RoleRoute allowedRoles={['student']} redirectTo="/" />}>
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/courses" element={<StudentCourses />} />
              <Route path="/student/grades" element={<StudentBulletin />} />
              <Route path="/student/payments" element={<StudentPayments />} />
            </Route>

            {/* Parent */}
            <Route element={<RoleRoute allowedRoles={['parent']} redirectTo="/" />}>
              <Route path="/parent/dashboard" element={<ParentDashboard />} />
              <Route path="/parent/children" element={<ParentChildren />} />
              <Route path="/parent/children/:id" element={<ParentChildDetail />} />
            </Route>

            {/* Super Admin */}
            <Route element={<RoleRoute allowedRoles={['super_admin']} redirectTo="/" />}>
              <Route path="/admin/schools" element={<AdminSchools />} />
              <Route path="/admin/schools/:id" element={<AdminSchoolDetail />} />
            </Route>
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;

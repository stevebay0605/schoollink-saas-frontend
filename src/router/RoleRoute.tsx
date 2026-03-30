import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import type { UserRole } from '../types';

interface RoleRouteProps {
  allowedRoles: UserRole[];
  redirectTo?: string;
}

// Redirige vers /dashboard si le rôle n'est pas autorisé
const RoleRoute: React.FC<RoleRouteProps> = ({ allowedRoles, redirectTo = '/dashboard' }) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default RoleRoute;

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Loading from '../components/ui/Loading';

interface ProtectedRouteProps {
  allowedRoles?: ('ADMIN' | 'CLIENTE')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, user, loading, isAdmin } = useAuth();

  if (loading) {
    return <Loading fullScreen text="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If roles are specified, check if user has permission
  if (allowedRoles && allowedRoles.length > 0) {
    const hasPermission = user && allowedRoles.includes(user.role);
    
    if (!hasPermission) {
      // Redirect based on role
      if (isAdmin()) {
        return <Navigate to="/admin/dashboard" replace />;
      } else {
        return <Navigate to="/cars/" replace />;
      }
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
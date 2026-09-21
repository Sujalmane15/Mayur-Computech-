import type { ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAdminContext } from '../context/AdminContext';

export function ProtectedRoute({
  children,
  requiredPermission,
}: {
  children?: ReactNode;
  requiredPermission?: string;
}) {
  const { currentUser, adminUser, isLoading, hasPermission } = useAdminContext();
  const location = useLocation();

  if (isLoading) {
    return <div className="admin-loading">Resolving access...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  if (!adminUser || adminUser.status !== 'active') {
    return <Navigate to="/admin/unauthorized" replace state={{ from: location }} />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/admin/unauthorized" replace state={{ from: location }} />;
  }

  return children ?? <Outlet />;
}

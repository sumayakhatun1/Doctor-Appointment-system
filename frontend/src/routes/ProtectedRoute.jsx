import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../components/auth/AuthContext.jsx";

export function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, isInitializing, user } = useAuth();

  if (isInitializing) return null;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user?.role)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
}


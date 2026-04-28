import { Navigate } from "react-router-dom";
import { useAuth } from "../../components/auth/AuthContext.jsx";
import { dashboardPathForRole } from "../../routes/roleRedirect.js";

export function DashboardIndexPage() {
  const { user } = useAuth();
  return <Navigate to={dashboardPathForRole(user?.role)} replace />;
}


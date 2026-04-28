import { Navigate, Route, Routes } from "react-router-dom";
import { PublicLayout } from "../layouts/PublicLayout.jsx";
import { DashboardLayout } from "../layouts/DashboardLayout.jsx";
import { ProtectedRoute } from "./ProtectedRoute.jsx";
import { HomePage } from "../pages/Home.jsx";
import { LoginPage } from "../pages/Login.jsx";
import { RegisterPage } from "../pages/Register.jsx";
import { NotFoundPage } from "../pages/NotFound.jsx";
import { AdminDashboardPage } from "../pages/dashboard/AdminDashboard.jsx";
import { DoctorDashboardPage } from "../pages/dashboard/DoctorDashboard.jsx";
import { PatientDashboardPage } from "../pages/dashboard/PatientDashboard.jsx";
import { DashboardIndexPage } from "../pages/dashboard/DashboardIndex.jsx";
import { BookAppointmentPage } from "../pages/BookAppointment.jsx";
import { AppointmentsPage } from "../pages/Appointments.jsx";
import { useAuth } from "../components/auth/AuthContext.jsx";

function RedirectIfAuthed({ children }) {
  const { isAuthenticated, isInitializing, user } = useAuth();
  if (isInitializing) return null;
  if (isAuthenticated)
    return <Navigate to="/dashboard" replace state={{ role: user?.role }} />;
  return children;
}

export function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route
          path="/login"
          element={
            <RedirectIfAuthed>
              <LoginPage />
            </RedirectIfAuthed>
          }
        />
        <Route
          path="/register"
          element={
            <RedirectIfAuthed>
              <RegisterPage />
            </RedirectIfAuthed>
          }
        />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardIndexPage />} />

          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/dashboard/admin" element={<AdminDashboardPage />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["doctor"]} />}>
            <Route path="/dashboard/doctor" element={<DoctorDashboardPage />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["patient"]} />}>
            <Route path="/dashboard/patient" element={<PatientDashboardPage />} />
            <Route path="/book" element={<BookAppointmentPage />} />
          </Route>

          <Route path="/appointments" element={<AppointmentsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}


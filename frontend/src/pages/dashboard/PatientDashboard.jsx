import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../components/auth/AuthContext.jsx";
import { StatusBadge } from "../../components/ui/StatusBadge.jsx";
import { getAppointments } from "../../data/store.js";

export function PatientDashboardPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const items = await getAppointments();
        if (active) setAppointments(items);
      } catch (err) {
        if (active) setError(err.message || "Failed to load appointments.");
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const myAppointments = useMemo(
    () => appointments.filter((a) => a.patientEmail === user?.email),
    [appointments, user?.email],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Patient Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Book an appointment and track your status.
          </p>
        </div>
        <Link to="/book" className="btn-primary">
          Book Appointment
        </Link>
      </div>

      <div className="card">
        {error ? <div className="p-4 text-sm text-rose-700">{error}</div> : null}
        <div className="border-b border-slate-200 p-6">
          <div className="text-lg font-semibold text-slate-900">
            My Appointments
          </div>
          <div className="text-sm text-slate-600">
            Appointments booked with doctors
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th className="th">Doctor</th>
                <th className="th">Date</th>
                <th className="th">Status</th>
              </tr>
            </thead>
            <tbody>
              {myAppointments.map((ap) => (
                <tr key={ap.id}>
                  <td className="td">{ap.doctorName}</td>
                  <td className="td">{ap.date}</td>
                  <td className="td">
                    <StatusBadge status={ap.status} />
                  </td>
                </tr>
              ))}
              {myAppointments.length === 0 ? (
                <tr>
                  <td className="td" colSpan={3}>
                    No appointments yet. Click{" "}
                    <Link to="/book" className="font-medium text-brand-700">
                      Book Appointment
                    </Link>
                    .
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


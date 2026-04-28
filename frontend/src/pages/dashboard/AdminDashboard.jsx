import { useEffect, useState } from "react";
import { SummaryCard } from "../../components/ui/SummaryCard.jsx";
import { StatusBadge } from "../../components/ui/StatusBadge.jsx";
import { getAppointments, getUsersByRole } from "../../data/store.js";

export function AdminDashboardPage() {
  const [appointments, setAppointments] = useState([]);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [totalPatients, setTotalPatients] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [items, doctors, patients] = await Promise.all([
          getAppointments(),
          getUsersByRole("doctor"),
          getUsersByRole("patient"),
        ]);
        if (!active) return;
        setAppointments(items);
        setTotalDoctors(doctors.length);
        setTotalPatients(patients.length);
      } catch (err) {
        if (active) setError(err.message || "Failed to load dashboard data.");
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const totalAppointments = appointments.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">
          Overview of doctors, patients, and appointments.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <SummaryCard title="Total Doctors" value={totalDoctors} />
        <SummaryCard title="Total Patients" value={totalPatients} />
        <SummaryCard title="Total Appointments" value={totalAppointments} />
      </div>

      <div className="card">
        {error ? <div className="p-4 text-sm text-rose-700">{error}</div> : null}
        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <div>
            <div className="text-lg font-semibold text-slate-900">
              Appointment Table
            </div>
            <div className="text-sm text-slate-600">Recent appointments</div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th className="th">Patient Name</th>
                <th className="th">Doctor Name</th>
                <th className="th">Date</th>
                <th className="th">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((ap) => (
                <tr key={ap.id}>
                  <td className="td">{ap.patientName}</td>
                  <td className="td">{ap.doctorName}</td>
                  <td className="td">{ap.date}</td>
                  <td className="td">
                    <StatusBadge status={ap.status} />
                  </td>
                </tr>
              ))}
              {appointments.length === 0 ? (
                <tr>
                  <td className="td" colSpan={4}>
                    No appointments found.
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


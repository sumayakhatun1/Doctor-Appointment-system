export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="container-app py-10 text-sm text-slate-600">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="text-base font-semibold text-slate-900">
              Doctor Appointment System
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              A simple web-based interface for managing doctor appointments with
              separate dashboards for Admin, Doctor, and Patient. This project
              is implemented as a frontend-only semester assignment using React
              and Tailwind CSS.
            </p>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Quick Links
            </div>
            <ul className="mt-2 space-y-1 text-xs">
              <li>Home</li>
              <li>Login</li>
              <li>Register</li>
              <li>Dashboard</li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Contact & Project Info
            </div>
            <div className="mt-2 space-y-1 text-xs">
              <p>University Semester Project</p>
              <p>Front-end Demonstration Only</p>
              <p>Technology: React, React Router, Tailwind CSS</p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-4 text-xs text-slate-500">
          © {new Date().getFullYear()} Doctor Appointment System — Academic use
          only.
        </div>
      </div>
    </footer>
  );
}


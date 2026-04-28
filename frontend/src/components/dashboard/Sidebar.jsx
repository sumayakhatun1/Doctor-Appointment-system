import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { Logo } from "../ui/Logo.jsx";

function SideItem({ to, children }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `block rounded-lg px-3 py-2 text-sm font-medium transition ${
          isActive
            ? "bg-brand-50 text-brand-700"
            : "text-slate-700 hover:bg-slate-100"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

export function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();

  const role = user?.role;
  const menu =
    role === "admin"
      ? [
          { to: "/dashboard/admin", label: "Overview" },
          { to: "/appointments", label: "Appointments" }
        ]
      : role === "doctor"
        ? [
            { to: "/dashboard/doctor", label: "Overview" },
            { to: "/appointments", label: "Appointments" }
          ]
        : [
            { to: "/dashboard/patient", label: "Overview" },
            { to: "/book", label: "Book Appointment" },
            { to: "/appointments", label: "My Appointments" }
          ];

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-900/40 sm:hidden ${
          open ? "block" : "hidden"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`fixed left-0 top-0 z-50 h-full w-72 border-r border-slate-200 bg-white sm:static sm:z-auto sm:block ${
          open ? "block" : "hidden"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
          <div className="scale-[0.95]">
            <Logo />
          </div>
          <button
            type="button"
            className="btn-outline sm:hidden"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="flex h-[calc(100%-4rem)] flex-col px-4 py-4">
          <div className="mb-4 rounded-lg bg-brand-50 p-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-brand-700">
              {role}
            </div>
            <div className="mt-1 text-sm font-semibold text-slate-900">
              {user?.name}
            </div>
            <div className="text-xs text-slate-600">{user?.email}</div>
          </div>

          <div className="flex-1 space-y-1">
            {menu.map((item) => (
              <SideItem key={item.to} to={item.to}>
                {item.label}
              </SideItem>
            ))}
          </div>

          <button type="button" className="btn-outline w-full" onClick={logout}>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}


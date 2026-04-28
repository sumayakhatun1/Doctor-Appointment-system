import { useAuth } from "../auth/AuthContext.jsx";

export function Topbar({ onToggleSidebar }) {
  const { user } = useAuth();

  return (
    <div className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="btn-outline sm:hidden"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          Menu
        </button>
        <div className="text-sm text-slate-600">
          Logged in as{" "}
          <span className="font-semibold text-slate-900">{user?.name}</span>{" "}
          <span className="text-slate-500">({user?.role})</span>
        </div>
      </div>
      <div className="text-sm font-medium text-brand-700">Dashboard</div>
    </div>
  );
}


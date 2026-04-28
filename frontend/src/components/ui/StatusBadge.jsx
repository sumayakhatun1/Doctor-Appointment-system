const stylesByStatus = {
  Pending: "bg-amber-50 text-amber-700 border border-amber-200",
  Approved: "bg-blue-50 text-blue-700 border border-blue-200",
  Completed: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Cancelled: "bg-rose-50 text-rose-700 border border-rose-200"
};

export function StatusBadge({ status }) {
  const style =
    stylesByStatus[status] ??
    "bg-slate-50 text-slate-700 border border-slate-200";

  return <span className={`badge ${style}`}>{status}</span>;
}


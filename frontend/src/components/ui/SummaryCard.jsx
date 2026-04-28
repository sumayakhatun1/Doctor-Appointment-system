export function SummaryCard({ title, value, subtitle }) {
  return (
    <div className="card card-pad">
      <div className="text-sm font-medium text-slate-600">{title}</div>
      <div className="mt-2 text-3xl font-semibold text-slate-900">{value}</div>
      {subtitle ? (
        <div className="mt-2 text-sm text-slate-500">{subtitle}</div>
      ) : null}
    </div>
  );
}


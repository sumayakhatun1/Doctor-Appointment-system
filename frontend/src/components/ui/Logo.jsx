export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand-600 text-white shadow-sm">
        <span className="text-sm font-bold">DA</span>
      </div>
      <div className="leading-tight">
        <div className="text-sm font-semibold text-slate-900">
          Doctor Appointment
        </div>
        <div className="text-xs text-slate-500">System</div>
      </div>
    </div>
  );
}


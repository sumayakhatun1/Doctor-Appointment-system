import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="container-app py-16">
      <div className="mx-auto max-w-xl text-center">
        <div className="text-6xl font-bold text-brand-700">404</div>
        <h2 className="mt-3 text-2xl font-semibold text-slate-900">
          Page not found
        </h2>
        <p className="mt-2 text-slate-600">
          The page you are looking for doesn&apos;t exist.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/" className="btn-outline">
            Go Home
          </Link>
          <Link to="/dashboard" className="btn-primary">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}


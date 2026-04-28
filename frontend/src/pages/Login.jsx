import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../components/auth/AuthContext.jsx";
import { dashboardPathForRole } from "../routes/roleRedirect.js";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = useMemo(() => location.state?.from?.pathname, [location.state]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    if (isSubmitting) return;
    setError("");
    setIsSubmitting(true);
    try {
      const res = await login({ email, password });
      if (!res.ok) {
        setError(res.message);
        return;
      }
      navigate(from || dashboardPathForRole(res.role), { replace: true });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container-app py-10 pt-20">
      <div className="mx-auto max-w-md">
        <div className="card card-pad">
          <h2 className="text-xl font-semibold text-slate-900">Login</h2>
          <p className="mt-1 text-sm text-slate-600">
            Use demo accounts from Home page or your registered role.
          </p>

          {error ? (
            <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="label">Email</label>
              <input
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@demo.com"
                type="email"
                disabled={isSubmitting}
                required
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="admin123"
                type="password"
                disabled={isSubmitting}
                required
              />
            </div>

            <button type="submit" className="btn-primary w-full disabled:opacity-60" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-6 text-sm text-slate-600">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="font-medium text-brand-700">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


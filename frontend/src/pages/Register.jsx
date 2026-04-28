import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../components/auth/AuthContext.jsx";
import { dashboardPathForRole } from "../routes/roleRedirect.js";

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    if (isSubmitting) return;
    setError("");
    setIsSubmitting(true);
    try {
      const res = await register({ name, email, password, role });
      if (!res.ok) {
        setError(res.message);
        return;
      }
      navigate(dashboardPathForRole(res.role), { replace: true });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container-app py-10 pt-20">
      <div className="mx-auto max-w-md">
        <div className="card card-pad">
          <h2 className="text-xl font-semibold text-slate-900">Register</h2>
          <p className="mt-1 text-sm text-slate-600">
            Select your role (Patient / Doctor) for dashboards.
          </p>

          {error ? (
            <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="label">Full Name</label>
              <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                disabled={isSubmitting}
                required
              />
            </div>
            <div>
              <label className="label">Email</label>
              <input
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
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
                placeholder="Create a password"
                type="password"
                disabled={isSubmitting}
                required
              />
            </div>

            <div>
              <label className="label">Role</label>
              <select
                className="input"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={isSubmitting}
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
              </select>
              <div className="mt-2 text-xs text-slate-500">
                Note: Admin role is provided via demo login only.
              </div>
            </div>

            <button type="submit" className="btn-primary w-full disabled:opacity-60" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-sm text-slate-600">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-brand-700">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


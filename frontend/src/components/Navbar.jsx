import { Link, NavLink } from "react-router-dom";
import { Logo } from "./ui/Logo.jsx";
import { useAuth } from "./auth/AuthContext.jsx";

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `rounded-lg px-3 py-2 text-sm font-medium transition ${
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

export function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  async function handleLogout() {
    await logout();
  }

  return (
    <header className="border-b fixed z-50 w-full border-slate-200 bg-white">
      <div className="container-app flex h-16 items-center justify-between">
        <Link to="/" className="rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500">
          <Logo />
        </Link>

        <nav className="flex items-center gap-2">
          {!isAuthenticated ? (
            <>
              <NavItem to="/login">Login</NavItem>
              <NavItem to="/register">Register</NavItem>
            </>
          ) : (
            <>
              <NavItem to="/dashboard">Dashboard</NavItem>
              <button type="button" className="btn-outline" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}


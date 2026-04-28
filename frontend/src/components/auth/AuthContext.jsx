import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest, clearToken, setToken, getToken } from "../../lib/api.js";

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    async function boot() {
      const token = getToken();
      if (!token) {
        setUser(null);
        setIsInitializing(false);
        return;
      }

      try {
        const res = await apiRequest("/users/me");
        setUser(res.user);
      } catch {
        clearToken();
        setUser(null);
      } finally {
        setIsInitializing(false);
      }
    }
    boot();
  }, []);

  const isAuthenticated = !!user;

  async function login({ email, password }) {
    try {
      const res = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setToken(res.token);
      setUser(res.user);
      return { ok: true, role: res.user.role };
    } catch (error) {
      return { ok: false, message: error.message || "Login failed." };
    }
  }

  async function register({ name, email, password, role }) {
    if (!name || !email || !password || !role) {
      return { ok: false, message: "Please fill all fields." };
    }
    try {
      const res = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password, role }),
      });
      setToken(res.token);
      setUser(res.user);
      return { ok: true, role: res.user.role };
    } catch (error) {
      return { ok: false, message: error.message || "Registration failed." };
    }
  }

  async function logout() {
    clearToken();
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, isAuthenticated, isInitializing, login, register, logout }),
    [user, isAuthenticated, isInitializing],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const TOKEN_KEY = "das_auth_token_v1";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || "";
}

export function setToken(token) {
  if (!token) {
    localStorage.removeItem(TOKEN_KEY);
    return;
  }
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function apiRequest(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  console.log("[apiRequest]", {
    url: `${API_BASE_URL}${path}`,
    method: options.method || "GET",
    hasAuthHeader: Boolean(headers.Authorization),
    hasBody: Boolean(options.body),
  });

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  let body = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    const message = body?.message || body?.error?.message || "Request failed.";
    throw new Error(message);
  }

  return body;
}

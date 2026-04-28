export function dashboardPathForRole(role) {
  if (role === "admin") return "/dashboard/admin";
  if (role === "doctor") return "/dashboard/doctor";
  return "/dashboard/patient";
}


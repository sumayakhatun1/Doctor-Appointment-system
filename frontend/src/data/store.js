import { apiRequest, getToken } from "../lib/api.js";

export async function getAppointments() {
  const res = await apiRequest("/appointments");
  return res.items || [];
}

export async function addAppointment({ doctorId, date, notes = "" }) {
  const res = await apiRequest("/appointments", {
    method: "POST",
    body: JSON.stringify({ doctorId, date, notes }),
  });
  return res.appointment;
}

export async function updateAppointmentStatus(appointmentId, status) {
  const token = getToken();
  console.log("[updateAppointmentStatus] request", {
    appointmentId,
    status,
    hasToken: Boolean(token),
  });
  const res = await apiRequest(`/appointments/${appointmentId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  console.log("[updateAppointmentStatus] response", {
    appointmentId,
    newStatus: res.appointment?.status,
    emailNotification: res.emailNotification,
  });
  if (res.emailNotification && !res.emailNotification.ok) {
    console.warn("[updateAppointmentStatus] email was not sent:", res.emailNotification);
  }
  return res.appointment;
}

export async function getDoctors() {
  const res = await apiRequest("/users?role=doctor");
  return (res.items || []).map((item) => ({
    id: item.id,
    name: item.name,
    email: item.email,
    specialization: item.specialization || "General",
  }));
}

export async function getUsersByRole(role) {
  const res = await apiRequest(`/users?role=${encodeURIComponent(role)}`);
  return res.items || [];
}


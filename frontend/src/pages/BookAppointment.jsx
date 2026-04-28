import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/auth/AuthContext.jsx";
import { addAppointment, getDoctors } from "../data/store.js";

export function BookAppointmentPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [doctorOptions, setDoctorOptions] = useState([]);
  const [doctorId, setDoctorId] = useState("");
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(true);
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadDoctors() {
      setIsLoadingDoctors(true);
      try {
        const doctors = await getDoctors();

        if (!isMounted) return;
        setDoctorOptions(doctors);
        setDoctorId((prev) => prev || doctors[0]?.id || "");
      } catch {
        if (!isMounted) return;
        setMessage("Doctors load করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
      } finally {
        if (isMounted) setIsLoadingDoctors(false);
      }
    }

    loadDoctors();
    return () => {
      isMounted = false;
    };
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (isLoadingDoctors) {
      setMessage("Doctors list loading হচ্ছে, একটু wait করুন।");
      return;
    }

    const doctor = doctorOptions.find((d) => d.id === doctorId);
    if (!doctor) {
      setMessage("Please select a doctor.");
      return;
    }
    if (!date) {
      setMessage("Please select a date.");
      return;
    }

    try {
      await addAppointment({
        patientName: user?.name,
        patientEmail: user?.email,
        doctorId: doctor.id,
        doctorName: doctor.name,
        date,
      });
      navigate("/appointments", { replace: true });
    } catch (error) {
      setMessage(error.message || "Booking failed.");
    }
  }

  return (
    <div className="container-app py-8">
      <div className="mx-auto max-w-lg">
        <div className="card card-pad">
          <h1 className="text-xl font-semibold text-slate-900">
            Book Appointment
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Select a doctor and choose a date.
          </p>

          {message ? (
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              {message}
            </div>
          ) : null}

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="label">Select Doctor</label>
              <select
                className="input"
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                disabled={isLoadingDoctors || doctorOptions.length === 0}
              >
                {isLoadingDoctors ? (
                  <option value="">Loading doctors...</option>
                ) : null}
                {doctorOptions.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} — {d.specialization} {d.email ? `(${d.email})` : ""}
                  </option>
                ))}
              </select>
              {!isLoadingDoctors && doctorOptions.length === 0 ? (
                <div className="mt-2 text-xs text-rose-600">
                  কোনো doctor account পাওয়া যায়নি।
                </div>
              ) : null}
            </div>

            <div>
              <label className="label">Select Date</label>
              <input
                className="input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                type="date"
                required
              />
            </div>

            <button type="submit" className="btn-primary w-full">
              Submit
            </button>
          </form>

          <div className="mt-6 rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
            <div className="font-semibold">Note</div>
            <div className="mt-1 text-slate-600">
              Booking data is now saved through backend API.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


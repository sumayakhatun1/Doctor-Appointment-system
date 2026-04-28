import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <div className="bg-slate-50 pt-16">
      {/* Hero Section */}
      <section className="py-20 px-[15px] bg-white">
        <div className="max-w-6xl mx-auto ">
          <div className="grid md:grid-cols-2 items-center gap-10">
            {/* Left side */}
            <div>
              <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                Doctor Appointment System
              </h1>
              <p className="mt-3 text-lg font-medium text-brand-700">
                Book and manage appointments efficiently
              </p>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                A comprehensive web-based solution for hospitals and clinics to
                streamline appointment scheduling and management processes.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Login
                </Link>
              </div>
            </div>

            {/* Right side - Appointment preview card */}
            <div className="bg-white border border-slate-200 rounded-lg shadow-md p-6">
              {/* <div className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">
                Appointment Preview
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      Dr. Ayesha Khan
                    </div>
                    <div className="text-xs text-slate-500">Cardiology</div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-amber-50 text-amber-700 border border-amber-200">
                    Pending
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      Dr. Hamza Ali
                    </div>
                    <div className="text-xs text-slate-500">Dermatology</div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    Approved
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      Dr. Sana Ahmed
                    </div>
                    <div className="text-xs text-slate-500">Neurology</div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Completed
                  </span>
                </div>
              </div> */}
              <img className="w-full" src="https://png.pngtree.com/thumb_back/fw800/background/20230519/pngtree-group-of-doctors-pose-together-to-show-their-profession-image_2612233.jpg" alt="" />
            </div>
          </div>
        </div>
      </section>

      {/* About the System Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-[100px]">
          <h2 className="text-2xl font-bold text-slate-900 text-center">
            About the System
          </h2>
          <p className="mt-4 max-w-6xl mx-auto text-center text-base leading-relaxed text-slate-600">
            The Doctor Appointment System is a web-based platform designed to
            facilitate efficient appointment scheduling and management for
            healthcare facilities. The system provides distinct interfaces for
            three primary roles: <span className="font-semibold">Admin</span>{" "}
            manages overall operations and appointments,{" "}
            <span className="font-semibold">Doctor</span> views and updates
            assigned appointments, and
            <span className="font-semibold">Patient</span> books appointments
            and tracks their visit status.
          </p>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-[100px]">
          <h2 className="text-2xl font-bold text-slate-900 text-center">
            Core Features
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Role-Based Access",
                desc: "Separate dashboards for Admin, Doctor, and Patient roles.",
              },
              {
                title: "Secure Authentication",
                desc: "Login and registration system with role-based access control.",
              },
              {
                title: "Appointment Scheduling",
                desc: "Easy booking interface for patients to select doctors and dates.",
              },
              {
                title: "Appointment Tracking",
                desc: "Real-time status updates: Pending, Approved, and Completed.",
              },
              {
                title: "Dashboard Overview",
                desc: "Comprehensive dashboards showing relevant information for each role.",
              },
              {
                title: "Responsive Design",
                desc: "Fully responsive interface that works on all devices and screen sizes.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-white shadow-md rounded-lg p-6 border border-slate-200"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                    <span className="text-lg font-bold">✓</span>
                  </div>
                  <h3 className="text-base font-semibold text-slate-900">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-[100px]">
          <h2 className="text-2xl font-bold text-slate-900 text-center">
            Departments
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-4">
            {[
              {
                name: "Cardiology",
                desc: "Heart and cardiovascular system care.",
              },
              {
                name: "Neurology",
                desc: "Brain and nervous system treatment.",
              },
              {
                name: "Dermatology",
                desc: "Skin conditions and related care.",
              },
              {
                name: "Pediatrics",
                desc: "Medical care for children and adolescents.",
              },
            ].map((dept) => (
              <div
                key={dept.name}
                className="bg-white border border-slate-200 rounded-lg shadow-md p-6 text-center"
              >
                <h3 className="text-base font-semibold text-slate-900">
                  {dept.name}
                </h3>
                <p className="mt-2 text-sm text-slate-600">{dept.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-6xl mx-auto px-[100px]">
          <h2 className="text-2xl font-bold text-slate-900 text-center">
            System Statistics
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-4">
            {[
              { value: "10+", label: "Doctors" },
              { value: "100+", label: "Patients" },
              { value: "200+", label: "Appointments" },
              { value: "5", label: "Departments" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white border border-slate-200 rounded-lg shadow-md p-6 text-center"
              >
                <div className="text-3xl font-bold text-brand-700">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm font-medium text-slate-600 uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

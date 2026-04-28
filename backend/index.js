const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;
const JWT_SECRET =
  process.env.JWT_SECRET ||
  process.env.ACCESS_TOKEN_SECRET ||
  "change-this-secret";
const DB_NAME = process.env.DB_NAME || "doctorApp";

app.use(
  cors({
    origin: ["http://localhost:5173","https://doctor-appointment-systems.netlify.app"],
    credentials: true,
  }),
);
app.use(express.json());
// hello
// ================= EMAIL SETUP START =================

function getMailCredentials() {
  const user = (process.env.EMAIL_USER || "").trim();
  const pass = (process.env.EMAIL_PASS || "")
    .trim()
    .replace(/^["']|["']$/g, "");
  return { user, pass };
}

const smtpPort = Number(process.env.SMTP_PORT || 465);
const useStarttls587 = smtpPort === 587;
const smtpSecure = useStarttls587
  ? false
  : process.env.SMTP_SECURE
    ? process.env.SMTP_SECURE === "true"
    : smtpPort === 465;

// Explicit SMTP (more reliable than service: "gmail" on some networks)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: smtpPort,
  secure: smtpSecure,
  requireTLS: useStarttls587,
  auth: getMailCredentials(),
});

// optional: verify connection
transporter.verify((error) => {
  if (error) {
    console.log("❌ Email server error:", error);
  } else {
    console.log("✅ Email server is ready");
  }
});

// send email function — returns result so API can surface delivery status
const sendEmail = async (to, subject, html) => {
  const { user, pass } = getMailCredentials();
  console.log("[sendEmail] invoked", {
    to: to ? String(to) : to,
    subject,
    htmlLength: html ? String(html).length : 0,
    smtpUserConfigured: Boolean(user),
  });
  if (!to || !String(to).trim()) {
    console.warn("[sendEmail] skipped: missing or empty recipient address");
    return { ok: false, code: "NO_RECIPIENT", message: "Patient email missing on appointment." };
  }
  if (!user || !pass) {
    console.error("[sendEmail] EMAIL_USER or EMAIL_PASS missing/empty in .env");
    return { ok: false, code: "SMTP_CONFIG", message: "Set EMAIL_USER and EMAIL_PASS in backend/.env" };
  }
  try {
    const info = await transporter.sendMail({
      from: `"Doctor Appointment System" <${user}>`,
      to: String(to).trim(),
      subject,
      html,
    });

    console.log("[sendEmail] sendMail finished", {
      messageId: info.messageId,
      response: info.response,
      accepted: info.accepted,
      rejected: info.rejected,
    });

    if (info.rejected && info.rejected.length > 0) {
      return {
        ok: false,
        code: "SMTP_REJECT",
        message: `Rejected: ${info.rejected.join(", ")}`,
        response: info.response,
      };
    }

    return { ok: true, messageId: info.messageId, response: info.response };
  } catch (error) {
    console.error("[sendEmail] error:", error && error.message ? error.message : error);
    return {
      ok: false,
      code: "SMTP_ERROR",
      message: error.message || String(error),
    };
  }
};

// ================= EMAIL SETUP END =================

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yl5czei.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

function sanitizeUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    specialization: user.specialization || "General",
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function sanitizeAppointment(item) {
  return {
    id: item._id.toString(),
    patientId: item.patientId,
    patientName: item.patientName,
    patientEmail: item.patientEmail,
    doctorId: item.doctorId,
    doctorName: item.doctorName,
    date: item.date,
    status: item.status,
    notes: item.notes || "",
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

function authRequired(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!token) {
    return res.status(401).send({ success: false, message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).send({ success: false, message: "Invalid token" });
  }
}

async function run() {
  try {
    await client.connect();

    const serviceCollection = client.db(DB_NAME).collection("services");
    const bookingCollection = client.db(DB_NAME).collection("bookings");
    const usersCollection = client.db(DB_NAME).collection("users");
    const appointmentsCollection = client.db(DB_NAME).collection("appointments");

    await usersCollection.createIndex({ email: 1 }, { unique: true });
    await usersCollection.createIndex({ role: 1 });
    await appointmentsCollection.createIndex({ patientId: 1 });
    await appointmentsCollection.createIndex({ doctorId: 1 });
    await appointmentsCollection.createIndex({ status: 1 });

    const existingAdmin = await usersCollection.findOne({ role: "admin" });
    if (!existingAdmin) {
      const now = new Date().toISOString();
      const seedUsers = [
        {
          name: "Admin User",
          email: "admin@demo.com",
          password: "admin123",
          role: "admin",
          specialization: "General",
        },
        {
          name: "Dr. Ayesha Khan",
          email: "ayesha@demo.com",
          password: "doctor123",
          role: "doctor",
          specialization: "Cardiology",
        },
        {
          name: "Dr. Hamza Ali",
          email: "hamza@demo.com",
          password: "doctor123",
          role: "doctor",
          specialization: "Dermatology",
        },
        {
          name: "Sara Student",
          email: "sara@demo.com",
          password: "patient123",
          role: "patient",
          specialization: "General",
        },
      ];

      const docs = await Promise.all(
        seedUsers.map(async (item) => ({
          name: item.name,
          email: item.email,
          role: item.role,
          specialization: item.specialization,
          passwordHash: await bcrypt.hash(item.password, 10),
          createdAt: now,
          updatedAt: now,
        })),
      );
      await usersCollection.insertMany(docs);
      console.log("Seeded default users");
    }

    // Backward-compatible existing routes
    app.get("/services", async (req, res) => {
      const result = await serviceCollection.find().toArray();
      res.send(result);
    });

    app.get("/services/:id", async (req, res) => {
      const result = await serviceCollection.findOne(
        { _id: new ObjectId(req.params.id) },
        { projection: { title: 1, price: 1, service_id: 1, img: 1 } },
      );
      res.send(result);
    });

    app.get("/bookings", async (req, res) => {
      const query = req.query?.email ? { email: req.query.email } : {};
      const result = await bookingCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/bookings", async (req, res) => {
      const result = await bookingCollection.insertOne(req.body);
      res.send(result);
    });

    app.delete("/bookings/:id", async (req, res) => {
      const result = await bookingCollection.deleteOne({
        _id: new ObjectId(req.params.id),
      });
      res.send(result);
    });

    app.patch("/bookings/:id", async (req, res) => {
      const result = await bookingCollection.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: { status: req.body.status } },
      );
      res.send(result);
    });

    app.get("/bookings/:id", async (req, res) => {
      const result = await bookingCollection.findOne({
        _id: new ObjectId(req.params.id),
      });
      res.send(result);
    });

    // Auth + user APIs
    app.post("/auth/register", async (req, res) => {
      const { name, email, password, role } = req.body || {};
      if (!name || !email || !password || !role) {
        return res
          .status(400)
          .send({ success: false, message: "All fields are required." });
      }

      if (!["admin", "doctor", "patient"].includes(role)) {
        return res.status(400).send({ success: false, message: "Invalid role." });
      }

      const existing = await usersCollection.findOne({ email });
      if (existing) {
        return res
          .status(409)
          .send({ success: false, message: "Email already exists." });
      }

      const now = new Date().toISOString();
      const passwordHash = await bcrypt.hash(password, 10);
      const userDoc = {
        name,
        email,
        passwordHash,
        role,
        specialization: req.body.specialization || "General",
        createdAt: now,
        updatedAt: now,
      };

      const insertResult = await usersCollection.insertOne(userDoc);
      const user = { ...userDoc, _id: insertResult.insertedId };
      const token = jwt.sign(
        { id: user._id.toString(), email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "7d" },
      );

      res.status(201).send({ success: true, token, user: sanitizeUser(user) });
    });

    app.post("/auth/login", async (req, res) => {
      const { email, password } = req.body || {};
      if (!email || !password) {
        return res
          .status(400)
          .send({ success: false, message: "Email and password are required." });
      }

      const user = await usersCollection.findOne({ email });
      if (!user) {
        return res
          .status(401)
          .send({ success: false, message: "Invalid email or password." });
      }

      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        return res
          .status(401)
          .send({ success: false, message: "Invalid email or password." });
      }

      const token = jwt.sign(
        { id: user._id.toString(), email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "7d" },
      );

      res.send({ success: true, token, user: sanitizeUser(user) });
    });

    app.get("/users/me", authRequired, async (req, res) => {
      const user = await usersCollection.findOne({ _id: new ObjectId(req.user.id) });
      if (!user) {
        return res.status(404).send({ success: false, message: "User not found." });
      }
      res.send({ success: true, user: sanitizeUser(user) });
    });

    app.get("/users", authRequired, async (req, res) => {
      const query = {};
      if (req.query.role) {
        query.role = req.query.role;
      }
      const users = await usersCollection.find(query).toArray();
      res.send({
        success: true,
        items: users.map((user) => sanitizeUser(user)),
      });
    });

    app.patch("/users/:id", authRequired, async (req, res) => {
      const isSelf = req.user.id === req.params.id;
      const isAdmin = req.user.role === "admin";
      if (!isSelf && !isAdmin) {
        return res.status(403).send({ success: false, message: "Forbidden" });
      }

      const payload = req.body || {};
      const allowed = ["name", "specialization", "role"];
      const updates = {};
      allowed.forEach((key) => {
        if (payload[key] !== undefined) updates[key] = payload[key];
      });
      updates.updatedAt = new Date().toISOString();

      await usersCollection.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: updates },
      );
      const user = await usersCollection.findOne({ _id: new ObjectId(req.params.id) });
      res.send({ success: true, user: sanitizeUser(user) });
    });

    // Appointment APIs
    app.post("/appointments", authRequired, async (req, res) => {
      if (!["patient", "admin"].includes(req.user.role)) {
        return res.status(403).send({ success: false, message: "Forbidden" });
      }

      const { doctorId, date, notes } = req.body || {};
      if (!doctorId || !date) {
        return res
          .status(400)
          .send({ success: false, message: "Doctor and date are required." });
      }

      const patient = await usersCollection.findOne({ _id: new ObjectId(req.user.id) });
      const doctor = await usersCollection.findOne({
        _id: new ObjectId(doctorId),
        role: "doctor",
      });

      if (!patient || !doctor) {
        return res
          .status(404)
          .send({ success: false, message: "Doctor or patient not found." });
      }

      const now = new Date().toISOString();
      const item = {
        patientId: patient._id.toString(),
        patientName: patient.name,
        patientEmail: patient.email,
        doctorId: doctor._id.toString(),
        doctorName: doctor.name,
        date,
        status: "Pending",
        notes: notes || "",
        createdAt: now,
        updatedAt: now,
      };

      const insert = await appointmentsCollection.insertOne(item);
      // ================= EMAIL ON BOOKING =================

// patient email
const userHtml = `
  <h2>Appointment Requested ✅</h2>
  <p>Hello ${patient.name},</p>
  <p>Your appointment request has been sent successfully.</p>
  <p><b>Doctor:</b> ${doctor.name}</p>
  <p><b>Date:</b> ${date}</p>
  <p>Status: Pending</p>
`;

// doctor email
const doctorHtml = `
  <h2>New Appointment Request 📢</h2>
  <p>Doctor ${doctor.name},</p>
  <p>You have a new appointment request.</p>
  <p><b>Patient:</b> ${patient.name}</p>
  <p><b>Date:</b> ${date}</p>
`;

// send emails (non-blocking)
sendEmail(patient.email, "Appointment Request Sent", userHtml);
sendEmail(doctor.email, "New Appointment Request", doctorHtml);

// ================= EMAIL END =================
      res
        .status(201)
        .send({ success: true, appointment: sanitizeAppointment({ ...item, _id: insert.insertedId }) });
    });

    app.get("/appointments", authRequired, async (req, res) => {
      const query = {};
      if (req.user.role === "patient") query.patientId = req.user.id;
      if (req.user.role === "doctor") query.doctorId = req.user.id;
      if (req.query.status) query.status = req.query.status;

      const items = await appointmentsCollection
        .find(query)
        .sort({ createdAt: -1 })
        .toArray();

      res.send({
        success: true,
        items: items.map((item) => sanitizeAppointment(item)),
      });
    });

    app.get("/appointments/:id", authRequired, async (req, res) => {
      const item = await appointmentsCollection.findOne({
        _id: new ObjectId(req.params.id),
      });
      if (!item) {
        return res
          .status(404)
          .send({ success: false, message: "Appointment not found." });
      }
      const allowed =
        req.user.role === "admin" ||
        item.patientId === req.user.id ||
        item.doctorId === req.user.id;
      if (!allowed) {
        return res.status(403).send({ success: false, message: "Forbidden" });
      }
      res.send({ success: true, appointment: sanitizeAppointment(item) });
    });

    app.patch("/appointments/:id/status", authRequired, async (req, res) => {
      if (!["doctor", "admin"].includes(req.user.role)) {
        return res.status(403).send({ success: false, message: "Forbidden" });
      }
      const allowedStatuses = ["Pending", "Approved", "Completed", "Cancelled"];
      const { status } = req.body || {};
      console.log("[PATCH /appointments/:id/status]", {
        appointmentId: req.params.id,
        body: req.body,
        status,
        role: req.user.role,
        hasAuth: Boolean(req.headers.authorization),
      });
      if (!allowedStatuses.includes(status)) {
        return res.status(400).send({ success: false, message: "Invalid status." });
      }

      const item = await appointmentsCollection.findOne({
        _id: new ObjectId(req.params.id),
      });
      if (!item) {
        return res
          .status(404)
          .send({ success: false, message: "Appointment not found." });
      }
      if (req.user.role === "doctor" && item.doctorId !== req.user.id) {
        return res.status(403).send({ success: false, message: "Forbidden" });
      }

      await appointmentsCollection.updateOne(
        { _id: item._id },
        { $set: { status, updatedAt: new Date().toISOString() } },
      );
      let updated = await appointmentsCollection.findOne({ _id: item._id });
      // ================= EMAIL ON STATUS UPDATE =================
      let patientEmail = updated.patientEmail && String(updated.patientEmail).trim();
      if (!patientEmail && updated.patientId) {
        try {
          const patientUser = await usersCollection.findOne({
            _id: new ObjectId(updated.patientId),
          });
          patientEmail = patientUser?.email ? String(patientUser.email).trim() : "";
          console.log("[PATCH /appointments/:id/status] resolved patientEmail from users", {
            found: Boolean(patientUser),
            patientEmail: patientEmail || null,
          });
        } catch (lookupErr) {
          console.warn("[PATCH /appointments/:id/status] patient email lookup failed", lookupErr);
        }
      }
      if (patientEmail && (!updated.patientEmail || !String(updated.patientEmail).trim())) {
        await appointmentsCollection.updateOne(
          { _id: item._id },
          { $set: { patientEmail, updatedAt: new Date().toISOString() } },
        );
        updated = await appointmentsCollection.findOne({ _id: item._id });
      }

      const statusHtml = `
  <h2>Appointment Update 🔔</h2>
  <p>Hello ${updated.patientName || "Patient"},</p>
  <p>Your appointment status is now: <b>${status}</b></p>
  <p><b>Doctor:</b> ${updated.doctorName || ""}</p>
  <p><b>Date:</b> ${updated.date || ""}</p>
`;

      const emailSubject =
        status === "Approved" ? "Appointment Approved" : "Appointment Status Updated";
      console.log("[PATCH /appointments/:id/status] before sendEmail", {
        status,
        subject: emailSubject,
        patientEmailOnDoc: updated.patientEmail || null,
        resolvedPatientEmail: patientEmail || null,
      });
      const emailNotification = await sendEmail(
        patientEmail,
        emailSubject,
        statusHtml,
      );

      // ================= EMAIL END =================
      res.send({
        success: true,
        appointment: sanitizeAppointment(updated),
        emailNotification,
      });
    });

    app.patch("/appointments/:id", authRequired, async (req, res) => {
      const item = await appointmentsCollection.findOne({
        _id: new ObjectId(req.params.id),
      });
      if (!item) {
        return res
          .status(404)
          .send({ success: false, message: "Appointment not found." });
      }

      const canEdit = req.user.role === "admin" || item.patientId === req.user.id;
      if (!canEdit) {
        return res.status(403).send({ success: false, message: "Forbidden" });
      }

      const updates = {};
      if (req.body.date) updates.date = req.body.date;
      if (req.body.notes !== undefined) updates.notes = req.body.notes;
      updates.updatedAt = new Date().toISOString();

      await appointmentsCollection.updateOne({ _id: item._id }, { $set: updates });
      const updated = await appointmentsCollection.findOne({ _id: item._id });
      res.send({ success: true, appointment: sanitizeAppointment(updated) });
    });

    app.delete("/appointments/:id", authRequired, async (req, res) => {
      const item = await appointmentsCollection.findOne({
        _id: new ObjectId(req.params.id),
      });
      if (!item) {
        return res
          .status(404)
          .send({ success: false, message: "Appointment not found." });
      }

      const canDelete = req.user.role === "admin" || item.patientId === req.user.id;
      if (!canDelete) {
        return res.status(403).send({ success: false, message: "Forbidden" });
      }

      await appointmentsCollection.deleteOne({ _id: item._id });
      res.send({ success: true, deleted: true });
    });

    app.get("/", (req, res) => {
      res.send("doctor is running");
    });

    await client.db("admin").command({ ping: 1 });
    console.log("MongoDB connected");

    app.listen(port, () => {
      console.log(`doctor server running on port ${port}`);
    });
  } finally {
    // keep connection open
  }
}

run().catch(console.dir);
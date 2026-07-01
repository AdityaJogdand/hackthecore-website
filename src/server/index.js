import "./loadEnv.js";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import registrationRoutes from "./routes/registrations.js";
import adminRoutes, { requireAdmin } from "./routes/admin.js";
import eventRoutes from "./routes/events.js";
import partnershipRoutes from "./routes/partnerships.js";
import authRoutes from "./routes/auth.js";

import passport from "passport";


const app = express();

// ── Security headers ──
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false, // Let the SPA handle CSP
}));

// ── CORS ──
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));

// ── Body parser with size limit to prevent payload attacks ──
app.use(express.json({ limit: "1mb" }));

// ── Initialize Passport ──
app.use(passport.initialize());


// ── Routes ──
app.use("/api/auth", authRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/partnerships", partnershipRoutes);

app.get("/api/admin/registrations/hackathon", requireAdmin, async (req, res) => {
  try {
    const { HackathonRegistration } = await import("./models/Registration.js");
    const data = await HackathonRegistration.find().sort({ submittedAt: -1 });
    res.json(data);
  } catch {
    res.status(500).json({ message: "Server error." });
  }
});

app.get("/api/admin/registrations/meetup", requireAdmin, async (req, res) => {
  try {
    const { MeetupRegistration } = await import("./models/Registration.js");
    const data = await MeetupRegistration.find().sort({ submittedAt: -1 });
    res.json(data);
  } catch {
    res.status(500).json({ message: "Server error." });
  }
});

// ── Global error handler ──
app.use((err, req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error." });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 4000, () =>
      console.log(`Server running on port ${process.env.PORT || 4000}`)
    );
  })
  .catch(err => console.error("MongoDB connection error:", err));
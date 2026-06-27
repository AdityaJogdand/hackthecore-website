import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import registrationRoutes from "./routes/registrations.js";
import adminRoutes, { requireAdmin } from "./routes/admin.js";
import eventRoutes from "./routes/events.js";
import partnershipRoutes from "./routes/partnerships.js";

dotenv.config({ path: new URL("./.env", import.meta.url).pathname });

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

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

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 4000, () =>
      console.log(`Server running on port ${process.env.PORT || 4000}`)
    );
  })
  .catch(err => console.error("MongoDB connection error:", err));
import "./loadEnv.js";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import passport from "passport";

import adminRoutes from "./routes/admin.js";
import eventRoutes from "./routes/events.js";
import partnershipRoutes from "./routes/partnerships.js";
import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/projects.js";


const app = express();

/* -------------------------------------------------------------------------- */
/*                               Security                                      */
/* -------------------------------------------------------------------------- */

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false,
  })
);

/* -------------------------------------------------------------------------- */
/*                                  CORS                                      */
/* -------------------------------------------------------------------------- */

const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow Postman, curl, server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("Blocked CORS request from:", origin);

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

/* -------------------------------------------------------------------------- */
/*                             Middleware                                     */
/* -------------------------------------------------------------------------- */

app.use(express.json({ limit: "1mb" }));

app.use(passport.initialize());

/* -------------------------------------------------------------------------- */
/*                                Routes                                      */
/* -------------------------------------------------------------------------- */

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/partnerships", partnershipRoutes);
app.use("/api/projects", projectRoutes);


/* -------------------------------------------------------------------------- */
/*                               Health Check                                 */
/* -------------------------------------------------------------------------- */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "HackTheCore API is running 🚀",
  });
});

/* -------------------------------------------------------------------------- */
/*                             Error Handler                                  */
/* -------------------------------------------------------------------------- */

app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);

  res.status(500).json({
    message: "Internal Server Error",
  });
});

/* -------------------------------------------------------------------------- */
/*                              Database                                      */
/* -------------------------------------------------------------------------- */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    const PORT = process.env.PORT || 4000;

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
  });
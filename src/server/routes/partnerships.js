import express from "express";
import rateLimit from "express-rate-limit";
import nodemailer from "nodemailer";
import { Partnership } from "../models/Partnership.js";
import { requireAdmin } from "./admin.js";

const router = express.Router();

// Rate limiter for booking submissions (5 submissions per 15 minutes per IP)
const submissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "Too many requests. Please try again after 15 minutes." },
});

// HTML escaping helper to prevent XSS / HTML injection in email viewer and dashboard
function escapeHtml(unsafe) {
  if (typeof unsafe !== "string") return unsafe;
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Helper to validate email format
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// POST /api/partnerships - Public call booking submission
router.post("/", submissionLimiter, async (req, res) => {
  try {
    const { name, email, org, phone, partnershipType } = req.body;

    // Validation
    if (!name || !email || !partnershipType) {
      return res.status(400).json({ message: "Name, email, and partnership type are required." });
    }

    if (typeof name !== "string" || typeof email !== "string" || typeof partnershipType !== "string") {
      return res.status(400).json({ message: "Invalid field formats." });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email address format." });
    }

    if (name.length > 100 || email.length > 100 || partnershipType.length > 50) {
      return res.status(400).json({ message: "Input fields exceed length limits." });
    }

    if ((org && org.length > 150) || (phone && phone.length > 30)) {
      return res.status(400).json({ message: "Optional fields exceed length limits." });
    }

    // Escape HTML characters for all input strings to ensure security
    const sanitizedName = escapeHtml(name.trim());
    const sanitizedEmail = escapeHtml(email.trim());
    const sanitizedOrg = org ? escapeHtml(org.trim()) : "";
    const sanitizedPhone = phone ? escapeHtml(phone.trim()) : "";
    const sanitizedType = escapeHtml(partnershipType.trim());

    // 1. Save in MongoDB
    const partnership = await Partnership.create({
      name: sanitizedName,
      email: sanitizedEmail,
      org: sanitizedOrg,
      phone: sanitizedPhone,
      partnershipType: sanitizedType,
      callDone: false,
    });

    // 2. Dispatch Email Notification
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || smtpUser;

    if (smtpHost && smtpPort && smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: parseInt(smtpPort, 10),
          secure: parseInt(smtpPort, 10) === 465, // true for 465, false for others
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        const mailOptions = {
          from: smtpFrom,
          to: "shravan.kadam@hackthecore.in",
          subject: `New Book a Call Booking: ${sanitizedName} (${sanitizedType})`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px; background-color: #fafafa;">
              <h2 style="color: #111110; border-bottom: 2px solid #FFFF00; padding-bottom: 10px; margin-top: 0;">New Partnership / Call Booking</h2>
              <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; width: 150px; color: #555;">Name:</td>
                  <td style="padding: 8px 0; color: #111;">${sanitizedName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
                  <td style="padding: 8px 0; color: #111;"><a href="mailto:${sanitizedEmail}">${sanitizedEmail}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Organisation:</td>
                  <td style="padding: 8px 0; color: #111;">${sanitizedOrg || "—"}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Phone:</td>
                  <td style="padding: 8px 0; color: #111;">${sanitizedPhone || "—"}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Partnership Type:</td>
                  <td style="padding: 8px 0; color: #111;"><span style="background-color: #FFFF00; padding: 2px 8px; border-radius: 4px; font-size: 13px; font-weight: bold;">${sanitizedType}</span></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Submitted At:</td>
                  <td style="padding: 8px 0; color: #777;">${new Date(partnership.submittedAt).toLocaleString("en-IN")}</td>
                </tr>
              </table>
              <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 20px 0;" />
              <p style="font-size: 12px; color: #888; text-align: center; margin: 0;">This request has also been saved to MongoDB. Manage it from your Admin Dashboard.</p>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Notification email sent to shravan.kadam@hackthecore.in for submission ID: ${partnership._id}`);
      } catch (err) {
        console.error("Nodemailer SMTP email dispatch failed:", err.message);
        // Do not fail the API response even if email fails - record is stored safely in MongoDB.
      }
    } else {
      console.warn("SMTP credentials not fully set in .env. Skipping email dispatch.");
    }

    res.status(201).json({ success: true, data: partnership });
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to process call booking." });
  }
});

// GET /api/admin/partnerships - Admin only view all bookings
router.get("/admin/list", requireAdmin, async (req, res) => {
  try {
    const list = await Partnership.find().sort({ submittedAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error fetching bookings list." });
  }
});

// PATCH /api/admin/partnerships/:id/toggle-call - Admin only toggle callDone status
router.patch("/admin/:id/toggle-call", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const partnership = await Partnership.findById(id);
    if (!partnership) {
      return res.status(404).json({ message: "Booking record not found." });
    }

    partnership.callDone = !partnership.callDone;
    await partnership.save();

    res.json(partnership);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to toggle booking call status." });
  }
});

export default router;

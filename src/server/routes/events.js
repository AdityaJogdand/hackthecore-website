import express from "express";
import { Event } from "../models/Event.js";
import { requireAdmin } from "./admin.js";

const router = express.Router();

// PUBLIC — list all events (for the public Events.jsx page)
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch {
    res.status(500).json({ message: "Failed to fetch events." });
  }
});

// PUBLIC — get featured events
router.get("/featured", async (req, res) => {
  try {
    const events = await Event.find({ featured: true }).sort({ createdAt: -1 });
    res.json(events);
  } catch {
    res.status(500).json({ message: "Failed to fetch featured events." });
  }
});

// PUBLIC — get single event by id
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found." });
    res.json(event);
  } catch {
    res.status(500).json({ message: "Failed to fetch event." });
  }
});

// Whitelist allowed event fields to prevent mass assignment
function pickEventFields(body) {
  const allowed = [
    "eventType","title","banner","thumbnail","venue","city","date","time",
    "capacity","registrationDeadline","registrationLink","description","venueImages","timeline",
    "sponsors","contact","edition","themeImage","problemStatement","prizes",
    "judges","faqs","rsvpRole","featured",
  ];
  const out = {};
  for (const key of allowed) {
    if (key in body) out[key] = body[key];
  }
  return out;
}

// ADMIN ONLY — create event
router.post("/", requireAdmin, async (req, res) => {
  try {
    const event = await Event.create(pickEventFields(req.body));
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ message: err.message || "Failed to create event." });
  }
});

// ADMIN ONLY — update event
router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, pickEventFields(req.body), { new: true, runValidators: true });
    if (!event) return res.status(404).json({ message: "Event not found." });
    res.json(event);
  } catch (err) {
    res.status(400).json({ message: err.message || "Failed to update event." });
  }
});

// ADMIN ONLY — toggle featured
router.patch("/:id/featured", requireAdmin, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found." });
    event.featured = !event.featured;
    await event.save();
    res.json({ featured: event.featured });
  } catch {
    res.status(500).json({ message: "Failed to toggle featured." });
  }
});

// ADMIN ONLY — delete event
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found." });
    res.json({ success: true });
  } catch {
    res.status(500).json({ message: "Failed to delete event." });
  }
});

export default router;
import express from "express";
import { HackathonRegistration, MeetupRegistration } from "../models/Registration.js";

const router = express.Router();

// Public hackathon registration endpoint
router.post("/hackathon", async (req, res) => {
  try {
    const { eventId, teamName, track, members, idea } = req.body;

    if (!eventId || !teamName || !track || !Array.isArray(members) || members.length === 0) {
      return res.status(400).json({ message: "eventId, teamName, track, and at least one member are required." });
    }

    const registration = await HackathonRegistration.create({ eventId, teamName, track, members, idea });
    res.status(201).json(registration);
  } catch (err) {
    res.status(400).json({ message: err.message || "Failed to save registration." });
  }
});

// Public listing for all hackathon registrations
router.get("/hackathon", async (req, res) => {
  try {
    const registrations = await HackathonRegistration.find().sort({ submittedAt: -1 });
    res.json(registrations);
  } catch {
    res.status(500).json({ message: "Failed to fetch registrations." });
  }
});

// Public meetup registration endpoint
router.post("/meetup", async (req, res) => {
  try {
    const { eventId, eventTitle, name, email, phone, experience } = req.body;

    if (!eventId || !name || !email) {
      return res.status(400).json({ message: "eventId, name, and email are required." });
    }

    const registration = await MeetupRegistration.create({ eventId, eventTitle, name, email, phone, experience });
    res.status(201).json(registration);
  } catch (err) {
    res.status(400).json({ message: err.message || "Failed to save meetup registration." });
  }
});

// Public listing for all meetup registrations
router.get("/meetup", async (req, res) => {
  try {
    const registrations = await MeetupRegistration.find().sort({ submittedAt: -1 });
    res.json(registrations);
  } catch {
    res.status(500).json({ message: "Failed to fetch meetup registrations." });
  }
});

export default router;

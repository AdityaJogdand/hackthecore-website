import express from "express";
import { requireAuth } from "./auth.js";
import { requireAdmin } from "./admin.js";
import Project from "../models/Project.js";

const router = express.Router();

const HTTP_URL = /^https?:\/\/.+/;
function safeStr(val, max) {
  if (typeof val !== "string") return "";
  return val.trim().slice(0, max);
}
function safeUrl(val) {
  const s = safeStr(val, 500);
  return HTTP_URL.test(s) ? s : "";
}
function safeThumbnail(val) {
  const s = typeof val === "string" ? val.trim() : "";
  // Allow http/https URLs or data:image/ base64 strings (local uploads)
  if (HTTP_URL.test(s)) return s;
  if (s.startsWith("data:image/")) return s.slice(0, 2_000_000); // cap at ~2MB
  return "";
}

// POST /api/projects - Submit a new project (authenticated user)
router.post("/", requireAuth, async (req, res) => {
  try {
    const { title, hackathon, date, track, stack, github, demo, team, thumbnail } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ message: "Title is required." });
    }
    if (!hackathon || typeof hackathon !== "string" || !hackathon.trim()) {
      return res.status(400).json({ message: "Hackathon name is required." });
    }
    if (!Array.isArray(stack) || !Array.isArray(team)) {
      return res.status(400).json({ message: "stack and team must be arrays." });
    }
    if (stack.length > 20) {
      return res.status(400).json({ message: "stack cannot exceed 20 items." });
    }
    if (team.length > 10) {
      return res.status(400).json({ message: "team cannot exceed 10 members." });
    }

    const newProject = new Project({
      title: safeStr(title, 150),
      hackathon: safeStr(hackathon, 150),
      date: safeStr(date, 50),
      track: safeStr(track, 100),
      stack: stack.map(s => safeStr(s, 50)).filter(Boolean),
      github: safeUrl(github),
      demo: safeUrl(demo),
      team: team.map(t => safeStr(t, 100)).filter(Boolean),
      thumbnail: safeThumbnail(thumbnail),
      submittedBy: req.userId,
    });

    const savedProject = await newProject.save();
    res.status(201).json({
      message: "Project submitted successfully. Awaiting admin approval.",
      project: {
        id: savedProject._id,
        title: savedProject.title,
        status: savedProject.status,
        createdAt: savedProject.createdAt,
      },
    });
  } catch (err) {
    console.error("Project submission error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// GET /api/projects/approved - Public endpoint to get approved projects for showcase
router.get("/approved", async (req, res) => {
  try {
    const projects = await Project.find({ status: "approved" })
      .sort({ createdAt: -1 })
      .populate("submittedBy", "name avatar")
      .lean();

    res.json(projects);
  } catch (err) {
    console.error("Error fetching approved projects:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// GET /api/projects - Admin endpoint to list projects (optional filter by status)
router.get("/", requireAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};
    if (status && ["pending", "approved", "rejected"].includes(status)) {
      filter.status = status;
    }

    const projects = await Project.find(filter)
      .sort({ createdAt: -1 })
      .populate("submittedBy", "name avatar")
      .lean();

    res.json(projects);
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// PATCH /api/projects/:id/approve - Approve a project (admin only)
router.patch("/:id/approve", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Project.findByIdAndUpdate(
      id,
      {
        status: "approved",
        reviewedBy: req.admin.username, // from requireAdmin middleware
        reviewedAt: new Date(),
      },
      { new: true }
    ).populate("submittedBy", "name avatar");

    if (!updated) {
      return res.status(404).json({ message: "Project not found." });
    }

    res.json({ message: "Project approved.", project: updated });
  } catch (err) {
    console.error("Error approving project:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// PATCH /api/projects/:id/reject - Reject a project (admin only)
router.patch("/:id/reject", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Project.findByIdAndUpdate(
      id,
      {
        status: "rejected",
        reviewedBy: req.admin.username,
        reviewedAt: new Date(),
      },
      { new: true }
    ).populate("submittedBy", "name avatar");

    if (!updated) {
      return res.status(404).json({ message: "Project not found." });
    }

    res.json({ message: "Project rejected.", project: updated });
  } catch (err) {
    console.error("Error rejecting project:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// DELETE /api/projects/:id - Admin permanently deletes a project
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Project not found." });
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting project:", err);
    res.status(500).json({ message: "Server error." });
  }
});

export default router;
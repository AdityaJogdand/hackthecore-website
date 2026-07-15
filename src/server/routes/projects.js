const express = require("express");
const router = express.Router();
const { requireAuth } = require("./auth.js");
const { requireAdmin } = require("./admin.js");
const Project = require("../models/Project.js");

// POST /api/projects - Submit a new project (authenticated user)
router.post("/", requireAuth, async (req, res) => {
  try {
    const {
      title,
      hackathon,
      date,
      track,
      stack,
      github,
      demo,
      team,
      thumbnail,
    } = req.body;

    // Basic validation
    if (!title || !hackathon) {
      return res.status(400).json({ message: "Title and hackathon are required." });
    }

    const newProject = new Project({
      title: title.trim(),
      hackathon: hackathon.trim(),
      date: date ? date.trim() : "",
      track: track ? track.trim() : "",
      stack: Array.isArray(stack) ? stack.map(s => s.trim()).filter(Boolean) : [],
      github: github ? github.trim() : "",
      demo: demo ? demo.trim() : "",
      team: Array.isArray(team) ? team.map(t => t.trim()).filter(Boolean) : [],
      thumbnail: thumbnail ? thumbnail.trim() : "",
      submittedBy: req.userId, // from requireAuth middleware
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

module.exports = router;
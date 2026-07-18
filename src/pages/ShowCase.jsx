import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import {
  Calendar,
  Building2,
  Zap,
  ExternalLink,
  X,
  Search,
  Upload as UploadIcon,
} from "lucide-react";

// ── GitHub mark (lucide-react dropped brand icons, so this is inline) ──────
function GithubIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.09 3.29 9.4 7.86 10.93.57.1.79-.25.79-.55
               0-.27-.01-1.16-.02-2.11-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.69-1.28-1.69
               -1.04-.72.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.75 2.69 1.25 3.34.96
               .1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.09
               -.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0
               c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09
               0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17
               0 .3.21.66.8.55A10.52 10.52 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
    </svg>
  );
}

const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

const fmtDate = (ymd) => {
  if (!ymd) return "";
  const d = new Date(ymd + "T00:00:00");
  return isNaN(d) ? ymd : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

const emptyForm = {
  title: "",
  hackathon: "",
  date: "",
  track: "",
  stack: "",
  github: "",
  demo: "",
  team: "",
  thumbnail: "",
};

// ── Small building blocks ───────────────────────────────────────────────────

function Avatar({ name }) {
  const initials = name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      title={name}
      className="h-8 w-8 rounded-full bg-black text-white text-[11px] font-bold
                 flex items-center justify-center ring-2 ring-white -ml-2 first:ml-0
                 select-none"
    >
      {initials}
    </div>
  );
}

function Chip({ children }) {
  return (
    <span
      className="font-mono text-[11px] leading-none px-2 py-1 rounded-md
                 border border-black/10 bg-neutral-50 text-neutral-700"
    >
      {children}
    </span>
  );
}

// `reveal-card` is the hook GSAP uses to batch-animate these on scroll —
// see the ScrollTrigger effect in ShowCase() below.
function ProjectCard({ project }) {
  const extraStack = Math.max(0, project.stack.length - 4);

  return (
    <article
      className="reveal-card group relative bg-white rounded-[28px] border border-black/5
                 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-xl
                 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
    >
      {/* Thumbnail */}
      <div className="relative h-44 w-full overflow-hidden rounded-t-[28px] bg-neutral-200">
        <img
          src={project.thumbnail}
          alt={project.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
      </div>

      {/* Floating date pill, overlapping the image/body seam */}
      <div
        className="absolute left-5 -translate-y-1/2 top-44 bg-white rounded-full
                   shadow-md border border-black/5 px-3.5 py-1.5 flex items-center gap-1.5"
      >
        <Calendar className="h-3.5 w-3.5 text-black" strokeWidth={2.5} />
        <span className="text-xs font-bold text-black">{project.date}</span>
      </div>

      {/* Body */}
      <div className="pt-7 px-5 pb-5">
        <h3 className="text-lg font-black text-black leading-snug line-clamp-2">
          {project.title}
        </h3>

        <div className="mt-3 space-y-1.5">
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <Building2 className="h-4 w-4 shrink-0" />
            <span className="truncate">{project.hackathon}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <Zap className="h-4 w-4 shrink-0" />
            <span className="truncate">{project.track}</span>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.stack.slice(0, 4).map((tech) => (
            <Chip key={tech}>{tech}</Chip>
          ))}
          {extraStack > 0 && <Chip>+{extraStack}</Chip>}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex">
            {project.team.slice(0, 4).map((name) => (
              <Avatar key={name} name={name} />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className="h-8 w-8 rounded-full border border-black/10 flex items-center
                           justify-center text-black hover:bg-black hover:text-white transition-colors"
                aria-label="View repository"
              >
                <GithubIcon className="h-4 w-4" />
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noreferrer"
                className="h-8 w-8 rounded-full border border-black/10 flex items-center
                           justify-center text-black hover:bg-black hover:text-white transition-colors"
                aria-label="View live demo"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

// Modal is always mounted; AnimatePresence controls enter/exit so the
// overlay and panel animate out instead of just vanishing.
function UploadModal({ open, onClose, onSubmit, userName }) {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, thumbnail: reader.result }));
    reader.readAsDataURL(file);
  };

  // Pre-fill team with logged-in user's name
  useEffect(() => {
    if (open && userName) {
      setForm((f) => ({ ...f, team: f.team || userName }));
    }
  }, [open, userName]);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.hackathon) return;
    setSubmitting(true);

    const normalizeUrl = (url) => {
      if (!url || url.startsWith("data:")) return url;
      return /^https?:\/\//i.test(url) ? url : `https://${url}`;
    };

    await onSubmit({
      title: form.title,
      hackathon: form.hackathon,
      date: fmtDate(form.date) || "Undated",
      track: form.track || "General",
      stack: form.stack.split(",").map((s) => s.trim()).filter(Boolean),
      github: normalizeUrl(form.github),
      demo: normalizeUrl(form.demo),
      team: form.team.split(",").map((s) => s.trim()).filter(Boolean),
      thumbnail: normalizeUrl(form.thumbnail),
    });

    setSubmitting(false);
    setForm(emptyForm);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.form
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onSubmit={handleSubmit}
            className="relative w-full max-w-lg bg-white rounded-[28px] shadow-2xl
                       flex flex-col max-h-[92vh]"
          >
            <div className="shrink-0 bg-white flex items-center justify-between px-6 py-5 border-b border-black/5 rounded-t-[28px]">
              <h2 className="text-xl font-black text-black">Upload your build</h2>
              <button
                type="button"
                onClick={onClose}
                className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-neutral-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div data-lenis-prevent className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              <label className="block">
                <span className="text-sm font-bold text-black">Project title *</span>
                <input
                  required
                  value={form.title}
                  onChange={update("title")}
                  placeholder="PulseBoard — Live Ops Dashboard"
                  className="mt-1.5 w-full rounded-xl border border-black/10 px-3.5 py-2.5
                             text-sm outline-none focus:border-black transition-colors"
                />
              </label>

              <div>
                <span className="text-sm font-bold text-black">Banner / Thumbnail</span>
                <div className="mt-1.5 flex gap-2">
                  <input
                    value={form.thumbnail.startsWith("data:") ? "" : form.thumbnail}
                    onChange={update("thumbnail")}
                    placeholder="https://images.unsplash.com/…"
                    className="flex-1 rounded-xl border border-black/10 px-3.5 py-2.5
                               text-sm outline-none focus:border-black transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="shrink-0 h-10 w-10 rounded-xl border border-black/10 flex items-center
                               justify-center hover:bg-neutral-100 transition-colors"
                    title="Upload from device"
                  >
                    <UploadIcon className="h-4 w-4 text-neutral-500" />
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
                </div>
                {form.thumbnail && (
                  <img
                    src={form.thumbnail}
                    alt="Preview"
                    className="mt-2 h-28 w-full object-cover rounded-xl border border-black/10"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-sm font-bold text-black">Hackathon *</span>
                  <input
                    required
                    value={form.hackathon}
                    onChange={update("hackathon")}
                    placeholder="HackUp 2026"
                    className="mt-1.5 w-full rounded-xl border border-black/10 px-3.5 py-2.5
                               text-sm outline-none focus:border-black transition-colors"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-bold text-black">Date</span>
                  <input
                    type="date"
                    value={form.date}
                    onChange={update("date")}
                    className="mt-1.5 w-full rounded-xl border border-black/10 px-3.5 py-2.5
                               text-sm outline-none focus:border-black transition-colors"
                    style={{ colorScheme: "light" }}
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-bold text-black">Track / category</span>
                <input
                  value={form.track}
                  onChange={update("track")}
                  placeholder="AI / ML, Developer Tools, Fintech…"
                  className="mt-1.5 w-full rounded-xl border border-black/10 px-3.5 py-2.5
                             text-sm outline-none focus:border-black transition-colors"
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-black">Tech stack</span>
                <input
                  value={form.stack}
                  onChange={update("stack")}
                  placeholder="React, Node, PostgreSQL"
                  className="mt-1.5 w-full rounded-xl border border-black/10 px-3.5 py-2.5
                             text-sm outline-none focus:border-black transition-colors"
                />
                <span className="text-xs text-neutral-500">Comma separated</span>
              </label>

              <label className="block">
                <span className="text-sm font-bold text-black">Team members</span>
                <input
                  value={form.team}
                  onChange={update("team")}
                  placeholder="Aarav, Diya, Kabir"
                  className="mt-1.5 w-full rounded-xl border border-black/10 px-3.5 py-2.5
                             text-sm outline-none focus:border-black transition-colors"
                />
                <span className="text-xs text-neutral-500">Comma separated</span>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-sm font-bold text-black">GitHub link</span>
                  <input
                    value={form.github}
                    onChange={update("github")}
                    placeholder="https://github.com/…"
                    className="mt-1.5 w-full rounded-xl border border-black/10 px-3.5 py-2.5
                               text-sm outline-none focus:border-black transition-colors"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-bold text-black">Live demo link</span>
                  <input
                    value={form.demo}
                    onChange={update("demo")}
                    placeholder="https://…"
                    className="mt-1.5 w-full rounded-xl border border-black/10 px-3.5 py-2.5
                               text-sm outline-none focus:border-black transition-colors"
                  />
                </label>
              </div>

            </div>

            <div className="shrink-0 bg-white px-6 py-5 border-t border-black/5 rounded-b-[28px]">
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full bg-black text-white font-bold py-3
                           hover:bg-neutral-800 transition-colors disabled:opacity-50"
              >
                {submitting ? "Submitting…" : "Submit for review"}
              </button>
            </div>
          </motion.form>
        </div>
      )}
    </AnimatePresence>
  );
}

export default function ShowCase() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const gridRef = useRef(null);

  // Fetch approved projects from API
  useEffect(() => {
    fetch(`${API_BASE}/projects/approved`)
      .then((r) => r.json())
      .then((data) => setProjects(Array.isArray(data) ? data : []))
      .catch(() => setProjects([]))
      .finally(() => setLoadingProjects(false));
  }, []);

  const filtered = useMemo(
    () =>
      query.trim() === ""
        ? projects
        : projects.filter(
            (p) =>
              p.title.toLowerCase().includes(query.toLowerCase()) ||
              p.hackathon.toLowerCase().includes(query.toLowerCase())
          ),
    [projects, query]
  );

  const [loginPrompt, setLoginPrompt] = useState(false);

  const handleUploadClick = () => {
    if (!user) {
      setLoginPrompt(true);
      return;
    }
    setModalOpen(true);
  };

  const handleProjectSubmit = async (projectData) => {
    try {
      const res = await fetch(`${API_BASE}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(projectData),
      });
      if (!res.ok) {
        const d = await res.json();
        alert(d.message || "Submission failed.");
        return;
      }
      alert("Project submitted! It will appear after admin approval.");
    } catch {
      alert("Could not reach server. Try again.");
    }
  };


  return (
    <div className="min-h-screen bg-white">
      {/* ── Page Header ── */}
      <section className="px-6 md:px-12 py-8 border-b border-black/5" style={{ marginTop: "100px" }}>
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-black uppercase">
              Project <span style={{ color: "#1DCA23" }}>Showcase</span>
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              Built at hackathons. Shown off forever.
            </p>
          </div>
          <button
            onClick={handleUploadClick}
            className="inline-flex items-center gap-2 rounded-full font-bold px-6 py-3 transition-colors border-2 bg-transparent text-black hover:bg-black/5 w-full sm:w-auto justify-center"
            style={{ borderColor: "#52B816" }}
          >
            <UploadIcon className="h-4 w-4" />
            Upload your build
          </button>
        </div>
      </section>

      {/* ── Search ── */}
      <section className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-black/5 px-6 md:px-12 py-4">
        <div className="mx-auto max-w-6xl">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects or hackathons"
              className="w-full rounded-full border border-black/10 pl-9 pr-4 py-2.5
                         text-sm outline-none focus:border-black transition-colors"
            />
          </div>
        </div>
      </section>

      {/* ── Grid ── */}
      <section ref={gridRef} className="px-6 md:px-12 py-10">
        <div className="mx-auto max-w-6xl">
          {loadingProjects ? (
            <div className="py-20 text-center text-neutral-400 text-sm">Loading projects…</div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center text-neutral-500">
              <p className="font-bold text-black text-lg">No projects here yet</p>
              <p className="mt-1 text-sm">Be the first to submit your build.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((project) => (
                <ProjectCard key={project._id || project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>

      <UploadModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleProjectSubmit}
        userName={user?.name}
      />

      {/* ── Login prompt ── */}
      <AnimatePresence>
        {loginPrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setLoginPrompt(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative bg-white rounded-[24px] shadow-2xl p-8 max-w-sm w-full text-center"
            >
              <button
                onClick={() => setLoginPrompt(false)}
                className="absolute top-4 right-4 h-8 w-8 rounded-full flex items-center justify-center hover:bg-neutral-100"
              >
                <X className="h-4 w-4 text-neutral-500" />
              </button>

              <div className="h-14 w-14 rounded-full bg-black flex items-center justify-center mx-auto mb-4">
                <UploadIcon className="h-6 w-6 text-white" />
              </div>

              <h2 className="text-xl font-black text-black">Sign in to upload</h2>
              <p className="mt-2 text-sm text-neutral-500">
                You need an account to submit your project to the showcase.
              </p>

              <div className="mt-6 flex flex-col gap-3">
                <button
                  onClick={() => navigate("/login")}
                  className="w-full rounded-full bg-black text-white font-bold py-3 hover:bg-neutral-800 transition-colors"
                >
                  Log in
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="w-full rounded-full border border-black/15 text-black font-bold py-3 hover:bg-neutral-50 transition-colors"
                >
                  Create account
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
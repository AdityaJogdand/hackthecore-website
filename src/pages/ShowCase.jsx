"use client";

import { useState, useMemo, useRef, useEffect, useLayoutEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import {
  Calendar,
  Building2,
  Zap,
  ExternalLink,
  Plus,
  X,
  Search,
  Upload as UploadIcon,
} from "lucide-react";

// ── Swap this path for your actual hero background ─────────────────────────
import blob from "@/assets/websiteback.png";

gsap.registerPlugin(ScrollTrigger);

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

// ── Seed data so the page isn't empty on first load ────────────────────────
const seedProjects = [
  {
    id: "seed-1",
    title: "PulseBoard — Live Ops Dashboard",
    hackathon: "HackUp 2026",
    date: "3–4 Apr 2026",
    track: "Developer Tools",
    stack: ["React", "Node", "WebSocket", "PostgreSQL"],
    github: "https://github.com",
    demo: "https://example.com",
    team: ["Aarav", "Diya", "Kabir"],
    thumbnail: "https://picsum.photos/seed/pulseboard/640/420",
  },
  {
    id: "seed-2",
    title: "Reflex — Offline-First Notes",
    hackathon: "Hackthecore",
    date: "18–19 May 2026",
    track: "Productivity",
    stack: ["Svelte", "IndexedDB", "CRDT"],
    github: "https://github.com",
    demo: "https://example.com",
    team: ["Meera", "Yusuf"],
    thumbnail: "https://picsum.photos/seed/reflex/640/420",
  },
  {
    id: "seed-3",
    title: "Terra — Crop Health from Satellite",
    hackathon: "HackUp 2026",
    date: "3–4 Apr 2026",
    track: "AI / ML",
    stack: ["Python", "PyTorch", "FastAPI"],
    github: "https://github.com",
    demo: "https://example.com",
    team: ["Ishaan", "Priya", "Rohan", "Sana"],
    thumbnail: "https://picsum.photos/seed/terra/640/420",
  },
];

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
function UploadModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyForm);
  const fileRef = useRef(null);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file) setForm((f) => ({ ...f, thumbnail: URL.createObjectURL(file) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.hackathon) return;

    onSubmit({
      id: `p-${Date.now()}`,
      title: form.title,
      hackathon: form.hackathon,
      date: form.date || "Undated",
      track: form.track || "General",
      stack: form.stack
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      github: form.github,
      demo: form.demo,
      team: form.team
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean) || ["You"],
      thumbnail: form.thumbnail || "https://picsum.photos/640/420",
    });

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
                       max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-5 border-b border-black/5">
              <h2 className="text-xl font-black text-black">Upload your build</h2>
              <button
                type="button"
                onClick={onClose}
                className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-neutral-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
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
                    value={form.date}
                    onChange={update("date")}
                    placeholder="3–4 Apr 2026"
                    className="mt-1.5 w-full rounded-xl border border-black/10 px-3.5 py-2.5
                               text-sm outline-none focus:border-black transition-colors"
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

              <div>
                <span className="text-sm font-bold text-black">Thumbnail</span>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="mt-1.5 w-full rounded-xl border-2 border-dashed border-black/15
                             px-3.5 py-6 flex flex-col items-center gap-2 text-neutral-500
                             hover:border-black/30 transition-colors"
                >
                  {form.thumbnail ? (
                    <img
                      src={form.thumbnail}
                      alt="Preview"
                      className="h-24 w-full object-cover rounded-lg"
                    />
                  ) : (
                    <>
                      <UploadIcon className="h-5 w-5" />
                      <span className="text-xs">Click to choose an image</span>
                    </>
                  )}
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  className="hidden"
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-white px-6 py-5 border-t border-black/5">
              <button
                type="submit"
                className="w-full rounded-full bg-black text-white font-bold py-3
                           hover:bg-neutral-800 transition-colors"
              >
                Publish project
              </button>
            </div>
          </motion.form>
        </div>
      )}
    </AnimatePresence>
  );
}

// Framer variants for the hero's staggered entrance on mount.
const heroContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const heroItem = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function ShowCase() {
  const [projects, setProjects] = useState(seedProjects);
  const [modalOpen, setModalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeTrack, setActiveTrack] = useState("All");
  const gridRef = useRef(null);

  const tracks = useMemo(
    () => ["All", ...new Set(projects.map((p) => p.track))],
    [projects]
  );

  const filtered = useMemo(
    () =>
      projects.filter((p) => {
        const matchesTrack = activeTrack === "All" || p.track === activeTrack;
        const matchesQuery =
          query.trim() === "" ||
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.hackathon.toLowerCase().includes(query.toLowerCase());
        return matchesTrack && matchesQuery;
      }),
    [projects, query, activeTrack]
  );

  // ── Lenis smooth scroll, wired into GSAP's ticker so ScrollTrigger and
  //    Lenis agree on scroll position every frame. ─────────────────────────
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);


  // ── Header background fades in from transparent to solid as you scroll
  //    past the hero, driven by Framer Motion's scroll value. ────────────
  const { scrollY } = useScroll();
  const headerBg = useTransform(
    scrollY,
    [0, 160],
    ["rgba(255,255,255,0)", "rgba(255,255,255,0.92)"]
  );
  const headerBorder = useTransform(
    scrollY,
    [0, 160],
    ["rgba(0,0,0,0)", "rgba(0,0,0,0.06)"]
  );

  return (
    <div className="min-h-screen bg-white">
      {/* ── Top bar ── */}
      <motion.header
        style={{ backgroundColor: headerBg, borderColor: headerBorder }}
        className="fixed top-0 inset-x-0 z-40 flex items-center justify-end
                   px-6 md:px-12 py-5 border-b backdrop-blur-md"
      >
      </motion.header>

      {/* ── Hero ── */}
      <section
        className="relative h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{ backgroundImage: `url(${blob})` }}
      >
        <motion.div
          variants={heroContainer}
          initial="hidden"
          animate="show"
          className="relative px-6 max-w-3xl text-center"
        >
          

          <motion.h1
            variants={heroItem}
            className="mt-5 text-4xl md:text-6xl font-black tracking-tight text-black uppercase"
          >
            Built in one weekend.
            <br />
            Shown off forever.
          </motion.h1>

          <motion.p
            variants={heroItem}
            className="mt-4 text-base md:text-lg text-black/80 max-w-xl mx-auto"
          >
            Every hack has a story — the all-nighters, the last-minute pivots,
            the demo that barely worked. This is where those stories live.
          </motion.p>

          <motion.button
            variants={heroItem}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setModalOpen(true)}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white text-black
                       font-bold px-7 py-3.5 hover:bg-neutral-100 transition-colors"
          >
            <UploadIcon className="h-4 w-4" />
            Upload your build
          </motion.button>
        </motion.div>
      </section>

      {/* ── Filters ── */}
      <section className="sticky top-[73px] z-10 bg-white/90 backdrop-blur border-b border-black/5 px-6 md:px-12 py-4">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects or hackathons"
              className="w-full rounded-full border border-black/10 pl-9 pr-4 py-2.5
                         text-sm outline-none focus:border-black transition-colors"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {tracks.map((track) => (
              <button
                key={track}
                onClick={() => setActiveTrack(track)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold border transition-colors ${
                  activeTrack === track
                    ? "bg-black text-white border-black"
                    : "border-black/10 text-neutral-600 hover:border-black/30"
                }`}
              >
                {track}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Grid ── */}
      <section ref={gridRef} className="px-6 md:px-12 py-10">
        <div className="mx-auto max-w-6xl">
          {filtered.length === 0 ? (
            <div className="py-20 text-center text-neutral-500">
              <p className="font-bold text-black text-lg">No projects match yet</p>
              <p className="mt-1 text-sm">Try a different search or track.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>

      <UploadModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={(project) => setProjects((prev) => [project, ...prev])}
      />
    </div>
  );
}
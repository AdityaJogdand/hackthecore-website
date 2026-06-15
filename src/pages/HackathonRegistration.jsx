import { useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import GlassCard from "../components/GlassCard";
/* ─── Font constants ─── */
const HEADER_FONT = "'SansPlomb', sans-serif";
const BODY_FONT = "'Inter', 'Manrope', 'SF Pro Display', sans-serif";

const ease = [0.22, 1, 0.36, 1];

const event = {
  title: "48H Hackathon",
  edition: "HTC × BuildFast",
  banner: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2400&fit=crop",
  venue: "NSRCEL, IIM Bangalore",
  city: "Bengaluru",
  date: "Sat–Sun, Aug 2–3 2025",
  time: "Starts 10:00 AM IST",
  capacity: "300 hackers · 60 teams",
  registrationDeadline: "Jul 25 2025",
  description: `48 hours. One problem statement. Infinite solutions.

HTC × BuildFast brings together developers, designers, and product thinkers to build solutions that matter. You'll get access to mentors from top startups, a war chest of APIs and credits, and an audience of investors watching the finals.

This isn't a classroom exercise. Build something real, ship it, defend it.`,
  problemStatement: {
    theme: "Infra for the Next Billion",
    overview: `How do you build for people who are coming online for the very first time? Slow connections, low-end hardware, unfamiliar interfaces. The problem isn't lack of ideas — it's lack of infrastructure built for the edges.

Your challenge is to pick one real friction point in this journey and engineer a working solution. It should run, scale, and make sense to someone who's never used an app before.`,
    tracks: [
      { name: "FinTech", desc: "Micro-payments, credit access, savings for first-time users." },
      { name: "HealthTech", desc: "Low-bandwidth diagnostics, telemedicine, rural health records." },
      { name: "EdTech", desc: "Offline-first learning, local language support, skilling tools." },
      { name: "Open Track", desc: "Any problem within the theme. Make it count." },
    ],
  },
  timeline: [
    { time: "Sat 10:00 AM", label: "Check-in & team formation" },
    { time: "Sat 11:30 AM", label: "Opening keynote & problem reveal" },
    { time: "Sat 12:00 PM", label: "Hacking begins" },
    { time: "Sat 8:00 PM", label: "Mentor sessions (round 1)" },
    { time: "Sun 2:00 AM", label: "Midnight check-in (optional)" },
    { time: "Sun 10:00 AM", label: "Mentor sessions (round 2)" },
    { time: "Sun 12:00 PM", label: "Submissions close" },
    { time: "Sun 2:00 PM", label: "Finalist pitches (top 8 teams)" },
    { time: "Sun 5:00 PM", label: "Award ceremony & closing" },
  ],
  prizes: [
    { place: "01", label: "Grand Prize", amount: "₹1,50,000", perks: ["Fast-track interviews · 3 partner companies", "6-month incubation seat", "AWS credits ₹5L"] },
    { place: "02", label: "Runner-up", amount: "₹75,000", perks: ["Mentorship · 2 senior founders", "GCP credits ₹2L"] },
    { place: "03", label: "Second Runner-up", amount: "₹30,000", perks: ["Product subscription bundle ₹80K"] },
    { place: "✦", label: "Best UI/UX", amount: "₹15,000", perks: ["Figma Pro · 1 year for team"] },
    { place: "✦", label: "Best Social Impact", amount: "₹15,000", perks: ["NGO spotlight + media coverage"] },
  ],
  contact: {
    email: "hackathon@hackthecore.dev",
    twitter: "@hackthecore",
    discord: "discord.gg/htc",
    whatsapp: "Organizer group link sent on registration",
  },
};

/* ─── Field components ─── */
const fieldBase = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.09)",
  borderRadius: 10,
  padding: "13px 16px",
  fontFamily: BODY_FONT,
  fontSize: 17,
  fontWeight: 400,
  color: "#fff",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

const Field = ({ label, required, children }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
    <label style={{ fontFamily: BODY_FONT, fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>
      {label}{required && <span style={{ color: "#FFFF00", marginLeft: 3 }}>*</span>}
    </label>
    {children}
  </div>
);

const Input = ({ label, placeholder, type = "text", value, onChange, required }) => (
  <Field label={label} required={required}>
    <input
      type={type} placeholder={placeholder} value={value} onChange={onChange} required={required}
      style={{ ...fieldBase, background: "rgba(255,255,255,0.03)" }}
      onFocus={e => e.target.style.borderColor = "rgba(255,255,0,0.45)"}
      onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.09)"}
    />
  </Field>
);

const Select = ({ label, value, onChange, options, required }) => (
  <Field label={label} required={required}>
    <select
      value={value} onChange={onChange} required={required}
      style={{ ...fieldBase, background: "#111112", appearance: "none", cursor: "pointer", color: value ? "#fff" : "rgba(255,255,255,0.3)" }}
    >
      <option value="" disabled>Select…</option>
      {options.map(o => <option key={o} value={o} style={{ background: "#111112" }}>{o}</option>)}
    </select>
  </Field>
);

const emptyMember = () => ({ name: "", email: "", role: "", github: "" });

/* ─── Label divider ─── */
const SectionLabel = ({ children }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 36 }}>
    <span style={{
      fontFamily: BODY_FONT,
      fontSize: 12, fontWeight: 700, letterSpacing: "0.22em",
      textTransform: "uppercase", color: "rgba(255,255,255,0.25)", whiteSpace: "nowrap"
    }}>{children}</span>
    <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
  </div>
);

export default function HackathonRegistration() {
  const [teamName, setTeamName] = useState("");
  const [track, setTrack] = useState("");
  const [members, setMembers] = useState([emptyMember(), emptyMember()]);
  const [idea, setIdea] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const bannerRef = useRef(null);
  const { scrollYProgress: bannerProgress } = useScroll({ target: bannerRef, offset: ["start start", "end start"] });
  const bannerY = useTransform(bannerProgress, [0, 1], ["0%", "25%"]);
  const bannerOpacity = useTransform(bannerProgress, [0, 0.7], [1, 0]);

  const addMember = () => { if (members.length < 4) setMembers(m => [...m, emptyMember()]); };
  const removeMember = (i) => { if (members.length > 1) setMembers(m => m.filter((_, idx) => idx !== i)); };
  const setMember = (i, k) => (e) => setMembers(m => m.map((mb, idx) => idx === i ? { ...mb, [k]: e.target.value } : mb));
  const handleSubmit = (e) => { e.preventDefault(); setSubmitted(true); };

  return (
    <div style={{ background: "#0C0C0D", minHeight: "100vh", color: "#fff" }}>
      <Navbar />

      {/* ═══ HERO ═══ */}
      <div ref={bannerRef} style={{ position: "relative", height: "100vh", minHeight: 560, overflow: "hidden" }}>
        <motion.img
          src={event.banner} alt=""
          style={{ position: "absolute", inset: 0, width: "100%", height: "120%", objectFit: "cover", objectPosition: "center 40%", y: bannerY }}
        />
        {/* deep overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, rgba(12,12,13,0.55) 0%, rgba(12,12,13,0.85) 60%, #0C0C0D 100%)" }} />

        <motion.div
          style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 6vw 80px", opacity: bannerOpacity }}
        >
          {/* pill badge */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontFamily: BODY_FONT, fontSize: 10, fontWeight: 700,
              letterSpacing: "0.2em", textTransform: "uppercase",
              color: "#FFFF00", border: "1px solid rgba(255,255,0,0.3)",
              borderRadius: 99, padding: "6px 16px", marginBottom: 28
            }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#FFFF00", display: "inline-block", animation: "pulse 2s infinite" }} />
              Registration open · Deadline {event.registrationDeadline}
            </span>
          </motion.div>

          {/* main title */}
          <motion.h1
            initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease }}
            style={{
              fontFamily: HEADER_FONT,
              fontWeight: 900, fontSize: "clamp(3.5rem, 11vw, 9rem)",
              letterSpacing: "-0.04em", lineHeight: 0.88,
              textTransform: "uppercase", color: "#fff", margin: "0 0 20px",
            }}
          >
            {event.title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease }}
            style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px 0" }}
          >
            <span style={{ fontFamily: BODY_FONT, fontWeight: 700, fontSize: "clamp(1rem, 2.5vw, 1.6rem)", color: "#FFFF00", letterSpacing: "0.02em", marginRight: 24 }}>
              {event.edition}
            </span>
            {[event.venue + ", " + event.city, event.date, event.capacity].map((t, i) => (
              <span key={i} style={{ fontFamily: BODY_FONT, fontSize: 15, color: "rgba(255,255,255,0.5)", marginRight: 24, letterSpacing: "0.01em" }}>
                {i > 0 && <span style={{ marginRight: 24, color: "rgba(255,255,255,0.2)" }}>·</span>}
                {t}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* scroll hint */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.6 }}
          style={{ position: "absolute", bottom: 28, right: "6vw", display: "flex", alignItems: "center", gap: 10 }}
        >
          <span style={{ fontFamily: BODY_FONT, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)" }}>Scroll</span>
          <div style={{ width: 20, height: 32, border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "5px 0" }}>
            <motion.div style={{ width: 3, height: 6, background: "rgba(255,255,255,0.3)", borderRadius: 99 }} animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} />
          </div>
        </motion.div>
      </div>

      {/* ═══ BODY ═══ */}
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "100px 6vw 0" }}>

        {/* ── About ── */}
        <Reveal>
          <section style={{ marginBottom: 100 }}>
            <SectionLabel>About the hackathon</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 80px" }}>
              <div>
                {event.description.split("\n\n").map((p, i) => (
                  <p key={i} style={{ fontFamily: BODY_FONT, fontSize: 18, fontWeight: 400, lineHeight: 1.8, color: "rgba(255,255,255,0.55)", marginBottom: 18 }}>{p}</p>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { label: "Date", value: event.date },
                  { label: "Venue", value: `${event.venue}, ${event.city}` },
                  { label: "Format", value: "In-person · Teams of 1–4" },
                  { label: "Capacity", value: event.capacity },
                  { label: "Entry fee", value: "Free" },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <span style={{ fontFamily: BODY_FONT, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>{label}</span>
                    <span style={{ fontFamily: BODY_FONT, fontSize: 17, fontWeight: 400, color: "rgba(255,255,255,0.75)", textAlign: "right", maxWidth: "60%" }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        {/* ── Image break ── */}
        <Reveal>
          <div style={{ marginBottom: 100, borderRadius: 20, overflow: "hidden", position: "relative", height: 380 }}>
            <img
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2000&fit=crop"
              alt="Hackers working"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 60%" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(12,12,13,0.7) 0%, transparent 60%)" }} />
            <div style={{ position: "absolute", bottom: 36, left: 40 }}>
              <p style={{ fontFamily: BODY_FONT, fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,0,0.7)", marginBottom: 8 }}>Theme</p>
              <h2 style={{ fontFamily: BODY_FONT, fontWeight: 900, fontSize: "clamp(1.8rem,4vw,3rem)", textTransform: "uppercase", letterSpacing: "-0.03em", color: "#fff", lineHeight: 1 }}>
                Infra for the<br /><span style={{ color: "#FFFF00" }}>Next Billion</span>
              </h2>
            </div>
          </div>
        </Reveal>

        {/* ── Problem Statement ── */}
        <Reveal>
          <section style={{ marginBottom: 100 }}>
            <SectionLabel>Problem statement</SectionLabel>
            <p style={{ fontFamily: BODY_FONT, fontSize: 18, fontWeight: 400, lineHeight: 1.8, color: "rgba(255,255,255,0.55)", maxWidth: 680, marginBottom: 48 }}>
              {event.problemStatement.overview.split("\n\n")[0]}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {event.problemStatement.tracks.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08, ease }}
                  whileHover={{ borderColor: "rgba(255,255,0,0.2)" }}
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "24px 22px", cursor: "default", transition: "border-color 0.25s" }}
                >
                  <span style={{ fontSize: 24, display: "block", marginBottom: 12 }}>{t.icon}</span>
                  <p style={{ fontFamily: BODY_FONT, fontWeight: 800, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.08em", color: "#fff", marginBottom: 8 }}>{t.name}</p>
                  <p style={{ fontFamily: BODY_FONT, fontSize: 16, fontWeight: 400, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>{t.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* ── Timeline ── */}
        <Reveal>
          <section style={{ marginBottom: 100 }}>
            <SectionLabel>Schedule</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 80px" }}>
              {[event.timeline.slice(0, Math.ceil(event.timeline.length / 2)), event.timeline.slice(Math.ceil(event.timeline.length / 2))].map((col, ci) => (
                <div key={ci}>
                  {col.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: (ci * col.length + i) * 0.05, ease }}
                      style={{ display: "flex", gap: 20, alignItems: "flex-start", paddingBottom: 24, position: "relative" }}
                    >
                      {i < col.length - 1 && (
                        <div style={{ position: "absolute", left: 76, top: 22, bottom: 0, width: 1, background: "rgba(255,255,255,0.06)" }} />
                      )}
                      <span style={{ fontFamily: BODY_FONT, fontSize: 13, fontWeight: 700, color: "#FFFF00", minWidth: 76, paddingTop: 4, letterSpacing: "0.04em" }}>{item.time}</span>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.25)", marginTop: 5, flexShrink: 0 }} />
                      <span style={{ fontFamily: BODY_FONT, fontSize: 16, fontWeight: 400, color: "rgba(255,255,255,0.6)", paddingTop: 1, lineHeight: 1.5 }}>{item.label}</span>
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* ── Prizes ── */}
        {/* ── Prizes ── */}
<Reveal>
  <section style={{ marginBottom: 100 }}>
    <SectionLabel>Prizes & awards</SectionLabel>
    <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
      {event.prizes.slice(0, 3).map((prize, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.07, ease }}
        >
          <GlassCard
            title={prize.label}
            subtitle={prize.perks.join(" · ")}
            amount={prize.amount}
            tags={[`#${prize.place === "01" ? "1st" : prize.place === "02" ? "2nd" : "3rd"}`]}
          />
        </motion.div>
      ))}
    </div>
  </section>
</Reveal>

        {/* ── Venue ── */}
        <Reveal>
          <section style={{ marginBottom: 100 }}>
            <SectionLabel>Venue</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, borderRadius: 20, overflow: "hidden" }}>
              <img
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1400&fit=crop"
                alt="Venue"
                style={{ width: "100%", height: 280, objectFit: "cover", borderRadius: 16 }}
              />
              <img
                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1400&fit=crop"
                alt="Tech"
                style={{ width: "100%", height: 280, objectFit: "cover", borderRadius: 16 }}
              />
            </div>
          </section>
        </Reveal>

        {/* ── Contact ── */}
        <Reveal>
          <section style={{ marginBottom: 120 }}>
            <SectionLabel>Contact & community</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
              {Object.entries(event.contact).map(([k, v]) => (
                <div key={k} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "20px 18px" }}>
                  <p style={{ fontFamily: BODY_FONT, fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 10 }}>{k}</p>
                  <p style={{ fontFamily: BODY_FONT, fontSize: 15, fontWeight: 400, color: "#FFFF00", lineHeight: 1.5, wordBreak: "break-all" }}>{v}</p>
                </div>
              ))}
            </div>
          </section>
        </Reveal>
      </div>

      {/* ═══ REGISTRATION ═══ */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "#0C0C0D" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "100px 6vw 120px" }}>
          {/* heading */}
          <div style={{ marginBottom: 60 }}>
            <p style={{ fontFamily: BODY_FONT, fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 12 }}>
              Free · Deadline {event.registrationDeadline}
            </p>
            <h2 style={{ fontFamily: BODY_FONT, fontWeight: 900, fontSize: "clamp(2rem, 5vw, 4.5rem)", textTransform: "uppercase", letterSpacing: "-0.04em", lineHeight: 0.9, color: "#fff", margin: 0 }}>
              Register<br /><span style={{ color: "#FFFF00" }}>your team</span>
            </h2>
          </div>

          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5, ease }}
                onSubmit={handleSubmit}
              >
                {/* Row 1: team name + track */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                  <Input label="Team name" placeholder="e.g. Null Pointers" value={teamName} onChange={e => setTeamName(e.target.value)} required />
                  <Select label="Track" value={track} onChange={e => setTrack(e.target.value)} required
                    options={["FinTech", "HealthTech", "EdTech", "Open Track"]} />
                </div>

                {/* Members */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <span style={{ fontFamily: BODY_FONT, fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
                      Team members ({members.length}/4)
                    </span>
                    {members.length < 4 && (
                      <button type="button" onClick={addMember} style={{ fontFamily: BODY_FONT, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#FFFF00", background: "none", border: "1px solid rgba(255,255,0,0.25)", borderRadius: 6, padding: "5px 12px", cursor: "pointer" }}>
                        + Add member
                      </button>
                    )}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
                    {members.map((member, i) => (
                      <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "18px 18px 16px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                          <span style={{ fontFamily: BODY_FONT, fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,0,0.45)" }}>
                            {i === 0 ? "Team Lead" : `Member ${i + 1}`}
                          </span>
                          {i > 0 && (
                            <button type="button" onClick={() => removeMember(i)} style={{ fontFamily: BODY_FONT, fontSize: 11, fontWeight: 400, color: "rgba(255,255,255,0.2)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                              Remove
                            </button>
                          )}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          <input placeholder="Full name *" value={member.name} onChange={setMember(i, "name")} required
                            style={{ ...fieldBase, fontSize: 14 }}
                            onFocus={e => e.target.style.borderColor = "rgba(255,255,0,0.4)"}
                            onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.09)"} />
                          <input placeholder="Email *" type="email" value={member.email} onChange={setMember(i, "email")} required
                            style={{ ...fieldBase, fontSize: 14 }}
                            onFocus={e => e.target.style.borderColor = "rgba(255,255,0,0.4)"}
                            onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.09)"} />
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                            <select value={member.role} onChange={setMember(i, "role")}
                              style={{ ...fieldBase, fontSize: 13, background: "#111112", appearance: "none", color: member.role ? "#fff" : "rgba(255,255,255,0.3)" }}>
                              <option value="" disabled>Role</option>
                              {["Developer", "Designer", "Product", "Data / ML", "Other"].map(r => (
                                <option key={r} value={r} style={{ background: "#111112" }}>{r}</option>
                              ))}
                            </select>
                            <input placeholder="GitHub" value={member.github} onChange={setMember(i, "github")}
                              style={{ ...fieldBase, fontSize: 13 }}
                              onFocus={e => e.target.style.borderColor = "rgba(255,255,0,0.4)"}
                              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.09)"} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Idea */}
                <div style={{ marginBottom: 32 }}>
                  <Field label="Initial idea (optional)">
                    <textarea
                      placeholder="What are you thinking of building? 2–3 sentences is plenty."
                      value={idea} onChange={e => setIdea(e.target.value)} rows={3}
                      style={{ ...fieldBase, resize: "vertical" }}
                      onFocus={e => e.target.style.borderColor = "rgba(255,255,0,0.45)"}
                      onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.09)"}
                    />
                  </Field>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    style={{
                      background: "#FFFF00", color: "#0C0C0D",
                      border: "none", borderRadius: 12,
                      padding: "18px 48px",
                      fontFamily: BODY_FONT,
                      fontWeight: 900, fontSize: 16, letterSpacing: "0.1em",
                      textTransform: "uppercase", cursor: "pointer"
                    }}
                  >
                    Register team →
                  </motion.button>
                    <span style={{ fontFamily: BODY_FONT, fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.2)" }}>
                    Free to participate · No commitment required before event
                  </span>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease }}
                style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 20 }}
              >
                <h3 style={{ fontFamily: BODY_FONT, fontWeight: 900, fontSize: "clamp(1.8rem, 4vw, 3.5rem)", textTransform: "uppercase", letterSpacing: "-0.04em", lineHeight: 0.9, color: "#FFFF00", margin: 0 }}>
                  {teamName || "Your team"}<br /><span style={{ color: "#fff" }}>is locked in.</span>
                </h3>
                <p style={{ fontFamily: BODY_FONT, fontSize: 18, fontWeight: 400, color: "rgba(255,255,255,0.45)", maxWidth: 480, lineHeight: 1.75 }}>
                  Each member will receive a confirmation email with next steps. Join our Discord for pre-event workshops and mentor office hours.
                </p>
                <a href={`https://${event.contact.discord}`} style={{ fontFamily: BODY_FONT, fontWeight: 700, fontSize: 16, color: "#FFFF00", textDecoration: "none", letterSpacing: "0.02em" }}>
                  {event.contact.discord} ↗
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* pulse keyframe */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
        * { -webkit-font-smoothing: antialiased; }
        ::placeholder { color: rgba(255,255,255,0.2); }
        input[type="email"]::-webkit-input-placeholder { color: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
}

function Reveal({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
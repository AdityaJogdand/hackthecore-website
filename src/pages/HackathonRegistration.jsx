import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import GlassCard from "../components/GlassCard";
import Footer from "@/components/Footer";

const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

/* ─── Font constants ─── */
const HEADER_FONT = "'SansPlomb', sans-serif";
const BODY_FONT = "'Inter', 'Manrope', 'SF Pro Display', sans-serif";
const ease = [0.22, 1, 0.36, 1];

/* ─── Field base style ─── */
const fieldBase = {
  background: "rgba(20,18,15,0.03)",
  border: "1px solid rgba(20,18,15,0.14)",
  borderRadius: 10,
  padding: "13px 16px",
  fontFamily: BODY_FONT,
  fontSize: 17,
  fontWeight: 400,
  color: "#1A1815",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

const focusHandlers = {
  onFocus: e => (e.target.style.borderColor = "rgba(255,255,0,0.45)"),
  onBlur: e => (e.target.style.borderColor = "rgba(20,18,15,0.14)"),
};

/* ─── Shared sub-components ─── */
const Field = ({ label, required, children }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
    <label style={{ fontFamily: BODY_FONT, fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(20,18,15,0.45)" }}>
      {label}{required && <span style={{ color: "#8A6D00", marginLeft: 3 }}>*</span>}
    </label>
    {children}
  </div>
);

const Input = ({ label, placeholder, type = "text", value, onChange, required }) => (
  <Field label={label} required={required}>
    <input
      type={type} placeholder={placeholder} value={value}
      onChange={onChange} required={required}
      style={fieldBase} {...focusHandlers}
    />
  </Field>
);

const Select = ({ label, value, onChange, options, required }) => (
  <Field label={label} required={required}>
    <select
      value={value} onChange={onChange} required={required}
      style={{ ...fieldBase, background: "#EFEBE1", appearance: "none", cursor: "pointer", color: value ? "#1A1815" : "rgba(20,18,15,0.4)" }}
    >
      <option value="" disabled>Select…</option>
      {options.map(o => <option key={o} value={o} style={{ background: "#EFEBE1" }}>{o}</option>)}
    </select>
  </Field>
);

const SectionLabel = ({ children }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 36 }}>
    <span style={{ fontFamily: BODY_FONT, fontSize: 12, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(20,18,15,0.4)", whiteSpace: "nowrap" }}>
      {children}
    </span>
    <div style={{ flex: 1, height: "1px", background: "rgba(20,18,15,0.12)" }} />
  </div>
);

function Reveal({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, ease }}
    >
      {children}
    </motion.div>
  );
}

const emptyMember = () => ({ name: "", email: "", role: "", github: "" });

/* ─── Place ordinal label ─── */
function placeLabel(place) {
  const n = parseInt(place, 10);
  if (n === 1) return "1st";
  if (n === 2) return "2nd";
  if (n === 3) return "3rd";
  return `${n}th`;
}

/* ════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════ */
export default function HackathonRegistration() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  /* form state */
  const [teamName, setTeamName] = useState("");
  const [track, setTrack] = useState("");
  const [members, setMembers] = useState([emptyMember(), emptyMember()]);
  const [idea, setIdea] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  /* parallax */
  const bannerRef = useRef(null);
  const { scrollYProgress: bannerProgress } = useScroll({ target: bannerRef, offset: ["start start", "end start"] });
  const bannerY = useTransform(bannerProgress, [0, 1], ["0%", "25%"]);
  const bannerOpacity = useTransform(bannerProgress, [0, 0.7], [1, 0]);

  /* member handlers */
  const addMember = () => { if (members.length < 4) setMembers(m => [...m, emptyMember()]); };
  const removeMember = i => { if (members.length > 1) setMembers(m => m.filter((_, idx) => idx !== i)); };
  const setMember = (i, k) => e => setMembers(m => m.map((mb, idx) => idx === i ? { ...mb, [k]: e.target.value } : mb));

  /* fetch event */
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`${API_BASE}/events/${id}`);
        const contentType = res.headers.get("content-type") || "";
        const data = contentType.includes("application/json")
          ? await res.json()
          : { message: `Server error ${res.status}` };
        if (!res.ok) throw new Error(data.message || "Event not found");
        setEvent(data);
      } catch (err) {
        setFetchError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  /* submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/registrations/hackathon`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: id, teamName, track, members, idea }),
      });
      const contentType = res.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await res.json()
        : { message: `Server error ${res.status}` };
      if (!res.ok) throw new Error(data.message || "Registration failed.");
      setSubmitted(true);
    } catch (err) {
      alert(err.message || "Failed to register. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── loading / error states ── */
  if (loading) return (
    <div style={{ background: "#F5F3ED", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Navbar />
      <p style={{ fontFamily: BODY_FONT, color: "rgba(20,18,15,0.4)", fontSize: 14, letterSpacing: "0.2em", textTransform: "uppercase" }}>Loading event…</p>
    </div>
  );

  if (fetchError || !event) return (
    <div style={{ background: "#F5F3ED", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Navbar />
      <p style={{ fontFamily: BODY_FONT, color: "#ff6b6b", fontSize: 16 }}>{fetchError || "Event not found"}</p>
    </div>
  );

  /* ── derived booleans to conditionally show sections ── */
  const hasTracks = event.problemStatement?.tracks?.length > 0;
  const hasTimeline = event.timeline?.length > 0;
  const hasPrizes = event.prizes?.length > 0;
  const hasJudges = event.judges?.length > 0;
  const hasSponsors = event.sponsors?.length > 0;
  const hasFaqs = event.faqs?.length > 0;
  const hasVenueImgs = event.venueImages?.some(Boolean);
  const hasTheme = !!event.problemStatement?.theme;
  const hasOverview = !!event.problemStatement?.overview;
  const hasProblem = hasTheme || hasOverview || hasTracks;
  const hasContact = event.contact && Object.values(event.contact).some(Boolean);
  const hasTrackOptions = event.problemStatement?.tracks?.map(t => t.name).filter(Boolean) || [];

  /* ════════════ RENDER ════════════ */
  return (
    <div style={{ background: "#F5F3ED", minHeight: "100vh", color: "#1A1815" }}>
      <Navbar />

      {/* ═══ HERO ═══ */}
      <div ref={bannerRef} style={{ position: "relative", height: "100vh", minHeight: 560, overflow: "hidden" }}>
        <motion.img
          src={event.banner} alt=""
          style={{ position: "absolute", inset: 0, width: "100%", height: "120%", objectFit: "cover", objectPosition: "center 40%", y: bannerY }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, rgba(12,12,13,0.55) 0%, rgba(12,12,13,0.85) 60%, #0C0C0D 100%)" }} />

        <motion.div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 6vw 80px", opacity: bannerOpacity }}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontFamily: BODY_FONT, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase",
              color: "#FFFF00", border: "1px solid rgba(255,255,0,0.3)", borderRadius: 99, padding: "6px 16px", marginBottom: 28,
            }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#FFFF00", display: "inline-block", animation: "pulse 2s infinite" }} />
              Registration open{event.registrationDeadline ? ` · Deadline ${event.registrationDeadline}` : ""}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease }}
            style={{ fontFamily: HEADER_FONT, fontWeight: 900, fontSize: "clamp(3.5rem, 11vw, 9rem)", letterSpacing: "-0.04em", lineHeight: 0.88, textTransform: "uppercase", color: "#fff", margin: "0 0 20px" }}
          >
            {event.title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease }}
            style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px 0" }}
          >
            {event.edition && (
              <span style={{ fontFamily: BODY_FONT, fontWeight: 700, fontSize: "clamp(1rem, 2.5vw, 1.6rem)", color: "#FFFF00", letterSpacing: "0.02em", marginRight: 24 }}>
                {event.edition}
              </span>
            )}
            {[
              event.venue && event.city ? `${event.venue}, ${event.city}` : event.venue || event.city,
              event.date,
              event.capacity,
            ].filter(Boolean).map((t, i) => (
              <span key={i} style={{ fontFamily: BODY_FONT, fontSize: 15, color: "rgba(255,255,255,0.5)", marginRight: 24, letterSpacing: "0.01em" }}>
                {i > 0 && <span style={{ marginRight: 24, color: "rgba(255,255,255,0.2)" }}>·</span>}
                {t}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* ═══ BODY ═══ */}
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "100px 6vw 0" }}>

        {/* About */}
        {event.description && (
          <Reveal>
            <section style={{ marginBottom: 100 }}>
              <SectionLabel>About the hackathon</SectionLabel>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 80px" }}>
                <div>
                  {event.description.split("\n\n").map((p, i) => (
                    <p key={i} style={{ fontFamily: BODY_FONT, fontSize: 18, fontWeight: 400, lineHeight: 1.8, color: "rgba(20,18,15,0.65)", marginBottom: 18 }}>{p}</p>
                  ))}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {[
                    event.date && { label: "Date", value: event.date },
                    (event.venue || event.city) && { label: "Venue", value: [event.venue, event.city].filter(Boolean).join(", ") },
                    { label: "Format", value: "In-person · Teams of 1–4" },
                    event.capacity && { label: "Capacity", value: event.capacity },
                    { label: "Entry fee", value: "Free" },
                  ].filter(Boolean).map(({ label, value }) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "14px 0", borderBottom: "1px solid rgba(20,18,15,0.1)" }}>
                      <span style={{ fontFamily: BODY_FONT, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(20,18,15,0.4)" }}>{label}</span>
                      <span style={{ fontFamily: BODY_FONT, fontSize: 17, fontWeight: 400, color: "rgba(20,18,15,0.8)", textAlign: "right", maxWidth: "60%" }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </Reveal>
        )}

        {/* Theme hero image */}
        {(event.themeImage || hasTheme) && (
          <Reveal>
            <div style={{ marginBottom: 100, borderRadius: 20, overflow: "hidden", position: "relative", height: 380 }}>
              {event.themeImage ? (
                <img src={event.themeImage} alt="Theme" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 60%" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", background: "rgba(255,255,255,0.03)" }} />
              )}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(12,12,13,0.75) 0%, transparent 65%)" }} />
              {hasTheme && (
                <div style={{ position: "absolute", bottom: 36, left: 40 }}>
                  <p style={{ fontFamily: BODY_FONT, fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,0,0.7)", marginBottom: 8 }}>Theme</p>
                  <h2 style={{ fontFamily: BODY_FONT, fontWeight: 900, fontSize: "clamp(1.8rem,4vw,3rem)", textTransform: "uppercase", letterSpacing: "-0.03em", color: "#fff", lineHeight: 1.05, maxWidth: 520 }}>
                    {event.problemStatement.theme}
                  </h2>
                </div>
              )}
            </div>
          </Reveal>
        )}

        {/* Problem statement */}
        {hasProblem && (
          <Reveal>
            <section style={{ marginBottom: 100 }}>
              <SectionLabel>Problem statement</SectionLabel>
              {hasOverview && (
                <p style={{ fontFamily: BODY_FONT, fontSize: 18, fontWeight: 400, lineHeight: 1.8, color: "rgba(20,18,15,0.65)", maxWidth: 680, marginBottom: hasTracks ? 48 : 0 }}>
                  {event.problemStatement.overview.split("\n\n")[0]}
                </p>
              )}
              {hasTracks && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  {event.problemStatement.tracks.map((t, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08, ease }}
                      whileHover={{ borderColor: "rgba(138,109,0,0.35)" }}
                      style={{ background: "rgba(20,18,15,0.03)", border: "1px solid rgba(20,18,15,0.1)", borderRadius: 16, padding: "24px 22px", cursor: "default", transition: "border-color 0.25s" }}
                    >
                      <p style={{ fontFamily: BODY_FONT, fontWeight: 800, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.08em", color: "#1A1815", marginBottom: 8 }}>{t.name}</p>
                      {t.desc && <p style={{ fontFamily: BODY_FONT, fontSize: 16, fontWeight: 400, color: "rgba(20,18,15,0.55)", lineHeight: 1.6 }}>{t.desc}</p>}
                    </motion.div>
                  ))}
                </div>
              )}
            </section>
          </Reveal>
        )}

        {/* Timeline */}
        {hasTimeline && (
          <Reveal>
            <section style={{ marginBottom: 100 }}>
              <SectionLabel>Schedule</SectionLabel>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 80px" }}>
                {[
                  event.timeline.slice(0, Math.ceil(event.timeline.length / 2)),
                  event.timeline.slice(Math.ceil(event.timeline.length / 2)),
                ].map((col, ci) => (
                  <div key={ci}>
                    {col.map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }} transition={{ duration: 0.4, delay: (ci * col.length + i) * 0.05, ease }}
                        style={{ display: "flex", gap: 20, alignItems: "flex-start", paddingBottom: 24, position: "relative" }}
                      >
                        {i < col.length - 1 && (
                          <div style={{ position: "absolute", left: 76, top: 22, bottom: 0, width: 1, background: "rgba(20,18,15,0.1)" }} />
                        )}
                        <span style={{ fontFamily: BODY_FONT, fontSize: 13, fontWeight: 700, color: "#8A6D00", minWidth: 76, paddingTop: 4, letterSpacing: "0.04em" }}>{item.time}</span>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(20,18,15,0.3)", marginTop: 5, flexShrink: 0 }} />
                        <span style={{ fontFamily: BODY_FONT, fontSize: 16, fontWeight: 400, color: "rgba(20,18,15,0.65)", paddingTop: 1, lineHeight: 1.5 }}>{item.label}</span>
                      </motion.div>
                    ))}
                  </div>
                ))}
              </div>
            </section>
          </Reveal>
        )}

        {/* Prizes */}
        {hasPrizes && (
          <Reveal>
            <section style={{ marginBottom: 100 }}>
              <SectionLabel>Prizes & awards</SectionLabel>
              <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
                {event.prizes.map((prize, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.07, ease }}
                  >
                    <GlassCard
                      title={prize.label}
                      subtitle={prize.perks?.filter(Boolean).join(" · ")}
                      amount={prize.amount}
                      tags={prize.place ? [`#${placeLabel(prize.place)}`] : []}
                    />
                  </motion.div>
                ))}
              </div>
            </section>
          </Reveal>
        )}

        {/* Judges */}
        {hasJudges && (
          <Reveal>
            <section style={{ marginBottom: 100 }}>
              <SectionLabel>Judges</SectionLabel>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 20 }}>
                {event.judges.map((judge, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.07, ease }}
                    style={{ background: "rgba(20,18,15,0.03)", border: "1px solid rgba(20,18,15,0.1)", borderRadius: 16, padding: "22px 20px", display: "flex", flexDirection: "column", gap: 12 }}
                  >
                    {judge.photo && (
                      <div style={{ width: 60, height: 60, borderRadius: "50%", overflow: "hidden", border: "1px solid rgba(20,18,15,0.15)", flexShrink: 0 }}>
                        <img src={judge.photo} alt={judge.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    )}
                    <div>
                      <p style={{ fontFamily: BODY_FONT, fontWeight: 700, fontSize: 16, color: "#1A1815", margin: "0 0 4px" }}>{judge.name}</p>
                      {judge.title && (
                        <p style={{ fontFamily: BODY_FONT, fontSize: 13, color: "#8A6D00", margin: "0 0 2px", fontWeight: 600 }}>{judge.title}</p>
                      )}
                      {judge.company && (
                        <p style={{ fontFamily: BODY_FONT, fontSize: 13, color: "rgba(20,18,15,0.45)", margin: 0 }}>{judge.company}</p>
                      )}
                    </div>
                    {judge.bio && (
                      <p style={{ fontFamily: BODY_FONT, fontSize: 13, color: "rgba(20,18,15,0.55)", lineHeight: 1.6, margin: 0 }}>{judge.bio}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            </section>
          </Reveal>
        )}

        {/* Venue photos */}
        {hasVenueImgs && (
          <Reveal>
            <section style={{ marginBottom: 100 }}>
              <SectionLabel>Venue</SectionLabel>
              {event.venueImages.filter(Boolean).length === 1 ? (
                <div style={{ borderRadius: 16, overflow: "hidden", height: 280 }}>
                  <img src={event.venueImages[0]} alt="Venue" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  {event.venueImages.filter(Boolean).map((img, i) => (
                    <img key={i} src={img} alt={`Venue ${i + 1}`} style={{ width: "100%", height: 280, objectFit: "cover", borderRadius: 16 }} />
                  ))}
                </div>
              )}
            </section>
          </Reveal>
        )}

        {/* Sponsors */}
        {hasSponsors && (
          <Reveal>
            <section style={{ marginBottom: 100 }}>
              <SectionLabel>Sponsors</SectionLabel>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "center" }}>
                {event.sponsors.map((sponsor, i) => (
                  <motion.a
                    key={i}
                    href={sponsor.url || undefined}
                    target={sponsor.url ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.06, ease }}
                    whileHover={{ borderColor: "rgba(138,109,0,0.4)", y: -3 }}
                    style={{
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
                      padding: "28px 36px", borderRadius: 16,
                      background: "rgba(20,18,15,0.03)", border: "1px solid rgba(20,18,15,0.1)",
                      minWidth: 170, textDecoration: "none",
                      cursor: sponsor.url ? "pointer" : "default", transition: "border-color 0.2s",
                    }}
                  >
                    {sponsor.logo && (
                      <div style={{ height: 56, display: "flex", alignItems: "center" }}>
                        <img src={sponsor.logo} alt={sponsor.name} style={{ maxHeight: 56, maxWidth: 150, objectFit: "contain" }} />
                      </div>
                    )}
                    <span style={{ fontFamily: BODY_FONT, fontSize: 13, fontWeight: 600, color: "rgba(20,18,15,0.65)" }}>{sponsor.name}</span>
                    {sponsor.tier && (
                      <span style={{ fontFamily: BODY_FONT, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(138,109,0,0.75)" }}>
                        {sponsor.tier}
                      </span>
                    )}
                  </motion.a>
                ))}
              </div>
            </section>
          </Reveal>
        )}

        {/* FAQ */}
        {hasFaqs && (
          <Reveal>
            <section style={{ marginBottom: 100 }}>
              <SectionLabel>FAQ</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {event.faqs.map((faq, i) => (
                  <FaqItem key={i} question={faq.question} answer={faq.answer} index={i} />
                ))}
              </div>
            </section>
          </Reveal>
        )}

        {/* Contact */}
        {hasContact && (
          <Reveal>
            <section style={{ marginBottom: 120 }}>
              <SectionLabel>Contact & community</SectionLabel>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
                {Object.entries(event.contact).map(([k, v]) => v && (
                  <div key={k} style={{ background: "rgba(20,18,15,0.03)", border: "1px solid rgba(20,18,15,0.1)", borderRadius: 14, padding: "20px 18px" }}>
                    <p style={{ fontFamily: BODY_FONT, fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(20,18,15,0.4)", marginBottom: 10 }}>{k}</p>
                    <p style={{ fontFamily: BODY_FONT, fontSize: 15, fontWeight: 400, color: "#8A6D00", lineHeight: 1.5, wordBreak: "break-all" }}>{v}</p>
                  </div>
                ))}
              </div>
            </section>
          </Reveal>
        )}
      </div>

      <Footer />
    </div>
  );
}
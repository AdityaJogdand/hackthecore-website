import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";

const HEADER_FONT = "'SansPlomb', sans-serif";
const BODY_FONT = "'Inter', 'Manrope', 'SF Pro Display', sans-serif";
const ease = [0.22, 1, 0.36, 1];

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

export default function MeetupRegistration() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [experience, setExperience] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const bannerRef = useRef(null);
  const { scrollYProgress: bannerProgress } = useScroll({ target: bannerRef, offset: ["start start", "end start"] });
  const bannerY = useTransform(bannerProgress, [0, 1], ["0%", "25%"]);
  const bannerOpacity = useTransform(bannerProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/events/${id}`);
        if (!res.ok) throw new Error("Event not found");
        const data = await res.json();
        setEvent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    try {
      const res = await fetch("http://localhost:4000/api/registrations/meetup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: id, eventTitle: event.title, name, email, phone, experience }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Registration failed.");
      }
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err.message || "Failed to register. Please try again.");
    }
  };

  if (loading) return (
    <div style={{ background: "#0C0C0D", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Navbar />
      <p style={{ fontFamily: BODY_FONT, color: "rgba(255,255,255,0.3)", fontSize: 14, letterSpacing: "0.2em", textTransform: "uppercase" }}>Loading event…</p>
    </div>
  );

  if (error || !event) return (
    <div style={{ background: "#0C0C0D", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Navbar />
      <p style={{ fontFamily: BODY_FONT, color: "#ff6b6b", fontSize: 16 }}>{error || "Event not found"}</p>
    </div>
  );

  return (
    <div style={{ background: "#0C0C0D", minHeight: "100vh", color: "#fff" }}>
      <Navbar />

      {/* ═══ HERO ═══ */}
      <div ref={bannerRef} style={{ position: "relative", height: "80vh", minHeight: 480, overflow: "hidden" }}>
        <motion.img
          src={event.banner} alt=""
          style={{ position: "absolute", inset: 0, width: "100%", height: "120%", objectFit: "cover", objectPosition: "center 40%", y: bannerY }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, rgba(12,12,13,0.55) 0%, rgba(12,12,13,0.85) 60%, #0C0C0D 100%)" }} />

        <motion.div
          style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyHeight: "flex-end", justifyContent: "flex-end", padding: "0 6vw 80px", opacity: bannerOpacity }}
        >
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontFamily: BODY_FONT, fontSize: 10, fontWeight: 700,
              letterSpacing: "0.2em", textTransform: "uppercase",
              color: "#FFFF00", border: "1px solid rgba(255,255,0,0.3)",
              borderRadius: 99, padding: "6px 16px", marginBottom: 28
            }}>\
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#FFFF00", display: "inline-block", animation: "pulse 2s infinite" }} />
              Meetup{event.registrationDeadline ? ` · Deadline ${event.registrationDeadline}` : " · Open"}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease }}
            style={{
              fontFamily: HEADER_FONT,
              fontWeight: 900, fontSize: "clamp(3rem, 10vw, 8rem)",
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
            {[`${event.venue}, ${event.city}`, event.date, event.time].filter(Boolean).map((t, i) => (
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

        {/* ── About ── */}
        <Reveal>
          <section style={{ marginBottom: 100 }}>
            <SectionLabel>About the meetup</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 80px" }}>
              <div>
                {(event.description || "").split("\n\n").map((p, i) => (
                  <p key={i} style={{ fontFamily: BODY_FONT, fontSize: 18, fontWeight: 400, lineHeight: 1.8, color: "rgba(255,255,255,0.55)", marginBottom: 18 }}>{p}</p>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { label: "Date", value: event.date },
                  { label: "Venue", value: `${event.venue}, ${event.city}` },
                  { label: "Time", value: event.time },
                  { label: "Capacity", value: event.capacity || "Open" },
                  { label: "Entry", value: "Free" },
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

        {/* ── Timeline ── */}
        {event.timeline && event.timeline.length > 0 && (
          <Reveal>
            <section style={{ marginBottom: 100 }}>
              <SectionLabel>Schedule</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {event.timeline.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05, ease }}
                    style={{ display: "flex", gap: 20, alignItems: "flex-start", paddingBottom: 24, position: "relative" }}
                  >
                    {i < event.timeline.length - 1 && (
                      <div style={{ position: "absolute", left: 76, top: 22, bottom: 0, width: 1, background: "rgba(255,255,255,0.06)" }} />
                    )}
                    <span style={{ fontFamily: BODY_FONT, fontSize: 13, fontWeight: 700, color: "#FFFF00", minWidth: 76, paddingTop: 4, letterSpacing: "0.04em" }}>{item.time}</span>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.25)", marginTop: 5, flexShrink: 0 }} />
                    <span style={{ fontFamily: BODY_FONT, fontSize: 16, fontWeight: 400, color: "rgba(255,255,255,0.6)", paddingTop: 1, lineHeight: 1.5 }}>{item.label}</span>
                  </motion.div>
                ))}
              </div>
            </section>
          </Reveal>
        )}

        {/* ── Contact ── */}
        {event.contact && (
          <Reveal>
            <section style={{ marginBottom: 120 }}>
              <SectionLabel>Contact & community</SectionLabel>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
                {Object.entries(event.contact).filter(([, v]) => v).map(([k, v]) => (
                  <div key={k} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "20px 18px" }}>
                    <p style={{ fontFamily: BODY_FONT, fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 10 }}>{k}</p>
                    <p style={{ fontFamily: BODY_FONT, fontSize: 15, fontWeight: 400, color: "#FFFF00", lineHeight: 1.5, wordBreak: "break-all" }}>{v}</p>
                  </div>
                ))}
              </div>
            </section>
          </Reveal>
        )}
      </div>

      {/* ═══ RSVP FORM ═══ */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "#0C0C0D" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "100px 6vw 120px" }}>
          <div style={{ marginBottom: 60 }}>
            <p style={{ fontFamily: BODY_FONT, fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 12 }}>
              Free{event.registrationDeadline ? ` · Deadline ${event.registrationDeadline}` : ""}
            </p>
            <h2 style={{ fontFamily: BODY_FONT, fontWeight: 900, fontSize: "clamp(2rem, 5vw, 4.5rem)", textTransform: "uppercase", letterSpacing: "-0.04em", lineHeight: 0.9, color: "#fff", margin: 0 }}>
              Reserve<br /><span style={{ color: "#FFFF00" }}>your spot</span>
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
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                  <Input label="Full name" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} required />
                  <Input label="Email" placeholder="you@example.com" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 32 }}>
                  <Input label="Phone (optional)" placeholder="+91 ..." type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
                  <Field label="Experience level" required>
                    <select
                      value={experience} onChange={e => setExperience(e.target.value)} required
                      style={{ ...fieldBase, background: "#111112", appearance: "none", cursor: "pointer", color: experience ? "#fff" : "rgba(255,255,255,0.3)" }}
                    >
                      <option value="" disabled>Select…</option>
                      {["beginner", "intermediate", "advanced"].map(o => (
                        <option key={o} value={o} style={{ background: "#111112", textTransform: "capitalize" }}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>
                      ))}
                    </select>
                  </Field>
                </div>

                {submitError && (
                  <p style={{ fontFamily: BODY_FONT, fontSize: 13, color: "#ff6b6b", background: "rgba(255,100,100,0.08)", border: "1px solid rgba(255,100,100,0.2)", borderRadius: 8, padding: "12px 16px", marginBottom: 20 }}>
                    {submitError}
                  </p>
                )}

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
                    RSVP now →
                  </motion.button>
                  <span style={{ fontFamily: BODY_FONT, fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.2)" }}>
                    Free · No commitment
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
                  {name || "You're"}<br /><span style={{ color: "#fff" }}>all set.</span>
                </h3>
                <p style={{ fontFamily: BODY_FONT, fontSize: 18, fontWeight: 400, color: "rgba(255,255,255,0.45)", maxWidth: 480, lineHeight: 1.75 }}>
                  You'll receive a confirmation email with event details and any pre-event prep info. See you there!
                </p>
                {event.contact?.discord && (
                  <a href={`https://${event.contact.discord}`} style={{ fontFamily: BODY_FONT, fontWeight: 700, fontSize: 16, color: "#FFFF00", textDecoration: "none", letterSpacing: "0.02em" }}>
                    {event.contact.discord} ↗
                  </a>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
        * { -webkit-font-smoothing: antialiased; }
        ::placeholder { color: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
}

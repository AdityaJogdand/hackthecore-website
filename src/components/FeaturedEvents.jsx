import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

/* ─── tokens ──────────────────────────────────────────────────────────── */
const C = {
  bg: "#F2F2EF",
  ink: "#111110",
  inkMid: "#555553",
  inkFaint: "#ABABAA",
  yellow: "#E8D20A",
  yellowBg: "#F6FB37",
  rule: "#D8D8D4",
};

const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

/* ─── main section ─────────────────────────────────────────────────────── */
export default function FeaturedEvents() {
  const [hovered, setHovered] = useState(false);
  const [event, setEvent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE}/events/featured`)
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data) && data.length > 0) setEvent(data[0]); })
      .catch(() => {});
  }, []);

  if (!event) return null;

  return (
    <section
      style={{
        background: C.bg,
        paddingBottom: "clamp(4rem, 8vw, 8rem)",
      }}
    >
      {/* ══════════════ SECTION HEADER ══════════════ */}
      <div
        style={{
          borderTop: `1px solid ${C.rule}`,
          paddingTop: "clamp(3rem, 6vw, 5rem)",
          paddingBottom: "clamp(2.5rem, 5vw, 4rem)",
          paddingLeft: "clamp(1.25rem, 5vw, 5rem)",
          paddingRight: "clamp(1.25rem, 5vw, 5rem)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "1.25rem",
        }}
      >
        {/* Eyebrow row: rule — label — rule */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            width: "100%",
            maxWidth: 480,
          }}
        >
          <div style={{ flex: 1, height: 1, background: C.rule }} />
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              fontSize: "0.6rem",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: C.inkFaint,
              whiteSpace: "nowrap",
            }}
          >
            What's Happening
          </span>
          <div style={{ flex: 1, height: 1, background: C.rule }} />
        </motion.div>

        {/* Display title */}
        <motion.h2
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
          style={{
            fontFamily: "'Anton', sans-serif",
            fontWeight: 400,
            fontSize: "clamp(2.6rem, 7vw, 5.5rem)",
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
            color: C.ink,
            margin: 0,
            textTransform: "uppercase",
          }}
        >
          Featured{" "}
          <span
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontStyle: "italic",
              fontWeight: 400,
              textTransform: "none",
              letterSpacing: "-0.03em",
            }}
          >
            Events
          </span>
        </motion.h2>

        {/* Subtitle + View All row */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.9rem",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              fontSize: "clamp(0.8rem, 2vw, 3rem)",
              color: C.inkMid,
              margin: 0,
              letterSpacing: "0.01em",
              lineHeight: 1.5,
            }}
          >
            Flagship builds, community moments &amp; live competitions.
          </p>

          <a
            href="/events"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: "clamp(0.75rem, 2vw, 1.25rem)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: C.ink,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45em",
              borderBottom: `1.5px solid ${C.rule}`,
              paddingBottom: "0.25em",
              transition: "border-color 0.25s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = C.ink)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = C.rule)}
          >
            View All
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path
                d="M1 6h10M6 1l5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </motion.div>
      </div>

      {/* ══════════════════ BIG BANNER CARD ══════════════════ */}
      <div
        style={{
          paddingLeft: "clamp(1.25rem, 5vw, 5rem)",
          paddingRight: "clamp(1.25rem, 5vw, 5rem)",
        }}
      >
        <div style={{ maxWidth: 1440, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              position: "relative",
              borderRadius: 6,
              overflow: "hidden",
              cursor: "pointer",
              border: `1px solid ${hovered ? "rgba(17,17,16,0.15)" : "rgba(17,17,16,0.06)"}`,
              transition: "border-color 0.4s, box-shadow 0.4s",
              boxShadow: hovered
                ? "0 20px 60px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.05)"
                : "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            {/* ── Banner image with parallax ── */}
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "clamp(280px, 40vw, 500px)",
                overflow: "hidden",
              }}
            >
              <img
                src={event.banner}
                alt={event.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />

              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.1) 70%, transparent 100%)",
                  pointerEvents: "none",
                }}
              />

              {/* Top-left badges */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                style={{
                  position: "absolute",
                  top: "clamp(1rem, 3vw, 2rem)",
                  left: "clamp(1.25rem, 3vw, 2.5rem)",
                  display: "flex",
                  gap: "0.6rem",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.58rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: C.ink,
                    background: C.yellowBg,
                    padding: "0.4em 0.8em",
                    borderRadius: 2,
                  }}
                >
                  {event.eventType === "hackathon" ? "FLAGSHIP HACKATHON" : "MEETUP"}
                </span>

                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.55rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#4ADE80",
                    background: "rgba(0,0,0,0.5)",
                    backdropFilter: "blur(8px)",
                    padding: "0.4em 0.8em",
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4em",
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#4ADE80",
                      display: "inline-block",
                      animation: "pulse-dot 2s ease infinite",
                    }}
                  />
                  {event.registrationLink ? "REGISTRATIONS OPEN" : "COMING SOON"}
                </span>
              </motion.div>

              {/* Bottom content overlay */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "clamp(1.5rem, 4vw, 3rem) clamp(1.25rem, 3vw, 2.5rem)",
                }}
              >
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  style={{
                    fontFamily: "'Anton', sans-serif",
                    fontWeight: 400,
                    fontSize: "clamp(2rem, 5vw, 4.5rem)",
                    lineHeight: 1,
                    letterSpacing: "-0.01em",
                    textTransform: "uppercase",
                    color: "#fff",
                    margin: 0,
                  }}
                >
                  {event.title}
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.35 }}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400,
                    fontSize: "clamp(0.85rem, 1.5vw, 1.05rem)",
                    color: "rgba(255,255,255,0.7)",
                    lineHeight: 1.6,
                    maxWidth: 640,
                    marginTop: "0.75rem",
                    marginBottom: 0,
                  }}
                >
                  {event.description}
                </motion.p>
              </div>
            </div>

            {/* ── Bottom info bar ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "clamp(1.5rem, 3vw, 3rem)",
                padding: "clamp(1.25rem, 2.5vw, 1.75rem) clamp(1.25rem, 3vw, 2.5rem)",
                background: C.ink,
                color: "#fff",
              }}
            >
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  fontSize: "0.78rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5em",
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                  <rect x="1" y="2" width="12" height="11" rx="1.5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" />
                  <path d="M1 5.5h12" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" />
                  <path d="M4.5 1v2M9.5 1v2" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                {event.date}
              </span>

              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  fontSize: "0.78rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5em",
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1C4.79 1 3 2.79 3 5c0 3.5 4 8 4 8s4-4.5 4-8c0-2.21-1.79-4-4-4z" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" />
                  <circle cx="7" cy="5" r="1.5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" />
                </svg>
                {event.city}
              </span>

              <div
                style={{
                  flex: "0 0 1px",
                  alignSelf: "stretch",
                  background: "rgba(255,255,255,0.12)",
                  display: "none",
                }}
                className="info-divider"
              />

              {[
                { value: "500+", label: "Builders" },
                { value: "48h", label: "Non-Stop" },
                { value: "₹5L+", label: "In Prizes" },
              ].map(h => (
                <div key={h.label} style={{ display: "flex", alignItems: "baseline", gap: "0.35em" }}>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "clamp(1rem, 1.8vw, 1.3rem)", color: C.yellowBg, letterSpacing: "-0.02em" }}>{h.value}</span>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>{h.label}</span>
                </div>
              ))}

              <div style={{ marginLeft: "auto", display: "flex", flexWrap: "wrap", gap: "0.6em", justifyContent: "flex-end" }}>
                <motion.button
                  onClick={() => navigate(`/events/${event._id}`)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    background: "transparent",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.25)",
                    padding: "0.7em 2.2em",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.68rem",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5em",
                    borderRadius: 2,
                    minWidth: 120,
                  }}
                >
                  Details
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.button>

                {event.registrationLink ? (
                  <motion.a
                    href={/^https?:\/\//i.test(event.registrationLink) ? event.registrationLink : `https://${event.registrationLink}`}
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    animate={{ x: hovered ? 2 : 0 }}
                    style={{
                      background: C.yellowBg,
                      color: C.ink,
                      border: "none",
                      padding: "0.7em 2.2em",
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 700,
                      fontSize: "0.68rem",
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5em",
                      borderRadius: 2,
                      textDecoration: "none",
                      minWidth: 120,
                    }}
                  >
                    Register Now
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.a>
                ) : (
                  <motion.button
                    disabled
                    style={{
                      background: "rgba(254,246,54,0.15)",
                      color: "rgba(254,246,54,0.4)",
                      border: "1px solid rgba(254,246,54,0.2)",
                      padding: "0.7em 2.2em",
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 700,
                      fontSize: "0.68rem",
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      cursor: "not-allowed",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5em",
                      borderRadius: 2,
                      minWidth: 120,
                    }}
                  >
                    Coming Soon
                  </motion.button>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.6); }
        }
        @media (min-width: 768px) {
          .info-divider { display: block !important; }
        }
      `}</style>
    </section>
  );
}
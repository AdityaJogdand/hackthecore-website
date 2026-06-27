import React, { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/* ─── tokens ──────────────────────────────────────────────────────────── */
const C = {
  bg: "#FAFAF8",
  ink: "#111110",
  inkMid: "#555553",
  inkFaint: "#ABABAA",
  yellow: "#E8D20A",
  yellowBg: "#F4DD0E",
  rule: "#DDDDD9",
};

/* ─── featured event data ─────────────────────────────────────────────── */
const FEATURED_EVENT = {
  tag: "FLAGSHIP HACKATHON",
  title: "HackTheCore 3.0",
  date: "Aug 15 – 17, 2025",
  location: "Pune, Maharashtra",
  description:
    "48-hour flagship hackathon. Build, break, and ship with 500+ builders from across India. ₹5L+ in prizes, mentorship from industry leaders, and a stage to launch your next big idea.",
  status: "REGISTRATIONS OPEN",
  image: "/hackathon-banner.png",
  highlights: [
    { value: "500+", label: "Builders" },
    { value: "48h", label: "Non-Stop" },
    { value: "₹5L+", label: "In Prizes" },
  ],
};

/* ─── main section ─────────────────────────────────────────────────────── */
export default function FeaturedEvents() {
  const [hovered, setHovered] = useState(false);
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax on the banner image
  const imageY = useTransform(scrollYProgress, [0, 1], ["-5%", "10%"]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5], [1.08, 1]);

  return (
    <section
      ref={sectionRef}
      style={{
        background: C.bg,
        padding: "clamp(4rem, 8vw, 8rem) clamp(1.25rem, 5vw, 5rem)",
      }}
    >
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
        }}
      >
        {/* ── section header ── */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "clamp(1rem, 2.5vw, 1.75rem)",
          }}
        >
          <div>
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{
                display: "block",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                fontSize: "0.65rem",
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: C.inkFaint,
                marginBottom: "0.75rem",
              }}
            >
              What's Happening
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              style={{
                fontFamily: "'SansPlomb', sans-serif",
                fontWeight: 600,
                fontSize: "clamp(2rem, 5vw, 3.8rem)",
                lineHeight: 1,
                letterSpacing: "-0.03em",
                color: C.ink,
                margin: 0,
              }}
            >
              Featured{" "}
              <span
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontStyle: "italic",
                  fontWeight: 400,
                  color: C.ink,
                }}
              >
                Event
              </span>
            </motion.h2>
          </div>

          {/* view-all link */}
          <motion.a
            href="/events"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: "0.7rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: C.ink,
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "0.5em",
              borderBottom: `1.5px solid ${C.rule}`,
              paddingBottom: "0.3em",
              transition: "border-color 0.3s",
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = C.ink)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = C.rule)}
          >
            View All Events
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M1 6h10M6 1l5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.a>
        </div>

        {/* ══════════════════ BIG BANNER CARD ══════════════════ */}
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
            border: `1px solid ${hovered ? "rgba(17, 17, 16, 0.15)" : "rgba(17, 17, 16, 0.06)"}`,
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
            <motion.img
              src={FEATURED_EVENT.image}
              alt="HackTheCore 3.0 Banner"
              style={{
                width: "100%",
                height: "120%",
                objectFit: "cover",
                objectPosition: "center",
                y: imageY,
                scale: imageScale,
              }}
            />

            {/* Dark gradient overlay */}
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
                {FEATURED_EVENT.tag}
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
                {FEATURED_EVENT.status}
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
              {/* Title */}
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                style={{
                  fontFamily: "'SansPlomb', sans-serif",
                  fontWeight: 600,
                  fontSize: "clamp(2rem, 5vw, 4.5rem)",
                  lineHeight: 1,
                  letterSpacing: "-0.03em",
                  color: "#fff",
                  margin: 0,
                }}
              >
                {FEATURED_EVENT.title}
              </motion.h3>

              {/* Description */}
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
                {FEATURED_EVENT.description}
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
            {/* Date */}
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
              {FEATURED_EVENT.date}
            </span>

            {/* Location */}
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
              {FEATURED_EVENT.location}
            </span>

            {/* Spacer-divider on larger screens */}
            <div
              style={{
                flex: "0 0 1px",
                alignSelf: "stretch",
                background: "rgba(255,255,255,0.12)",
                display: "none",
              }}
              className="info-divider"
            />

            {/* Stat highlights */}
            {FEATURED_EVENT.highlights.map(h => (
              <div
                key={h.label}
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "0.35em",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 800,
                    fontSize: "clamp(1rem, 1.8vw, 1.3rem)",
                    color: C.yellowBg,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {h.value}
                </span>
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400,
                    fontSize: "0.62rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.45)",
                  }}
                >
                  {h.label}
                </span>
              </div>
            ))}

            {/* Register CTA */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              animate={{ x: hovered ? 2 : 0 }}
              style={{
                marginLeft: "auto",
                background: C.yellowBg,
                color: C.ink,
                border: "none",
                padding: "0.7em 1.6em",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: "0.68rem",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5em",
                borderRadius: 2,
                transition: "background 0.2s",
              }}
            >
              Register Now
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* ── keyframes ── */}
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.6); }
        }
        @media (min-width: 768px) {
          .info-divider {
            display: block !important;
          }
        }
      `}</style>
    </section>
  );
}

import React, { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── constants ──────────────────────────────────────────────────────────── */

const MARQUEE_ITEMS = [
  "Hackathons", "✦", "Open Source", "✦", "Side Projects", "✦",
  "AI / ML", "✦", "Community", "✦", "Product Design", "✦",
  "Web3", "✦", "Deep Tech", "✦",
];

/* ─── tokens ─────────────────────────────────────────────────────────────── */
const C = {
  bg: "#F7F6F1",
  ink: "#111110",
  inkMid: "#46453F",
  inkFaint: "#8C8C89",
  yellowBg: "#F4DD0E",
  rule: "#DAD8CF",
};

/* ─── character-wise reveal (unchanged) ─────────────────────────────────── */
function pseudoJitter(seed) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function RevealText({ text, delayStart = 0, stagger = 0.028, as: Tag = "span", className, style }) {
  const words = useMemo(() => text.split(" "), [text]);
  let globalIndex = 0;

  return (
    <Tag className={className} style={{ display: "inline", ...style }}>
      {words.map((word, wi) => (
        <span key={wi} style={{ display: "inline-block", whiteSpace: "nowrap", marginRight: "0.28em" }}>
          {word.split("").map((ch, ci) => {
            const idx = globalIndex++;
            const jitter = (pseudoJitter(idx + 1) - 0.5) * 0.05;
            const delay = Math.max(0, delayStart + idx * stagger + jitter);
            return (
              <motion.span
                key={ci}
                initial={{ opacity: 0, y: "0.5em", filter: "blur(9px)" }}
                animate={{ opacity: 1, y: "0em", filter: "blur(0px)" }}
                transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1], delay }}
                style={{ display: "inline-block", willChange: "transform, filter, opacity" }}
              >
                {ch}
              </motion.span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}

function GridLines() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        backgroundImage: `linear-gradient(to right, ${C.rule} 1px, transparent 1px)`,
        backgroundSize: "clamp(180px, 20vw, 340px) 100%",
        backgroundPosition: "center top",
        opacity: 0.55,
      }}
    />
  );
}

/* ─── custom yellow cursor tag ──────────────────────────────────────────────
   Follows the pointer inside the hero section only. Hidden on touch devices
   (no real cursor to attach to) and hidden the instant the pointer leaves.
──────────────────────────────────────────────────────────────────────────── */
function CursorTag({ containerRef }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || isTouch) return;

    const handleMove = (e) => {
      const rect = node.getBoundingClientRect();
      setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      setVisible(true);
    };
    const handleLeave = () => setVisible(false);

    node.addEventListener("mousemove", handleMove);
    node.addEventListener("mouseleave", handleLeave);
    return () => {
      node.removeEventListener("mousemove", handleMove);
      node.removeEventListener("mouseleave", handleLeave);
    };
  }, [containerRef, isTouch]);

  if (isTouch) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "absolute",
            left: pos.x,
            top: pos.y,
            transform: "translate(18px, 18px) rotate(-3deg)",
            zIndex: 50,
            pointerEvents: "none",
            background: C.yellowBg,
            color: C.ink,
            fontFamily: "'Inter', sans-serif",
            fontWeight: 800,
            fontSize: "0.78rem",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            padding: "0.4rem 0.7rem",
            borderRadius: 4,
            boxShadow: "0 4px 14px rgba(17,17,16,0.18)",
          }}
        >
          Hack The Core
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const headlineFont = {
  fontFamily: "'Neue Haas Grotesk Display', 'Helvetica Neue', Arial, sans-serif",
  fontSize: "clamp(2.4rem, 7.4vw, 7.2rem)",
  lineHeight: 0.98,
  letterSpacing: "-0.02em",
  color: C.ink,
  margin: 0,
  textTransform: "uppercase",
};

export default function HeroSection() {
  const sectionRef = useRef(null);

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        background: C.bg,
      }}
    >
      <GridLines />
      <CursorTag containerRef={sectionRef} />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          maxWidth: 1440,
          margin: "0 auto",
          width: "100%",
          padding: "clamp(2rem, 6vw, 5rem)",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/*
          Single relative wrapper for BOTH headline lines.
          Subtitle is absolutely positioned inside it, anchored above
          where "SHIPPED" renders — so its own text height can never
          push line 2 down. This is what was broken before: the subtitle
          was a flex sibling of line 1, so 4 lines of body copy stretched
          that row and shoved "IDEAS INTO SHIPPED" downward.
        */}
        <div style={{ position: "relative" }}>
          <motion.p
            initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            style={{
              position: "absolute",
               top: "-2px",      // move up
              right: "230px",     
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              fontSize: "0.95rem",
              lineHeight: 1.55,
              color: C.inkMid,
              maxWidth: 370,
              margin: 0,
              textAlign: "left",
            }}
          >
            We're a builder-first community for people who'd rather ship an
            idea than just talk about it — hackathons, open-source sprints,
            and real teams turning weekend hacks into shipped work.
          </motion.p>

          <h1 style={{ ...headlineFont, fontWeight: 800 }}>
            <div style={{ overflow: "hidden" }}>
              <RevealText text="BUILD LOUD" delayStart={0.15} />
            </div>
          </h1>

          <h1 style={{ ...headlineFont, fontWeight: 800, marginTop: "0.02em" }}>
            <div
              style={{
                overflow: "visible",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "0.28em",
              }}
            >
              <RevealText text="IDEAS INTO" delayStart={0.42} />
              <motion.span
                initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.78 }}
                style={{ display: "inline-block" }}
              >
                <span
                  style={{
                    display: "inline-block",
                    background: C.yellowBg,
                    color: C.ink,
                    padding: "0.02em 0.2em 0.06em",
                    borderRadius: "0.1em",
                  }}
                >
                  SHIPPED
                </span>
              </motion.span>
            </div>
          </h1>

          <h1 style={{ ...headlineFont, fontWeight: 400, marginTop: "0.02em" }}>
            <div style={{ overflow: "hidden" }}>
              <RevealText text="PRODUCTS." delayStart={0.95} />
            </div>
          </h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16, filter: "blur(5px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 1.2 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginTop: "clamp(2rem, 4vw, 3rem)",
          }}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#2d2d2d")}
            onMouseLeave={(e) => (e.currentTarget.style.background = C.ink)}
            style={{
              padding: "0.9rem 1.6rem",
              background: C.ink,
              color: C.bg,
              border: "none",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: "0.85rem",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              cursor: "pointer",
              borderRadius: 4,
              transition: "background .2s ease",
            }}
          >
            Join Community
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.ink)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.rule)}
            aria-label="Explore events"
            style={{
              width: 52,
              height: 52,
              flexShrink: 0,
              background: "transparent",
              border: `1.5px solid ${C.rule}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              borderRadius: 4,
              transition: "border-color .2s ease",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 12 12" fill="none">
              <path d="M2 10L10 2M10 2H3M10 2V9" stroke={C.ink} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.4 }}
        style={{
          borderTop: `1px solid ${C.rule}`,
          padding: "0.9rem 0",
          overflow: "hidden",
          position: "relative",
          zIndex: 2,
        }}
      >
        {["left", "right"].map((side) => (
          <div
            key={side}
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              [side]: 0,
              width: 80,
              background: `linear-gradient(to ${side === "left" ? "right" : "left"}, ${C.bg}, transparent)`,
              zIndex: 2,
              pointerEvents: "none",
            }}
          />
        ))}
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          style={{ display: "flex", gap: "2rem", width: "max-content", willChange: "transform" }}
        >
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span
              key={i}
              style={{
                fontFamily: item === "✦" ? "serif" : "'Inter', sans-serif",
                fontWeight: item === "✦" ? 400 : 500,
                fontSize: item === "✦" ? "0.75rem" : "0.98rem",
                letterSpacing: item === "✦" ? 0 : "0.2em",
                textTransform: "uppercase",
                color: item === "✦" ? "#B8A800" : C.inkMid,
                whiteSpace: "nowrap",
              }}
            >
              {item}
            </span>
          ))}
        </motion.div>
      </motion.div>

      <div
        style={{
          borderTop: `1px solid ${C.rule}`,
          padding: "0.9rem clamp(1.25rem, 5vw, 5rem)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
          position: "relative",
          zIndex: 2,
          fontFamily: "'Inter', sans-serif",
          fontWeight: 500,
          fontSize: "0.75rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: C.inkFaint,
        }}
      >
        <span>Instagram, X, Discord</span>
        <motion.span
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: C.ink }}
        >
          ↓ Scroll down
        </motion.span>
        <span>hello@hackthecore.dev</span>
      </div>
    </section>
  );
}
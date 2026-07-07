import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";

/* ─────────────────────────── TOKENS ─────────────────────────── */
const C = {
  bg: "#FFFFFF",
  ink: "#0C0C0D",
  muted: "rgba(12,12,13,0.5)",
  faint: "rgba(12,12,13,0.1)",
  yellow: "#FFE400",
};
const DISPLAY = "'Anton', 'Barlow', sans-serif";
const BODY = "'Barlow', sans-serif";
const ease = [0.22, 1, 0.36, 1];


export default function ComingSoon() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setJoined(true);
  };

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.ink, position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Barlow:wght@400;500;600;700;900&display=swap');
        * { box-sizing: border-box; -webkit-font-smoothing: antialiased; }
        ::placeholder { color: rgba(12,12,13,0.3); }
      `}</style>

      {/* ── Nav ── */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "28px 5vw", position: "relative", zIndex: 2,
      }}>
        <span style={{ fontFamily: BODY, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.muted }}>
          SS26 Drop
        </span>
      </nav>

      {/* ── Hero ── */}
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: "10vh 5vw 8vh", position: "relative", zIndex: 2,
      }}>
        <motion.p
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}
          style={{
            fontFamily: BODY, fontSize: 11, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase",
            color: C.muted, margin: "0 0 20px",
          }}
        >
          Something's building
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.1 }}
          style={{
            fontFamily: DISPLAY, fontSize: "clamp(3.6rem, 14vw, 12rem)", textTransform: "uppercase",
            letterSpacing: "-0.04em", lineHeight: 0.85, margin: 0,
          }}
        >
          Coming<br />
          <span
            style={{
              color: C.yellow,
            }}
          >
            soon.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease, delay: 0.35 }}
          style={{ fontFamily: BODY, fontSize: 15, color: C.muted, maxWidth: 420, margin: "28px 0 40px", lineHeight: 1.6 }}
        >
          The merch shop is in the oven. Leave your email and we'll ping you the second it ships.
        </motion.p>

        {/* Notify form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease, delay: 0.45 }}
          style={{ width: "100%", maxWidth: 420 }}
        >
          {joined ? (
            <div style={{
              border: `1px solid ${C.faint}`, borderRadius: 12, padding: "18px 20px",
              fontFamily: BODY, fontSize: 13, fontWeight: 700, letterSpacing: "0.04em",
            }}>
              You're on the list ✓ — we'll email <span style={{ color: C.ink }}>{email}</span> at launch.
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", gap: 10 }}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                style={{
                  flex: 1, fontFamily: BODY, fontSize: 14, padding: "16px 18px",
                  borderRadius: 10, border: `1px solid ${C.faint}`, background: "transparent",
                  color: C.ink, outline: "none",
                }}
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  fontFamily: BODY, fontWeight: 900, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase",
                  background: C.ink, color: "#fff", border: "none", borderRadius: 10,
                  padding: "0 26px", cursor: "pointer", whiteSpace: "nowrap",
                }}
              >
                Notify me
              </motion.button>
            </form>
          )}
        </motion.div>
      </div>

      {/* ── Footer strip ── */}
      <Footer />
    </div>
  );
}
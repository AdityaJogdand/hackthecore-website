import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const images = [
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80",
  "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&q=80",
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&q=80",
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1], delay },
});

const About = () => {
  return (
    <section
      style={{
        background: "#1c1f1e",
        minHeight: "100vh",
        padding: "80px clamp(16px, 5vw, 60px)",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >


      {/* White rounded module card */}
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "relative",
          zIndex: 10,
          background: "#ffffff",
          borderRadius: "28px",
          padding: "clamp(32px, 5vw, 60px)",
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          boxShadow: "0 32px 80px rgba(0,0,0,0.45)",
        }}
      >
        {/* Top section: text + button */}
        {/* Top section: text + button */}
<div
  style={{
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: "32px",
    alignItems: "start",
    marginBottom: "48px",
  }}
>
  <div>
    {/* Eyebrow */}
    <motion.p
      {...fadeUp(0.15)}
      style={{
        fontFamily: "'Inter', sans-serif",
        fontWeight: 600,
        fontSize: "13px",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "#888",
        margin: "0 0 10px",
      }}
    >
      What is HackTheCore
    </motion.p>

    {/* Heading */}
    <motion.h2
      {...fadeUp(0.22)}
      style={{
        fontFamily: "'Anton', sans-serif",
        fontWeight: 400,
        fontSize: "clamp(2.8rem, 6vw, 5.5rem)",
        color: "#111",
        textTransform: "uppercase",
        lineHeight: 0.93,
        letterSpacing: "-0.02em",
        margin: "0 0 24px",
      }}
    >
      A Community Built For <span style={{ color: "#F4DD0E" }}>Innovators</span>
    </motion.h2>

    {/* Description */}
    <motion.p
      {...fadeUp(0.3)}
      style={{
        fontFamily: "'Inter', sans-serif",
        fontWeight: 400,
        fontSize: "clamp(0.9rem, 1.2vw, 1.05rem)",
        color: "#444",
        lineHeight: 1.85,
        margin: 0,
        maxWidth: "720px",
      }}
    >
      HackTheCore is a student-led technology community dedicated to empowering
      innovators, developers, designers, and problem-solvers. Through
      hackathons, workshops, mentorship programs, and collaborative projects,
      we create opportunities for individuals to learn, build, and grow while
      solving real-world challenges. Our mission is to foster innovation,
      encourage meaningful connections, and inspire the next generation of
      creators who are passionate about making an impact through technology.
    </motion.p>
  </div>

  {/* Explore Now button — top right */}
  <motion.div
    {...fadeUp(0.35)}
    style={{
      display: "flex",
      gap: "10px",
      alignItems: "center",
      paddingTop: "4px",
    }}
  >
    <button
      style={{
        fontFamily: "'Inter', sans-serif",
        fontWeight: 600,
        fontSize: "14px",
        background: "#111",
        color: "#fff",
        border: "none",
        borderRadius: "100px",
        padding: "12px 28px",
        cursor: "pointer",
        whiteSpace: "nowrap",
        letterSpacing: "0.02em",
        transition: "background 0.2s",
      }}
      onMouseEnter={(e) => {
        e.target.style.background = "#F4DD0E";
        e.target.style.color = "#111";
      }}
      onMouseLeave={(e) => {
        e.target.style.background = "#111";
        e.target.style.color = "#fff";
      }}
    >
      Explore Now
    </button>

    <button
      style={{
        width: "44px",
        height: "44px",
        borderRadius: "50%",
        border: "1.5px solid #ddd",
        background: "transparent",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#F4DD0E";
        e.currentTarget.style.borderColor = "#F4DD0E";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.borderColor = "#ddd";
      }}
    >
      <svg
        width="16"
        height="16"
        fill="none"
        stroke="#111"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <line x1="7" y1="17" x2="17" y2="7" />
        <polyline points="7 7 17 7 17 17" />
      </svg>
    </button>
  </motion.div>
</div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
          style={{
            height: "1px",
            background: "#eee",
            marginBottom: "36px",
            transformOrigin: "left",
          }}
        />

        {/* Image row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
          }}
        >
          {images.map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.4 + i * 0.1 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
              style={{
                borderRadius: "16px",
                overflow: "hidden",
                aspectRatio: "4/3",
                background: "#f0f0f0",
                position: "relative",
              }}
            >
              <img
                src={src}
                alt={`Hackathon ${i + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              {/* Subtle image overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.18) 0%, transparent 50%)",
                  borderRadius: "16px",
                }}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default About;
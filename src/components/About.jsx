import React from "react";
import { motion } from "framer-motion";

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
      <style>{`
        .about-top-grid {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 32px;
          align-items: start;
          margin-bottom: 48px;
        }

        .about-image-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .explore-btn-group {
          display: flex;
          gap: 10px;
          align-items: center;
          padding-top: 4px;
        }

        @media (max-width: 768px) {
          .about-top-grid {
            grid-template-columns: 1fr;
            gap: 24px;
            margin-bottom: 32px;
          }

          .about-image-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .explore-btn-group {
            padding-top: 0;
          }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
          .about-top-grid {
            grid-template-columns: 1fr;
            gap: 28px;
            margin-bottom: 40px;
          }

          .about-image-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 14px;
          }

          .about-image-grid > *:last-child {
            grid-column: 1 / -1;
          }

          .explore-btn-group {
            padding-top: 0;
          }
        }

        .explore-primary-btn {
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 14px;
          background: #111;
          color: #fff;
          border: none;
          border-radius: 100px;
          padding: 12px 28px;
          cursor: pointer;
          white-space: nowrap;
          letter-spacing: 0.02em;
          transition: background 0.2s, color 0.2s;
        }

        .explore-primary-btn:hover {
          background: #F4DD0E;
          color: #111;
        }

        .explore-icon-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1.5px solid #ddd;
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .explore-icon-btn:hover {
          background: #F4DD0E;
          border-color: #F4DD0E;
        }
      `}</style>

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
          padding: "clamp(24px, 5vw, 60px)",
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          boxShadow: "0 32px 80px rgba(0,0,0,0.45)",
        }}
      >
        {/* Top section: text + button */}
        <div className="about-top-grid">
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
                fontSize: "clamp(2rem, 6vw, 5.5rem)",
                color: "#111",
                textTransform: "uppercase",
                lineHeight: 0.93,
                letterSpacing: "-0.02em",
                margin: "0 0 24px",
              }}
            >
              A Community Built For{" "}
              <span style={{ color: "#F4DD0E" }}>Innovators</span>
            </motion.h2>

            {/* Description */}
            <motion.p
              {...fadeUp(0.3)}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                fontSize: "clamp(0.875rem, 1.2vw, 1.05rem)",
                color: "#444",
                lineHeight: 1.85,
                margin: 0,
                maxWidth: "720px",
              }}
            >
              HackTheCore is a student-led technology community dedicated to
              empowering innovators, developers, designers, and problem-solvers.
              Through hackathons, workshops, mentorship programs, and
              collaborative projects, we create opportunities for individuals to
              learn, build, and grow while solving real-world challenges. Our
              mission is to foster innovation, encourage meaningful connections,
              and inspire the next generation of creators who are passionate
              about making an impact through technology.
            </motion.p>
          </div>

          {/* Explore Now button */}
          <motion.div {...fadeUp(0.35)} className="explore-btn-group">
            <button className="explore-primary-btn">Explore Now</button>

            <button className="explore-icon-btn">
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
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.35,
          }}
          style={{
            height: "1px",
            background: "#eee",
            marginBottom: "36px",
            transformOrigin: "left",
          }}
        />

        {/* Image row */}
        <div className="about-image-grid">
          {images.map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.4 + i * 0.1,
              }}
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
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.18) 0%, transparent 50%)",
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
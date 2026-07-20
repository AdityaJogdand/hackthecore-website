import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "@/components/Footer";
import aboutUsImg from "@/assets/aboutus.jpeg";
import appleBtn from "@/assets/apple.png";
import playBtn from "@/assets/play.png";
import frontPhone from "@/assets/front.png";
import leftPhone from "@/assets/left.png";
import spons1 from "@/assets/spons1.png";
import spons2 from "@/assets/spons2.png";
import spons3 from "@/assets/spons3.png";
import spons4 from "@/assets/spons4.png";
import spons5 from "@/assets/spons5.png";
import spons6 from "@/assets/spons6.png";
import spons7 from "@/assets/spons7.png";
import spons8 from "@/assets/spons8.png";
import spons9 from "@/assets/spons9.png";
import person1 from "@/assets/Bhavesh.jpg";
import person2 from "@/assets/Meloni.jpg";
import person3 from "@/assets/Rahul.jpg";
import person4 from "@/assets/Rugved.jpg";
import person5 from "@/assets/Shravan.jpg";

const BODY = "'Geist Variable', sans-serif";
const ease = [0.22, 1, 0.36, 1];

const BENEFITS = [
  {
    num: "01",
    title: "Learn Beyond the Classroom",
    desc: "Access workshops, expert sessions, webinars, and technical content designed to help you stay ahead of the latest technologies.",
    color: "#F4DD0E", textColor: "#0C0C0D", mutedColor: "rgba(0,0,0,0.6)",
  },
  {
    num: "02",
    title: "Build Real Projects",
    desc: "Participate in hackathons, coding challenges, and collaborative projects that strengthen your portfolio and practical skills.",
    color: "#845EF7", textColor: "#fff", mutedColor: "rgba(255,255,255,0.65)",
  },
  {
    num: "03",
    title: "Network with Like-Minded Builders",
    desc: "Connect with students, developers, founders, mentors, and industry professionals who share your passion for technology.",
    color: "#20C997", textColor: "#0C0C0D", mutedColor: "rgba(0,0,0,0.6)",
  },
  {
    num: "04",
    title: "Internship & Career Opportunities",
    desc: "Get access to internship openings, hiring drives, referrals, and career opportunities through our industry partners.",
    color: "#0C0C0D", textColor: "#fff", mutedColor: "rgba(255,255,255,0.5)",
  },
  {
    num: "05",
    title: "Exclusive Community Events",
    desc: "Receive early access to hackathons, workshops, meetups, bootcamps, and invite-only community experiences.",
    color: "#FF6B6B", textColor: "#fff", mutedColor: "rgba(255,255,255,0.7)",
  },
  {
    num: "06",
    title: "Showcase Your Talent",
    desc: "Build your personal brand by participating in competitions, demos, open-source initiatives, and community projects.",
    color: "#54A0FF", textColor: "#fff", mutedColor: "rgba(255,255,255,0.7)",
  },
  {
    num: "07",
    title: "Member-Only Perks",
    desc: "Enjoy exclusive goodies, partner offers, software credits, discounts, giveaways, and special rewards available only to community members.",
    color: "#FF9F43", textColor: "#0C0C0D", mutedColor: "rgba(0,0,0,0.6)",
  },
  {
    num: "08",
    title: "Join a Growing Tech Ecosystem",
    desc: "Become part of a network of ambitious developers across colleges and cities who are passionate about learning and building together.",
    color: "#2ECC71", textColor: "#0C0C0D", mutedColor: "rgba(0,0,0,0.6)",
  },
  {
    num: "09",
    title: "Learn from Industry Experts",
    desc: "Interact with experienced engineers, founders, recruiters, and mentors through talks, AMAs, and mentorship sessions.",
    color: "#E84393", textColor: "#fff", mutedColor: "rgba(255,255,255,0.7)",
  },
  {
    num: "10",
    title: "Grow Every Step of the Journey",
    desc: "Whether you're a beginner or an experienced developer, Hackthecore grows with you at every stage of your path.",
    color: "#1C1C3A", textColor: "#fff", mutedColor: "rgba(255,255,255,0.5)",
  },
];

function BentoCard({ b, style, delay, large }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease, delay }}
      style={{
        background: b.color,
        borderRadius: 24,
        padding: large ? "clamp(32px, 4vw, 52px)" : "clamp(26px, 3vw, 40px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        overflow: "hidden",
        position: "relative",
        ...style,
      }}
    >
      {/* decorative circle */}
      <div style={{
        position: "absolute", bottom: -40, right: -40,
        width: large ? 220 : 140, height: large ? 220 : 140,
        borderRadius: "50%",
        background: b.textColor === "#fff" ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)",
        pointerEvents: "none",
      }} />

      <span style={{
        fontFamily: BODY, fontWeight: 800,
        fontSize: large ? "clamp(3rem, 6vw, 6rem)" : "clamp(2rem, 4vw, 4rem)",
        lineHeight: 1, letterSpacing: "-0.04em",
        color: b.textColor === "#fff" ? "rgba(255,255,255,0.13)" : "rgba(0,0,0,0.09)",
      }}>
        {b.num}
      </span>

      <div>
        <h3 style={{
          fontFamily: BODY, fontWeight: 800,
          fontSize: large ? "clamp(1.4rem, 2.4vw, 2rem)" : "clamp(1.05rem, 1.5vw, 1.3rem)",
          lineHeight: 1.15, letterSpacing: "-0.02em",
          color: b.textColor, margin: "0 0 10px",
        }}>
          {b.title}
        </h3>
        <p style={{
          fontFamily: BODY, fontWeight: 400,
          fontSize: large ? "0.97rem" : "0.87rem",
          lineHeight: 1.65, color: b.mutedColor, margin: 0,
          maxWidth: large ? 380 : "none",
        }}>
          {b.desc}
        </p>
      </div>
    </motion.div>
  );
}

function BenefitsSection() {
  return (
    <section style={{
      background: "#F7F6F1",
      padding: "clamp(80px, 12vw, 140px) clamp(24px, 6vw, 80px)",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease }}
          style={{ marginBottom: "clamp(40px, 6vw, 64px)" }}
        >
          <span style={{
            fontFamily: BODY, fontWeight: 600, fontSize: "0.72rem",
            letterSpacing: "0.18em", textTransform: "uppercase", color: "#8C8C89",
            display: "block", marginBottom: 16,
          }}>
            Why Join
          </span>
          <h2 style={{
            fontFamily: BODY, fontWeight: 800,
            fontSize: "clamp(2.6rem, 6vw, 5rem)",
            lineHeight: 1.0, letterSpacing: "-0.03em",
            color: "#0C0C0D", margin: 0,
          }}>
            Why join the<br />HackTheCore Community?
          </h2>
        </motion.div>

        {/* Row 1: large (2-col) + tall (1-col, 2-row) */}
        <div className="benefits-r1" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          <BentoCard b={BENEFITS[0]} large delay={0}    style={{ gridColumn: "1/3", minHeight: 280 }} />
          <BentoCard b={BENEFITS[1]} large delay={0.08} style={{ gridColumn: "3/4", gridRow: "1/3" }} />
          <BentoCard b={BENEFITS[2]}       delay={0.12} style={{ gridColumn: "1/2", minHeight: 240 }} />
          <BentoCard b={BENEFITS[3]}       delay={0.16} style={{ gridColumn: "2/3", minHeight: 240 }} />
        </div>

        {/* Row 2: 3 equal cards */}
        <div className="benefits-r2" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginTop: 16 }}>
          <BentoCard b={BENEFITS[4]} delay={0}    style={{ minHeight: 220 }} />
          <BentoCard b={BENEFITS[5]} delay={0.08} style={{ minHeight: 220 }} />
          <BentoCard b={BENEFITS[6]} delay={0.16} style={{ minHeight: 220 }} />
        </div>

        {/* Row 3: wide (2-col) + 1-col */}
        <div className="benefits-r3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginTop: 16 }}>
          <BentoCard b={BENEFITS[7]} large delay={0}    style={{ gridColumn: "1/3", minHeight: 240 }} />
          <BentoCard b={BENEFITS[8]}       delay={0.1}  style={{ minHeight: 240 }} />
        </div>

        {/* Row 4: full-width */}
        <div style={{ marginTop: 16 }}>
          <BentoCard b={BENEFITS[9]} large delay={0} style={{ minHeight: 200 }} />
        </div>

      </div>
      <style>{`
        @media (max-width: 900px) {
          .benefits-r1,
          .benefits-r2,
          .benefits-r3 {
            grid-template-columns: 1fr 1fr !important;
          }
          .benefits-r1 > *,
          .benefits-r3 > * {
            grid-column: auto !important;
            grid-row: auto !important;
          }
        }
        @media (max-width: 560px) {
          .benefits-r1,
          .benefits-r2,
          .benefits-r3 {
            grid-template-columns: 1fr !important;
          }
          .benefits-r1 > *,
          .benefits-r2 > *,
          .benefits-r3 > * {
            grid-column: 1 !important;
            grid-row: auto !important;
            min-height: 180px !important;
          }
        }
      `}</style>
    </section>
  );
}

const TESTIMONIALS = [
  {
    logo: spons1,
    company: "TechSpark",
    photo: person1,
    quote: "Partnering with HackTheCore gave us direct access to some of the sharpest student builders in India. The quality of projects and the energy of the community is unlike anything we've seen.",
    name: "Rohan Mehta",
    title: "Head of Developer Relations, TechSpark",
  },
  {
    logo: spons2,
    company: "BuildBase",
    photo: person2,
    quote: "The community HackTheCore has built is genuinely impressive. Engaged, curious, and ambitious — exactly the kind of builders we want to work with.",
    name: "Priya Nair",
    title: "Partnerships Lead, BuildBase",
  },
  {
    logo: spons3,
    company: "Launchpad",
    photo: person3,
    quote: "We sponsored our first hackathon through HackTheCore and came away with real hiring leads. The talent density in this community is exceptional.",
    name: "Aditya Kulkarni",
    title: "Engineering Manager, Launchpad",
  },
  {
    logo: spons4,
    company: "Nexora",
    photo: person4,
    quote: "HackTheCore doesn't just run events — they build lasting communities. Our brand reached thousands of engaged developers in a way no ad campaign could.",
    name: "Sneha Joshi",
    title: "Brand & Community, Nexora",
  },
  {
    logo: spons5,
    company: "Foundry",
    photo: person5,
    quote: "The level of organisation and professionalism HackTheCore brings to every hackathon made sponsoring a seamless, high-ROI experience for our team.",
    name: "Karan Singh",
    title: "Growth Lead, Foundry",
  },
];

function TestimonialCarousel() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef(null);

  const goTo = (idx, dir) => {
    setDirection(dir);
    setActive(idx);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setDirection(1);
      setActive(i => (i + 1) % TESTIMONIALS.length);
    }, 5500);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setDirection(1);
      setActive(i => (i + 1) % TESTIMONIALS.length);
    }, 5500);
    return () => clearInterval(timerRef.current);
  }, []);

  const t = TESTIMONIALS[active];

  const variants = {
    enter: (d) => ({ opacity: 0, x: d > 0 ? 48 : -48 }),
    center: { opacity: 1, x: 0 },
    exit:   (d) => ({ opacity: 0, x: d > 0 ? -48 : 48 }),
  };

  return (
    <section style={{
      background: "#ffffff",
      padding: "clamp(72px, 10vw, 120px) clamp(24px, 6vw, 80px)",
      overflow: "hidden",
    }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <p style={{
            fontFamily: BODY, fontWeight: 600, fontSize: "0.72rem",
            letterSpacing: "0.18em", textTransform: "uppercase",
            color: "#8C8C89", margin: "0 0 16px",
          }}>
            What Our Sponsors Say
          </p>
          <h2 style={{
            fontFamily: BODY, fontWeight: 800,
            fontSize: "clamp(2.4rem, 5.5vw, 4.5rem)",
            lineHeight: 1.05, letterSpacing: "-0.03em",
            color: "#0C0C0D", margin: 0,
          }}>
            Trusted by the<br />brands that build.
          </h2>
        </motion.div>

        {/* Card */}
        <div style={{ position: "relative" }}>
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={active}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease }}
              className="testimonial-card"
              style={{
                background: "#fff",
                borderRadius: 24,
                padding: "clamp(28px, 4vw, 48px) clamp(28px, 5vw, 56px)",
                boxShadow: "0 8px 48px rgba(0,0,0,0.07)",
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: "clamp(24px, 4vw, 60px)",
                alignItems: "center",
              }}
            >
              {/* Left: logo + quote + attribution */}
              <div>
                {/* Logo row */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
                  <img
                    src={t.logo}
                    alt={t.company}
                    style={{ height: 28, width: "auto", objectFit: "contain" }}
                  />
                </div>

                {/* Quote */}
                <p style={{
                  fontFamily: BODY, fontWeight: 500,
                  fontSize: "clamp(1.05rem, 2vw, 1.35rem)",
                  lineHeight: 1.65, letterSpacing: "-0.015em",
                  color: "#0C0C0D", margin: "0 0 28px",
                }}>
                  {t.quote}
                </p>

                {/* Attribution */}
                <div>
                  <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: "0.9rem", color: "#0C0C0D" }}>
                    — {t.name}
                  </div>
                  <div style={{ fontFamily: BODY, fontWeight: 400, fontSize: "0.82rem", color: "#8C8C89", marginTop: 4 }}>
                    {t.title}
                  </div>
                </div>
              </div>

              {/* Right: circular photo */}
              <div className="testimonial-photo" style={{
                width: "clamp(120px, 14vw, 200px)",
                height: "clamp(120px, 14vw, 200px)",
                borderRadius: "50%",
                overflow: "hidden",
                flexShrink: 0,
              }}>
                <img
                  src={t.photo}
                  alt={t.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginTop: 28,
        }}>
          {/* Dots */}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i, i > active ? 1 : -1)}
                style={{
                  width: i === active ? 28 : 8, height: 8,
                  borderRadius: 4, border: "none", cursor: "pointer", padding: 0,
                  background: i === active ? "#0C0C0D" : "#C8C4BB",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>

          {/* Arrows */}
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { label: "prev", path: "M15 18l-6-6 6-6", onClick: () => goTo((active - 1 + TESTIMONIALS.length) % TESTIMONIALS.length, -1) },
              { label: "next", path: "M9 18l6-6-6-6",   onClick: () => goTo((active + 1) % TESTIMONIALS.length, 1) },
            ].map(({ label, path, onClick }) => (
              <button
                key={label}
                onClick={onClick}
                style={{
                  width: 44, height: 44, borderRadius: "50%",
                  border: "1.5px solid #C8C4BB", background: "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", transition: "border-color 0.2s, background 0.2s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "#0C0C0D";
                  e.currentTarget.style.background = "#0C0C0D";
                  e.currentTarget.querySelector("path").style.stroke = "#fff";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "#C8C4BB";
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.querySelector("path").style.stroke = "#0C0C0D";
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d={path} stroke="#0C0C0D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 0.2s" }} />
                </svg>
              </button>
            ))}
          </div>
        </div>

      </div>
      <style>{`
        @media (max-width: 640px) {
          .testimonial-card {
            grid-template-columns: 1fr !important;
          }
          .testimonial-photo {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}

export default function Community() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  return (
    <div style={{ background: "#ffffff", fontFamily: BODY, color: "#0C0C0D", overflowX: "hidden" }}>

      {/* ── Hero — Bento Grid ── */}
      <section style={{
        background: "#f5f5f0",
        padding: "clamp(80px, 10vh, 120px) clamp(20px, 4vw, 60px) clamp(60px, 8vh, 100px)",
      }}>
        <div className="hero-bento" style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1.15fr 1fr",
          gridTemplateRows: "1fr auto",
          gap: 20,
          minHeight: "clamp(520px, 68vh, 720px)",
        }}>

          {/* ── 1: Header card — lime, top-left ── */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease }}
            style={{
              gridColumn: "1", gridRow: "1",
              background: "#b6f03c",
              borderRadius: 28,
              padding: "clamp(36px, 5vw, 56px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* Decorative rings */}
            <div style={{
              position: "absolute", bottom: -80, right: -80,
              width: 340, height: 340, borderRadius: "50%",
              border: "1px solid rgba(0,0,0,0.07)", pointerEvents: "none",
            }} />
            <div style={{
              position: "absolute", bottom: -36, right: -36,
              width: 190, height: 190, borderRadius: "50%",
              border: "1px solid rgba(0,0,0,0.05)", pointerEvents: "none",
            }} />

            {/* Label */}
            <span style={{
              fontFamily: BODY, fontWeight: 600, fontSize: "0.7rem",
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: "rgba(12,12,13,0.45)",
            }}>
              HackTheCore Community
            </span>

            {/* Headline + subtitle + CTA */}
            <div>
              <h1 style={{
                fontFamily: BODY, fontWeight: 800,
                fontSize: "clamp(2.4rem, 4.5vw, 4rem)",
                lineHeight: 1.06, letterSpacing: "-0.035em",
                color: "#0C0C0D", margin: "0 0 20px",
              }}>
                Find your{" "}
                <span style={{
                  background: "#fff", borderRadius: 10,
                  padding: "2px 10px", display: "inline-block", lineHeight: 1.2,
                }}>
                  tribe
                </span>
                ,<br />build your network.
              </h1>
              <p style={{
                fontFamily: BODY, fontWeight: 400,
                fontSize: "clamp(0.875rem, 1.1vw, 1rem)",
                lineHeight: 1.68, color: "rgba(12,12,13,0.58)",
                margin: "0 0 32px", maxWidth: 400,
              }}>
                HackTheCore is built for student builders — find teammates,
                hackathons, mentors, and real opportunities, all in one place.
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/signup")}
                style={{
                  background: "#0C0C0D", color: "#fff",
                  fontFamily: BODY, fontWeight: 700, fontSize: "0.9rem",
                  border: "none", borderRadius: 50,
                  padding: "14px 28px", cursor: "pointer",
                  letterSpacing: "0.01em",
                }}
              >
                Get started →
              </motion.button>
            </div>
          </motion.div>

          {/* ── 2: Number / stats card — bottom-left ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.22 }}
            className="hero-stats-bar"
            style={{
              gridColumn: "1", gridRow: "2",
              background: "#0C0C0D",
              borderRadius: 28,
              padding: "clamp(24px, 3vw, 36px) clamp(28px, 4vw, 44px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 24,
              overflow: "hidden",
              position: "relative",
              flexWrap: "wrap",
            }}
          >
            {/* Ghost watermark */}
            <span style={{
              position: "absolute", right: -10, top: "50%",
              transform: "translateY(-50%)",
              fontFamily: BODY, fontWeight: 900,
              fontSize: "clamp(5rem, 10vw, 8.5rem)",
              lineHeight: 1, letterSpacing: "-0.06em",
              color: "rgba(255,255,255,0.04)",
              userSelect: "none", pointerEvents: "none",
              whiteSpace: "nowrap",
            }}>
              500+
            </span>

            {/* Left: big number */}
            <div style={{ flexShrink: 0 }}>
              <div style={{
                fontFamily: BODY, fontWeight: 900,
                fontSize: "clamp(2.8rem, 5vw, 4rem)",
                lineHeight: 1, letterSpacing: "-0.05em",
                color: "#b6f03c",
              }}>
                500+
              </div>
              <div style={{
                fontFamily: BODY, fontWeight: 500, fontSize: "0.88rem",
                color: "rgba(255,255,255,0.55)", marginTop: 6,
              }}>
                Active builders
              </div>
            </div>

            {/* Divider */}
            <div style={{
              width: 1, alignSelf: "stretch",
              background: "rgba(255,255,255,0.1)", flexShrink: 0,
            }} />

            {/* Right: avatars + stars */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, flexShrink: 0 }}>
              <div style={{ display: "flex" }}>
                {[person1, person2, person3, person4, person5].map((src, i) => (
                  <img key={i} src={src} alt="" style={{
                    width: 32, height: 32, borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #0C0C0D",
                    marginLeft: i === 0 ? 0 : -9,
                  }} />
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ display: "flex", gap: 2 }}>
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#00B67A">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
                <span style={{
                  fontFamily: BODY, fontWeight: 500, fontSize: "0.72rem",
                  color: "rgba(255,255,255,0.4)",
                }}>
                  Excellent
                </span>
              </div>
            </div>

            {/* Right: 1200+ stat */}
            <div style={{ flexShrink: 0 }}>
              <div style={{
                fontFamily: BODY, fontWeight: 900,
                fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                lineHeight: 1, letterSpacing: "-0.04em",
                color: "#fff",
              }}>
                1200+
              </div>
              <div style={{
                fontFamily: BODY, fontWeight: 500, fontSize: "0.78rem",
                color: "rgba(255,255,255,0.45)", marginTop: 6,
              }}>
                Members
              </div>
            </div>
          </motion.div>

          {/* ── 3: Photo card — right, spans both rows ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.0, ease, delay: 0.1 }}
            style={{
              gridColumn: "2", gridRow: "1 / 3",
              borderRadius: 28,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <img
              src={aboutUsImg}
              alt="HackTheCore Community"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
            {/* bottom gradient for depth */}
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.22) 0%, transparent 50%)",
              pointerEvents: "none",
            }} />
          </motion.div>

        </div>

        <style>{`
          @media (max-width: 800px) {
            .hero-bento {
              grid-template-columns: 1fr !important;
              grid-template-rows: auto !important;
              min-height: unset !important;
            }
            .hero-bento > *:nth-child(1) { min-height: 340px; }
            .hero-bento > *:nth-child(3) {
              grid-column: 1 !important;
              grid-row: auto !important;
              min-height: 280px;
            }
          }
          @media (max-width: 480px) {
            .hero-stats-bar {
              justify-content: flex-start !important;
              gap: 16px !important;
            }
            .hero-stats-bar > [style*="width: 1px"] {
              display: none;
            }
          }
        `}</style>
      </section>

      {/* ── Mobile App Showcase ── */}
      <section style={{
        background: "#0C0C0D",
        padding: "clamp(80px, 12vw, 140px) clamp(24px, 8vw, 100px)",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background glow */}
        <div style={{
          position: "absolute", top: "20%", right: "15%",
          width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(244,221,14,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "10%", left: "5%",
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(244,221,14,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div className="app-showcase-grid" style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(40px, 6vw, 80px)",
          alignItems: "center",
        }}>

          {/* ── Left: copy + features + store buttons ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease }}
            style={{ display: "flex", flexDirection: "column", gap: 32 }}
          >
            {/* Badge */}
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontFamily: BODY, fontWeight: 600, fontSize: "0.72rem",
              letterSpacing: "0.16em", textTransform: "uppercase",
              color: "#F4DD0E",
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: "50%",
                background: "#F4DD0E",
                boxShadow: "0 0 8px #F4DD0E",
                display: "inline-block",
              }} />
              Now on Mobile
            </span>

            {/* Headline */}
            <h2 style={{
              fontFamily: BODY, fontWeight: 800,
              fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)",
              lineHeight: 1.08, letterSpacing: "-0.03em",
              color: "#fff", margin: 0,
            }}>
              The Community,<br />In Your Pocket.
            </h2>

            {/* Subtitle */}
            <p style={{
              fontFamily: BODY, fontWeight: 400, fontSize: "1rem",
              lineHeight: 1.7, color: "rgba(255,255,255,0.5)", margin: 0,
              maxWidth: 420,
            }}>
              Find teammates, join hackathons, and stay plugged into
              what the builder community is shipping — all from the app.
            </p>

            {/* Feature list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                "Instant teammate matching",
                "Live hackathon feed & registration",
                "Showcase & track your builds",
                "Community discussions & networking",
              ].map((label) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
                    background: "#F4DD0E",
                  }} />
                  <span style={{
                    fontFamily: BODY, fontWeight: 500, fontSize: "0.95rem",
                    color: "rgba(255,255,255,0.75)",
                  }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Store buttons */}
            <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
              <a
                href="https://apps.apple.com/in/app/hack-the-core/id6758599070"
                target="_blank" rel="noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  padding: "0.5rem 1rem 0.5rem 0.8rem",
                  borderRadius: 8, border: "1px solid rgba(255,255,255,0.18)",
                  background: "#111", textDecoration: "none", color: "#fff",
                  transition: "border-color 0.18s",
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#F4DD0E"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"}
              >
                <img src={appleBtn} alt="Apple" style={{ width: 18, height: 22, objectFit: "contain", flexShrink: 0 }} />
                <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
                  <span style={{ fontSize: "0.6rem", letterSpacing: "0.04em", color: "rgba(255,255,255,0.6)" }}>Download on the</span>
                  <span style={{ fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.01em" }}>App Store</span>
                </div>
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.unitecloud.hackthecore.app&hl=en_IN"
                target="_blank" rel="noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  padding: "0.5rem 1rem 0.5rem 0.8rem",
                  borderRadius: 8, border: "1px solid rgba(255,255,255,0.18)",
                  background: "#111", textDecoration: "none", color: "#fff",
                  transition: "border-color 0.18s",
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#F4DD0E"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"}
              >
                <img src={playBtn} alt="Google Play" style={{ width: 22, height: 24, objectFit: "contain", flexShrink: 0 }} />
                <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
                  <span style={{ fontSize: "0.6rem", letterSpacing: "0.04em", color: "rgba(255,255,255,0.6)" }}>GET IT ON</span>
                  <span style={{ fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.01em" }}>Google Play</span>
                </div>
              </a>
            </div>
          </motion.div>

          {/* ── Right: phone mockups ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease, delay: 0.1 }}
            className="app-phone-wrapper"
            style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center", minHeight: 560 }}
          >
            {/* Glow ring behind phones */}
            <div style={{
              position: "absolute",
              width: 320, height: 320,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(244,221,14,0.15) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />

            {/* Front phone (front.png) — right side, behind */}
            <div style={{ position: "absolute", left: "50%", transform: "translateX(5%)", zIndex: 4 }}>
              <motion.img
                src={frontPhone}
                alt="App screen front"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="app-phone-front"
                style={{
                  width: 260,
                  display: "block",
                  filter: "drop-shadow(0 60px 100px rgba(0,0,0,0.5))",
                }}
              />
            </div>

            {/* Left phone (left.png) — left side, in front */}
            <div style={{ position: "absolute", left: "50%", transform: "translateX(-70%) rotate(-10deg)", zIndex: 3 }}>
              <motion.img
                src={leftPhone}
                alt="App screen"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="app-phone-left"
                style={{
                  width: 300,
                  display: "block",
                  filter: "drop-shadow(0 40px 80px rgba(0,0,0,0.7))",
                }}
              />
            </div>

          </motion.div>

        </div>

        {/* Responsive override for mobile */}
        <style>{`
          @media (max-width: 720px) {
            .app-showcase-grid { grid-template-columns: 1fr !important; }
            .app-phone-wrapper { min-height: 380px !important; }
            .app-phone-front { width: 180px !important; }
            .app-phone-left { width: 180px !important; }
          }
          @media (max-width: 400px) {
            .app-phone-wrapper { min-height: 320px !important; }
            .app-phone-front { width: 150px !important; }
            .app-phone-left { width: 150px !important; }
          }
        `}</style>
      </section>

      {/* ── Benefits of Joining ── */}
      <BenefitsSection />

      {/* ── Sponsor Testimonials Carousel ── */}
      <TestimonialCarousel />

      <Footer />
    </div>
  );
}

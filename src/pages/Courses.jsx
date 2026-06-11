import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const courses = [
  {
    id: 1,
    tag: "Most Popular",
    title: "Full-Stack Development",
    desc: "Build end-to-end web apps with React, Node.js, and PostgreSQL.",
    duration: "12 Weeks",
    level: "Intermediate",
    number: "01",
  },
  {
    id: 2,
    tag: "New",
    title: "AI & Machine Learning",
    desc: "From regression to transformers — hands-on with Python & PyTorch.",
    duration: "10 Weeks",
    level: "Advanced",
    number: "02",
  },
  {
    id: 3,
    tag: null,
    title: "Cybersecurity",
    desc: "Offensive and defensive techniques. CTF-ready from day one.",
    duration: "8 Weeks",
    level: "Intermediate",
    number: "03",
  },
  {
    id: 4,
    tag: null,
    title: "Cloud & DevOps",
    desc: "AWS, Docker, Kubernetes, CI/CD and infrastructure as code.",
    duration: "8 Weeks",
    level: "Intermediate",
    number: "04",
  },
  {
    id: 5,
    tag: null,
    title: "UI/UX Design",
    desc: "Design systems, Figma, prototyping, and user research fundamentals.",
    duration: "6 Weeks",
    level: "Beginner",
    number: "05",
  },
  {
    id: 6,
    tag: null,
    title: "Blockchain & Web3",
    desc: "Smart contracts, Solidity, DeFi protocols and decentralized apps.",
    duration: "9 Weeks",
    level: "Advanced",
    number: "06",
  },
];

const stats = [
  { value: "40+", label: "Courses" },
  { value: "200+", label: "Hours" },
  { value: "10K+", label: "Students" },
  { value: "98%", label: "Completion" },
];

const Courses = () => {
  const [hoveredId, setHoveredId] = useState(null);
  const [openId, setOpenId] = useState(null);

  const ease = [0.22, 1, 0.36, 1];

  const handleRowClick = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <>
      <Navbar />

      {/* ── HERO ── */}
      <section className="w-full bg-[#0C0C0D] min-h-screen flex flex-col justify-end pb-24 px-6 sm:px-8 pt-28 sm:pt-32">
        <div className="mx-auto max-w-7xl w-full py-6">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="flex items-center gap-3 mb-6 sm:mb-8"
          >
            <span className="w-6 sm:w-8 h-[2px] bg-[#FFFF00]" />
            <span
              className="text-[#FFFF00] text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] sm:tracking-[0.3em]"
              style={{ fontFamily: "Barlow, sans-serif" }}
            >
              HackTheCore Academy
            </span>
          </motion.div>

          {/* Main heading */}
          <div className="overflow-hidden mb-8 sm:mb-12 pb-10">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, ease }}
              className="font-black uppercase text-white text-center"
              style={{
                fontFamily: "'SansPlomb', sans-serif",
                fontSize: "clamp(6rem, 16vw, 14rem)",
                lineHeight: 0.85,
                letterSpacing: "-0.03em",
              }}
            >
              MASTER <span className="text-[#FFFF00]">YOUR</span>
              <br />
              CRAFT.
            </motion.h1>
          </div>

          {/* Bottom row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease }}
            className="flex flex-col gap-6 mt-8 sm:mt-12 border-t border-white/10 pt-6 sm:pt-8"
          >
            <p
              className="text-white/50 text-sm sm:text-base md:text-lg max-w-md leading-relaxed mt-2"
              style={{ fontFamily: "Barlow, sans-serif" }}
            >
              Industry-vetted curricula built by engineers, for engineers.
              No fluff. Pure signal.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-3 sm:gap-6 md:gap-10 md:flex md:justify-end">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + i * 0.08, ease }}
                  className="text-left md:text-right"
                >
                  <p
                    className="text-xl sm:text-2xl md:text-3xl font-black text-[#FFFF00]"
                    style={{ fontFamily: "Barlow, sans-serif" }}
                  >
                    {s.value}
                  </p>
                  <p
                    className="text-white/40 text-[9px] sm:text-xs uppercase tracking-widest mt-0.5 sm:mt-1"
                    style={{ fontFamily: "Barlow, sans-serif" }}
                  >
                    {s.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="bg-[#FFFF00] py-2.5 sm:py-3 overflow-hidden">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="flex gap-8 sm:gap-12 whitespace-nowrap"
        >
          {Array(8)
            .fill(null)
            .map((_, i) => (
              <span
                key={i}
                className="text-[#0C0C0D] text-xs sm:text-sm font-black uppercase tracking-widest"
                style={{ fontFamily: "Barlow, sans-serif" }}
              >
                Full-Stack &nbsp;·&nbsp; AI/ML &nbsp;·&nbsp; Cybersecurity
                &nbsp;·&nbsp; Cloud &nbsp;·&nbsp; DevOps &nbsp;·&nbsp; UI/UX
                &nbsp;·&nbsp; Web3 &nbsp;·&nbsp; Mobile &nbsp;·&nbsp;
              </span>
            ))}
        </motion.div>
      </div>

      {/* ── COURSES LIST ── */}
      <section className="bg-[#0C0C0D] px-4 sm:px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl">
          {/* Section label */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 mb-10 sm:mb-16"
          >
            <h2
              className="text-white/20 text-[10px] sm:text-sm font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] whitespace-nowrap"
              style={{ fontFamily: "Barlow, sans-serif" }}
            >
              All Courses — {courses.length} Programs
            </h2>
            <span className="w-full h-[1px] bg-white/10" />
          </motion.div>

          {/* Course rows */}
          <div className="flex flex-col">
            {courses.map((course, i) => {
              const isHovered = hoveredId === course.id;
              const isOpen = openId === course.id;
              const isActive = isHovered || isOpen;

              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.5, delay: i * 0.07, ease }}
                  onHoverStart={() => setHoveredId(course.id)}
                  onHoverEnd={() => setHoveredId(null)}
                  onClick={() => handleRowClick(course.id)}
                  className="group relative border-t border-white/10 cursor-pointer"
                  style={{
                    borderBottom:
                      i === courses.length - 1
                        ? "1px solid rgba(255,255,255,0.1)"
                        : undefined,
                  }}
                >
                  {/* Hover / active fill */}
                  <motion.div
                    className="absolute inset-0 bg-[#FFFF00]"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isActive ? 1 : 0 }}
                    transition={{ duration: 0.4, ease }}
                    style={{ originX: 0 }}
                  />

                  {/* Main row */}
                  <div className="relative z-10 flex items-center gap-3 sm:gap-6 md:gap-10 px-1 sm:px-2 py-4 sm:py-5">
                    {/* Number */}
                    <span
                      className="text-[10px] sm:text-xs font-bold transition-colors duration-300 w-5 sm:w-6 flex-shrink-0"
                      style={{
                        fontFamily: "Barlow, sans-serif",
                        color: isActive
                          ? "#0C0C0D"
                          : "rgba(255,255,255,0.25)",
                      }}
                    >
                      {course.number}
                    </span>

                    {/* Title */}
                    <h3
                      className="font-black uppercase transition-colors duration-300 flex-1 leading-none"
                      style={{
                        fontFamily: "Barlow, sans-serif",
                        fontSize: "clamp(1.05rem, 3.5vw, 2.4rem)",
                        letterSpacing: "-0.02em",
                        color: isActive ? "#0C0C0D" : "#ffffff",
                      }}
                    >
                      {course.title}
                    </h3>

                    {/* Tag — hidden on small mobile, shown sm+ */}
                    <div className="hidden sm:block flex-shrink-0 w-[100px] md:w-[110px]">
                      {course.tag && (
                        <span
                          className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full transition-all duration-300 whitespace-nowrap"
                          style={{
                            fontFamily: "Barlow, sans-serif",
                            background: isActive ? "#0C0C0D" : "transparent",
                            color: "#FFFF00",
                            border: "1px solid rgba(255,255,0,0.4)",
                            display: "inline-block",
                          }}
                        >
                          {course.tag}
                        </span>
                      )}
                    </div>

                    {/* Meta — hidden on mobile */}
                    <div className="hidden md:flex items-center gap-4 lg:gap-6 flex-shrink-0 w-40 lg:w-48 justify-end">
                      <span
                        className="text-xs lg:text-sm transition-colors duration-300"
                        style={{
                          fontFamily: "Barlow, sans-serif",
                          color: isActive
                            ? "#0C0C0D"
                            : "rgba(255,255,255,0.4)",
                        }}
                      >
                        {course.duration}
                      </span>
                      <span
                        className="text-xs lg:text-sm transition-colors duration-300"
                        style={{
                          fontFamily: "Barlow, sans-serif",
                          color: isActive
                            ? "#0C0C0D"
                            : "rgba(255,255,255,0.4)",
                        }}
                      >
                        {course.level}
                      </span>
                    </div>

                    {/* Arrow — always visible, rotates on mobile open */}
                    <motion.span
                      animate={{
                        opacity: 1,
                        rotate: isOpen && !isHovered ? 90 : 0,
                        color: isActive ? "#0C0C0D" : "rgba(255,255,255,0.3)",
                      }}
                      transition={{ duration: 0.25 }}
                      className="text-base sm:text-xl font-black flex-shrink-0"
                    >
                      →
                    </motion.span>
                  </div>

                  {/* Expandable desc */}
                  <motion.div
                    animate={{
                      height: isActive ? "auto" : 0,
                      opacity: isActive ? 1 : 0,
                    }}
                    transition={{ duration: 0.25, ease }}
                    className="overflow-hidden relative z-10 px-1 sm:px-2"
                    style={{
                      paddingLeft: "calc(0.25rem + 1.25rem + 0.75rem)",
                    }}
                  >
                    {/* Mobile-only meta inside expand */}
                    <div className="flex flex-wrap gap-2 mb-2 md:hidden">
                      {course.tag && (
                        <span
                          className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
                          style={{
                            fontFamily: "Barlow, sans-serif",
                            background: "#0C0C0D",
                            color: "#FFFF00",
                            border: "1px solid rgba(255,255,0,0.4)",
                          }}
                        >
                          {course.tag}
                        </span>
                      )}
                      <span
                        className="text-[10px] font-semibold text-[#0C0C0D]/60 uppercase tracking-wide"
                        style={{ fontFamily: "Barlow, sans-serif" }}
                      >
                        {course.duration} · {course.level}
                      </span>
                    </div>

                    <p
                      className="text-[#0C0C0D]/60 text-xs sm:text-sm pb-4 sm:pb-5 leading-relaxed"
                      style={{ fontFamily: "Barlow, sans-serif" }}
                    >
                      {course.desc}
                    </p>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA STRIP ── */}
      <section className="bg-[#0C0C0D] px-4 sm:px-6 pb-16 sm:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease }}
          className="mx-auto max-w-7xl bg-[#FFFF00] rounded-[24px] sm:rounded-[32px] p-8 sm:p-12 md:p-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
        >
          <div>
            <p
              className="text-[#0C0C0D]/50 text-[10px] sm:text-sm font-bold uppercase tracking-widest mb-2 sm:mb-3"
              style={{ fontFamily: "Barlow, sans-serif" }}
            >
              Ready to start?
            </p>
            <h2
              className="text-[#0C0C0D] font-black uppercase"
              style={{
                fontFamily: "Barlow, sans-serif",
                fontSize: "clamp(1.8rem, 5vw, 4rem)",
                lineHeight: 0.95,
                letterSpacing: "-0.03em",
              }}
            >
              BUILD SOMETHING
              <br />
              REAL.
            </h2>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex-shrink-0 bg-[#0C0C0D] text-white font-black uppercase px-7 sm:px-10 py-4 sm:py-5 rounded-full text-sm sm:text-base lg:text-lg tracking-tight w-full md:w-auto text-center"
            style={{ fontFamily: "Barlow, sans-serif" }}
          >
            Enroll Now →
          </motion.button>
        </motion.div>
      </section>
    </>
  );
};

export default Courses;
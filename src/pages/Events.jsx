import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";

const events = [
  {
    id: 1,
    tag: "Featured",
    title: "Tech Summit 2026",
    desc: "Meet founders, developers and recruiters from top companies. Three days of talks, workshops and networking.",
    date: "Aug 14–16",
    type: "Conference",
    number: "01",
    thumbnail: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=400&h=260&fit=crop",
  },
  {
    id: 2,
    tag: "New",
    title: "GenAI Workshop",
    desc: "Hands-on sessions with the latest generative AI tools. Build, fine-tune, and deploy your first AI pipeline.",
    date: "Jul 5",
    type: "Workshop",
    number: "02",
    thumbnail: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?q=80&w=400&h=260&fit=crop",
  },
  {
    id: 3,
    tag: null,
    title: "48H Hackathon",
    desc: "Two days. One problem. Infinite solutions. Form a team and build something real from scratch.",
    date: "Jul 19–20",
    type: "Hackathon",
    number: "03",
    thumbnail: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=400&h=260&fit=crop",
  },
  {
    id: 4,
    tag: null,
    title: "Networking Lounge",
    desc: "Connect with recruiters, startups and founders in a relaxed format. No slides — just conversations.",
    date: "Aug 14",
    type: "Networking",
    number: "04",
    thumbnail: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=400&h=260&fit=crop",
  },
  {
    id: 5,
    tag: null,
    title: "Startup Pitch Night",
    desc: "Watch early-stage founders pitch live to a panel of investors. Open floor Q&A after every pitch.",
    date: "Aug 15",
    type: "Pitch",
    number: "05",
    thumbnail: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=400&h=260&fit=crop",
  },
  {
    id: 6,
    tag: null,
    title: "Careers in Tech Panel",
    desc: "Engineers, PMs and designers share candid advice on breaking in, leveling up, and staying sane.",
    date: "Aug 16",
    type: "Panel",
    number: "06",
    thumbnail: "https://images.unsplash.com/photo-1558403194-611308249627?q=80&w=400&h=260&fit=crop",
  },
];

const Events = () => {
  const [phase, setPhase] = useState(0);
  const [hoveredId, setHoveredId] = useState(null);
  const [openId, setOpenId] = useState(null);
  const [stats, setStats] = useState({
    attendees: 0,
    speakers: 0,
    hackathon: 0,
    partners: 0,
  });
  const [hasAnimated, setHasAnimated] = useState(false);
  const statsRef = useRef(null);

  // Hero phase transitions
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 800);
    const t2 = setTimeout(() => setPhase(2), 1800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Stats counter — fires only when section scrolls into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          const targets = {
            attendees: 5000,
            speakers: 120,
            hackathon: 48,
            partners: 25,
          };

          const duration = 1000;
          const steps = 50;
          const intervalMs = duration / steps;

          const counter = setInterval(() => {
            setStats((prev) => {
              const next = {
                attendees: Math.min(
                  targets.attendees,
                  prev.attendees + Math.ceil(targets.attendees / steps)
                ),
                speakers: Math.min(
                  targets.speakers,
                  prev.speakers + Math.ceil(targets.speakers / steps)
                ),
                hackathon: Math.min(
                  targets.hackathon,
                  prev.hackathon + Math.ceil(targets.hackathon / steps)
                ),
                partners: Math.min(
                  targets.partners,
                  prev.partners + Math.ceil(targets.partners / steps)
                ),
              };

              const done = Object.keys(targets).every(
                (k) => next[k] >= targets[k]
              );
              if (done) clearInterval(counter);

              return next;
            });
          }, intervalMs);
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  const FONT = "clamp(7.5rem, 16vw, 13.5rem)";
  const ease = [0.22, 1, 0.36, 1];

  const handleRowClick = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <>
      <Navbar />

      {/* ── HERO ── */}
      <section className="w-full bg-[#0C0C0D] px-6 pt-6 pb-0">
        <div className="relative h-[100vh] w-full overflow-hidden rounded-[36px] bg-[#0C0C0D] mt-5">
          {/* IMAGE */}
          <motion.div
            initial={{ width: 0, height: 0, opacity: 0 }}
            animate={
              phase === 1
                ? { width: 500, height: 380, opacity: 1 }
                : phase === 2
                ? { width: "99%", height: "85%", opacity: 1 }
                : {}
            }
            transition={{ duration: 1.2, ease }}
            className="absolute left-1/2 top-1/2 z-10 overflow-hidden rounded-[28px]"
            style={{ x: "-50%", y: "-50%" }}
          >
            <img
              src="https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2000"
              alt=""
              className="h-full w-full object-cover"
            />
          </motion.div>

          {/* TEXT */}
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center">
            <motion.h1
              initial={{ y: 0 }}
              animate={
                phase === 1 ? { y: -120 } : phase === 2 ? { y: 0 } : { y: 0 }
              }
              transition={{ duration: 1, ease }}
              className="font-black uppercase text-[#FFFF00]"
              style={{
                fontFamily: "'SansPlomb', sans-serif",
                fontSize: FONT,
                lineHeight: 0.88,
                letterSpacing: "-0.02em",
              }}
            >
              SHOW UP
            </motion.h1>

            <motion.h1
              initial={{ y: 0 }}
              animate={
                phase === 1 ? { y: 120 } : phase === 2 ? { y: 0 } : { y: 0 }
              }
              transition={{ duration: 1, ease }}
              className="font-black uppercase text-[#FFFF00]"
              style={{ fontSize: FONT, lineHeight: 0.88, letterSpacing: "-0.02em", fontFamily: "'SansPlomb', sans-serif" }}
            >
              STAND OUT
            </motion.h1>
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE INTRO ── */}
      <section className="bg-[#0C0C0D] px-6 pt-24 pb-12">
        <div className="max-w-7xl mx-auto">

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid lg:grid-cols-2 gap-16 items-center"
          >
            {/* Left */}
            <div>
              <p className="text-[#FFFF00] uppercase tracking-[0.3em] text-xs mb-5 font-bold">
                Why Attend
              </p>
              <h2
                className="text-white font-black uppercase leading-none"
                style={{
                  fontSize: "clamp(2.5rem,6vw,5rem)",
                  letterSpacing: "-0.04em",
                }}
              >
                BUILD.
                <br />
                CONNECT.
                <br />
                GROW.
              </h2>
            </div>

            {/* Right */}
            <div>
              <p className="text-white/60 text-lg leading-relaxed max-w-xl">
                Join innovators, founders, developers and creators for three
                unforgettable days of ideas, collaboration and opportunities.
                From AI workshops to startup pitches, every event is designed
                to help you level up.
              </p>
            </div>
          </motion.div>

          {/* Stats — ref attached here so observer watches this grid */}
          <div
            ref={statsRef}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
          >
            {[
              [`${stats.attendees.toLocaleString()}+`, "Attendees"],
              [`${stats.speakers}+`, "Speakers"],
              [`${stats.hackathon}H`, "Hackathon"],
              [`${stats.partners}+`, "Partners"],
            ].map(([value, label]) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="border border-white/10 rounded-3xl p-8 cursor-pointer"
                whileHover={{
                  y: -8,
                  borderColor: "rgba(255,255,0,0.35)",
                }}
                transition={{ duration: 0.25 }}
              >
                <h3 className="text-[#FFFF00] text-5xl font-black mb-2">
                  {value}
                </h3>
                <p className="text-white/50 uppercase tracking-widest text-xs">
                  {label}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ── EVENTS LIST ── */}
      <section className="bg-[#0C0C0D] px-4 sm:px-6 pt-8 pb-16 sm:pb-24">
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
              All Events — {events.length} Programs
            </h2>
            <span className="w-full h-[1px] bg-white/10" />
          </motion.div>

          {/* Event rows */}
          <div className="flex flex-col">
            {events.map((event, i) => {
              const isHovered = hoveredId === event.id;
              const isOpen = openId === event.id;
              const isActive = isHovered || isOpen;

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.5, delay: i * 0.07, ease }}
                  onHoverStart={() => setHoveredId(event.id)}
                  onHoverEnd={() => setHoveredId(null)}
                  onClick={() => handleRowClick(event.id)}
                  className="group relative border-t border-white/10 cursor-pointer"
                  style={{
                    borderBottom:
                      i === events.length - 1
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
                  <div className="relative z-10 flex items-center gap-3 sm:gap-5 md:gap-8 px-1 sm:px-2 py-4 sm:py-5">

                    {/* Number */}
                    <span
                      className="text-[10px] sm:text-xs font-bold transition-colors duration-300 w-5 sm:w-6 flex-shrink-0"
                      style={{
                        fontFamily: "Barlow, sans-serif",
                        color: isActive ? "#0C0C0D" : "rgba(255,255,255,0.25)",
                      }}
                    >
                      {event.number}
                    </span>

                    {/* Thumbnail */}
                    <motion.div
                      className="flex-shrink-0 overflow-hidden rounded-lg"
                      animate={{
                        width: isActive ? 140 : 110,
                        height: isActive ? 90 : 72,
                      }}
                      transition={{ duration: 0.35, ease }}
                      style={{ minWidth: 110 }}
                    >
                      <img
                        src={event.thumbnail}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-500"
                        style={{ transform: isActive ? "scale(1.08)" : "scale(1)" }}
                      />
                    </motion.div>

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
                      {event.title}
                    </h3>

                    {/* Tag */}
                    <div className="hidden sm:block flex-shrink-0 w-[100px] md:w-[110px]">
                      {event.tag && (
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
                          {event.tag}
                        </span>
                      )}
                    </div>

                    {/* Meta */}
                    <div className="hidden md:flex items-center gap-4 lg:gap-6 flex-shrink-0 w-40 lg:w-48 justify-end">
                      <span
                        className="text-xs lg:text-sm transition-colors duration-300"
                        style={{
                          fontFamily: "Barlow, sans-serif",
                          color: isActive ? "#0C0C0D" : "rgba(255,255,255,0.4)",
                        }}
                      >
                        {event.date}
                      </span>
                      <span
                        className="text-xs lg:text-sm transition-colors duration-300"
                        style={{
                          fontFamily: "Barlow, sans-serif",
                          color: isActive ? "#0C0C0D" : "rgba(255,255,255,0.4)",
                        }}
                      >
                        {event.type}
                      </span>
                    </div>

                    {/* Arrow */}
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
                    style={{ paddingLeft: "calc(0.25rem + 1.25rem + 0.75rem)" }}
                  >
                    {/* Mobile-only meta inside expand */}
                    <div className="flex flex-wrap gap-2 mb-2 md:hidden">
                      {event.tag && (
                        <span
                          className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
                          style={{
                            fontFamily: "Barlow, sans-serif",
                            background: "#0C0C0D",
                            color: "#FFFF00",
                            border: "1px solid rgba(255,255,0,0.4)",
                          }}
                        >
                          {event.tag}
                        </span>
                      )}
                      <span
                        className="text-[10px] font-semibold text-[#0C0C0D]/60 uppercase tracking-wide"
                        style={{ fontFamily: "Barlow, sans-serif" }}
                      >
                        {event.date} · {event.type}
                      </span>
                    </div>

                    <p
                      className="text-[#0C0C0D]/60 text-xs sm:text-sm pb-4 sm:pb-5 leading-relaxed"
                      style={{ fontFamily: "Barlow, sans-serif" }}
                    >
                      {event.desc}
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
              Don't miss out.
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
              GRAB YOUR
              <br />
              SPOT.
            </h2>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex-shrink-0 bg-[#0C0C0D] text-white font-black uppercase px-7 sm:px-10 py-4 sm:py-5 rounded-full text-sm sm:text-base lg:text-lg tracking-tight w-full md:w-auto text-center"
            style={{ fontFamily: "Barlow, sans-serif" }}
          >
            Register Now →
          </motion.button>
        </motion.div>
      </section>
    </>
  );
};

export default Events;
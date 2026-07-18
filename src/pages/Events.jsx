import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Building2, Zap } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import headerimg from "@/assets/aboutus.jpeg";
const API_BASE = `${import.meta.env.VITE_API_URL}/api`;
const Events = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState(0);
  const [hoveredId, setHoveredId] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    attendees: 0,
    speakers: 0,
    hackathon: 0,
    partners: 0,
  });
  const [hasAnimated, setHasAnimated] = useState(false);
  const statsRef = useRef(null);

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${API_BASE}/events`);
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        setError(err.message);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

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
            hackathon: events.filter(e => e.eventType === "hackathon").length * 100,
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
  }, [hasAnimated, events]);

  const FONT = "clamp(7.5rem, 16vw, 13.5rem)";
  const ease = [0.22, 1, 0.36, 1];

  return (
    <>

      <Navbar />

      {/* ── HERO ── */}
      <section className="w-full bg-white px-6 pt-6 pb-0">
        <div className="relative h-[100vh] w-full overflow-hidden rounded-[36px] bg-[#fffff] mt-5">
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
              src={headerimg}
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
              className="font-black uppercase text-[#0C0C0D]"
              style={{
                fontFamily: "'SansPlomb', sans-serif",
                fontSize: FONT,
                lineHeight: 0.88,
                color: "#FFDE21",
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
              className="font-black uppercase text-[#0C0C0D]"
              style={{ fontSize: FONT, lineHeight: 0.88, letterSpacing: "-0.02em", fontFamily: "'SansPlomb', sans-serif", color: "#FFDE21" }}
            >
              STAND OUT
            </motion.h1>
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE INTRO ── */}
      <section className="bg-white px-6 pt-24 pb-12">
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
              <p className="text-[#0C0C0D] uppercase tracking-[0.3em] text-xs mb-5 font-bold">
                Why Attend
              </p>
              <h2
                className="text-[#0C0C0D] font-black uppercase leading-none"
                style={{
                  fontSize: "clamp(2.5rem,6vw,5rem)",
                  letterSpacing: "-0.04em",
                }}
              >
                BUILD.
                <br />
                CONNECT.
                <br />
                <span style={{ color: "#FFDE21" }}>GROW.</span>
              </h2>
            </div>

            {/* Right */}
            <div>
              <p className="text-[#0C0C0D]/60 text-lg leading-relaxed max-w-xl">
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
                className="border border-black/10 rounded-3xl p-5 sm:p-8 cursor-pointer bg-white"
                whileHover={{
                  y: -8,
                  borderColor: "rgba(244,221,14,0.8)",
                }}
                transition={{ duration: 0.25 }}
              >
                <h3 className="text-[#0C0C0D] text-3xl sm:text-5xl font-black mb-2 break-words">
                  {value}
                </h3>
                <p className="text-[#0C0C0D]/50 uppercase tracking-widest text-[10px] sm:text-xs">
                  {label}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ── EVENTS GRID ── */}
      <section className="bg-white px-4 sm:px-6 pt-8 pb-16 sm:pb-24">
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
              className="text-[#0C0C0D]/30 text-[10px] sm:text-sm font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] whitespace-nowrap"
              style={{ fontFamily: "Barlow, sans-serif" }}
            >
              All Events — {events.length} Programs
            </h2>
            <span className="w-full h-[1px] bg-black/10" />
          </motion.div>

          {/* Cards */}
          {loading ? (
            <p className="text-[#0C0C0D]/50 p-8">Loading events...</p>
          ) : error ? (
            <p className="text-red-500 p-8">Error: {error}</p>
          ) : events.length === 0 ? (
            <p className="text-[#0C0C0D]/50 p-8">No events yet. Check back soon!</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {events.map((event, i) => {
                const isHovered = hoveredId === event._id;

                return (
                  <motion.div
                    key={event._id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.5, delay: i * 0.05, ease }}
                    onHoverStart={() => setHoveredId(event._id)}
                    onHoverEnd={() => setHoveredId(null)}
                    whileHover={{ y: -6 }}
                    onClick={() => navigate(`/events/${event._id}`)}
                    className="group cursor-pointer rounded-[20px] border border-black/10 bg-white overflow-hidden transition-shadow duration-300"
                    style={{
                      boxShadow: isHovered
                        ? "0 16px 32px rgba(12,12,13,0.14)"
                        : "0 1px 3px rgba(12,12,13,0.04)",
                    }}
                  >
                    {/* Banner image — plain rectangle, the card's overflow-hidden handles the corner rounding */}
                    <div className="relative">
                      <div className="w-full aspect-[16/9] bg-white">
                        <img
                          src={event.thumbnail || event.banner || "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&h=600&fit=crop"}
                          alt={event.title}
                          className="w-full h-full object-cover transition-transform duration-500"
                          style={{
                            transform: isHovered ? "scale(1.06)" : "scale(1)",
                            opacity: 0.9,
                          }}
                        />
                        {/* Dark gradient for legibility */}
                        <div
                          className="absolute inset-0"
                          style={{
                            background:
                              "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.55) 100%)",
                          }}
                        />
                      </div>

                      {/* Date pill — still fine, it sits within the card's overall bounds so it won't get clipped */}
                      <div className="absolute -bottom-3 left-3 flex items-center gap-1.5 bg-white rounded-full pl-1.5 pr-3 py-1.5 shadow-md">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#0C0C0D]/5 flex-shrink-0">
                          <Calendar className="w-3 h-3 text-[#0C0C0D]/70" strokeWidth={2.5} />
                        </span>
                        <span
                          className="text-[11px] font-bold text-[#0C0C0D] whitespace-nowrap"
                          style={{ fontFamily: "Barlow, sans-serif" }}
                        >
                          {event.date}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="px-4 pt-6 pb-4">
                      <h3
                        className="font-black leading-tight text-[#0C0C0D] mb-3 truncate"
                        style={{
                          fontFamily: "Barlow, sans-serif",
                          fontSize: "clamp(0.95rem, 1.6vw, 1.15rem)",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {event.title}
                      </h3>

                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-[#0C0C0D]/55">
                          <Building2 className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2} />
                          <span
                            className="text-xs truncate"
                            style={{ fontFamily: "Barlow, sans-serif" }}
                          >
                            {event.venue || event.city}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[#0C0C0D]/55">
                          <Zap className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2} />
                          <span
                            className="text-xs capitalize"
                            style={{ fontFamily: "Barlow, sans-serif" }}
                          >
                            {event.mode || (event.eventType === "hackathon" ? "Hackathon" : "Meetup")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Events;
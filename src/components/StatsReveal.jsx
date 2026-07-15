/**
 * StatsReveal.jsx
 * Space Grotesk font pairing + horizontal stat row layout.
 * Each card: big number + label + dot-grid waffle.
 *
 * Add to your index.html / global CSS:
 *   <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
 *
 * Dependencies: gsap (Tailwind configured)
 */

import { useRef, useEffect } from "react";
import gsap from "gsap";
import teamVideo from "../assets/IMG_2379.MOV";

const COLS = 8;
const ROWS = 5;
const TOTAL_DOTS = COLS * ROWS;

const STATS = [
  {
    id: "stat-1",
    value: 5000,
    suffix: "+",
    label: "Students and developers engaged",
    pct: 0.72,
  },
  {
    id: "stat-2",
    value: 45,
    suffix: "+",
    label: "Universities and colleges",
    pct: 0.52,
  },
  {
    id: "stat-3",
    value: 500,
    suffix: "+",
    label: "Projects built",
    pct: 0.88,
  },
];

const SG = "'Space Grotesk', sans-serif";

function DotGrid({ pct, id }) {
  const filled = Math.round(pct * TOTAL_DOTS);
  return (
    <div
      aria-hidden="true"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${COLS}, 10px)`,
        gap: "6px",
      }}
    >
      {Array.from({ length: TOTAL_DOTS }).map((_, i) => (
        <div
          key={`${id}-dot-${i}`}
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            background: i < filled ? "#000000" : "rgba(255,255,255,0.15)",
            opacity: i < filled ? 1 : 0.5,
          }}
        />
      ))}
    </div>
  );
}

export default function StatsReveal({
  videoSrc = teamVideo,
  videoLabel = "Two colleagues reviewing work together on a laptop",
}) {
  const videoWrapRef = useRef(null);
  const panelRefs = useRef([]);
  const numberRefs = useRef([]);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Set final values immediately if reduced motion preferred
    if (reduceMotion) {
      numberRefs.current.forEach((el, i) => {
        if (el) el.textContent = STATS[i].value.toLocaleString() + STATS[i].suffix;
      });
      return;
    }

    // Make sure all refs are available
    const panels = panelRefs.current.filter(Boolean);
    const numbers = numberRefs.current.filter(Boolean);

    if (panels.length === 0) return;

    // Set initial state manually so cards are invisible before animation
    gsap.set(panels, { opacity: 0, y: 20 });
    gsap.set(videoWrapRef.current, { opacity: 0, y: 24 });

    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    tl.to(videoWrapRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
    }).to(
      panels,
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.12 },
      "-=0.25"
    );

    // Counter animations
    STATS.forEach((stat, i) => {
      const numberEl = numberRefs.current[i];
      if (!numberEl) return;
      const counter = { val: 0 };
      gsap.to(counter, {
        val: stat.value,
        duration: 1.2,
        delay: 0.4 + i * 0.12,
        ease: "power1.out",
        onUpdate() {
          numberEl.textContent =
            Math.round(counter.val).toLocaleString() + stat.suffix;
        },
        onComplete() {
          numberEl.textContent = stat.value.toLocaleString() + stat.suffix;
        },
      });
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      style={{ fontFamily: SG }}
      className="relative w-full bg-white py-24 md:py-32 overflow-hidden"
    >
<div className="relative w-[95%] mx-auto mt-8 flex flex-col items-center gap-10 pb-16 bg-black rounded-[32px] overflow-hidden">
        {/* Video */}
        <div
          ref={videoWrapRef}
          className="relative w-[92%] md:w-[88%] lg:w-[90%] h-[72vh] overflow-hidden rounded-2xl mt-15"
        >
          <video
            src={videoSrc}
            aria-label={videoLabel}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          />
        </div>

        {/* Stat Cards */}
        <div className="w-[92%] md:w-[88%] lg:w-[90%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STATS.map((stat, i) => (
            <div
              key={stat.id}
              ref={(el) => { panelRefs.current[i] = el; }}
              className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* Glow */}
              <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-[#F6FB37] blur-[80px] opacity-40 pointer-events-none" />



              {/* Animated number */}
              <div className="relative z-10 mt-8">
                <p className="text-xs uppercase tracking-[0.3em] text-black/40">
                  Statistics
                </p>
                <h2
                  ref={(el) => { numberRefs.current[i] = el; }}
                  className="mt-3 text-6xl font-bold text-black leading-none"
                >
                  0{stat.suffix}
                </h2>
                <p className="mt-4 text-black/60 leading-7">
                  {stat.label}
                </p>
              </div>

              {/* Dot grid */}
              <div className="relative z-10 mt-8 overflow-hidden">
                <DotGrid pct={stat.pct} id={stat.id} />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
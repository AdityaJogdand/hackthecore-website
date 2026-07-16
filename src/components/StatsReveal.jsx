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
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);


const STATS = [
  {
    id: "stat-1",
    value: 4800,
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
    value: 240,
    suffix: "+",
    label: "Projects built",
    pct: 0.88,
  },
];

const SG = "'Space Grotesk', sans-serif";

export default function StatsReveal({
  videoSrc = teamVideo,
  videoLabel = "Two colleagues reviewing work together on a laptop",
}) {
  const sectionRef = useRef(null);
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

    if (panels.length === 0) return;

    // Set initial state manually so cards are invisible before animation
    gsap.set(panels, { opacity: 0, y: 20 });
    gsap.set(videoWrapRef.current, { opacity: 0, y: 24 });
    // Reset numbers to 0 so the count-up has somewhere to animate from
    numberRefs.current.forEach((el, i) => {
      if (el) el.textContent = "0" + STATS[i].suffix;
    });

    let tl;
    let counterTweens = [];

    // Only kick off the reveal + count-up once the section scrolls into view
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 80%", // fires when the section is ~80% down the viewport
      once: true,
      onEnter: () => {
        tl = gsap.timeline({ defaults: { ease: "power2.out" } });

        tl.to(videoWrapRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
        }).to(
          panels,
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.12 },
          "-=0.25"
        );

        // Counter animations, now gated behind viewport entry
        STATS.forEach((stat, i) => {
          const numberEl = numberRefs.current[i];
          if (!numberEl) return;
          const counter = { val: 0 };
          const tween = gsap.to(counter, {
            val: stat.value,
            duration: 1.8,
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
          counterTweens.push(tween);
        });
      },
    });

    return () => {
      st.kill();
      if (tl) tl.kill();
      counterTweens.forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{ fontFamily: SG }}
      className="relative w-full bg-white py-24 md:py-32 overflow-hidden"
    >
      {/* Section header */}
      <h1
        style={{ fontFamily: "'Sansplomb', sans-serif" }}
        className="w-[95%] mx-auto text-center text-6xl md:text-7xl lg:text-9xl font-bold text-black leading-tight tracking-tight mb-10"
      >
        What is Hackup
      </h1>

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
                <h2
                  ref={(el) => { numberRefs.current[i] = el; }}
                  className="mt-3 text-6xl font-bold text-black leading-none"
                >
                  0{stat.suffix}
                </h2>
                <p className="mt-4 text-xl text-black/60 leading-7">
                  {stat.label}
                </p>
              </div>

              {/* Dot grid */}

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
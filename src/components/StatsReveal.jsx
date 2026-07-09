/**
 * StatsReveal.jsx
 * ------------------------------------------------------------------
 * Scroll-triggered stat panel reveal, built with GSAP ScrollTrigger.
 * Styled with Tailwind CSS. Relies on a single app-level Lenis instance
 * from <SmoothScrollProvider> — see that file's comments for why.
 *
 * Install dependencies:
 *   npm install gsap lenis @gsap/react
 *   (Tailwind must already be configured in your project)
 *
 * Usage:
 *   import StatsReveal from "./StatsReveal";
 *   <StatsReveal />
 *
 * Behavior:
 *  - The image section stays fixed in view (via CSS `position: sticky`,
 *    NOT GSAP's `pin: true`) while the user scrolls through an outer
 *    tall wrapper that provides the scroll distance.
 *  - Two colored stat panels slide in from the right edge over the photo,
 *    each with a count-up number, staggered one after the other.
 *  - Why no `pin: true`: GSAP's pin inserts a "pin-spacer" wrapper div
 *    directly into the DOM, outside of React's virtual DOM tracking.
 *    In React 18/19 Strict Mode (dev), effects intentionally run,
 *    clean up, and run again — and that double cycle combined with
 *    GSAP's own DOM restructuring caused
 *    "Failed to execute 'removeChild' on 'Node'" errors, because React
 *    lost track of which nodes it actually owned. Using plain CSS
 *    sticky positioning for the pin means GSAP never touches DOM
 *    structure — it only tweens element properties (transform, opacity,
 *    a JS counter) — so there's nothing for React and GSAP to conflict
 *    over, in Strict Mode or during route changes.
 * ------------------------------------------------------------------
 */

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import teamPhoto from "../assets/SFM_6818.JPG";

// NOTE: Lenis is initialized once at the app root via <SmoothScrollProvider>
// (see SmoothScrollProvider.jsx). Do not create another Lenis instance here —
// that's what was causing navigation to break, requiring a reload between pages.

gsap.registerPlugin(ScrollTrigger, useGSAP);

const STATS = [
  {
    id: "stat-1",
    value: 900,
    suffix: "+",
    label: "Designers surveyed in 60+ countries.",
    bg: "#B69DF8", // purple
  },
  {
    id: "stat-2",
    value: 25,
    suffix: "+",
    label: "Interviews with practitioners and leaders",
    bg: "#E9EBD9", // pale sage
  },
];

export default function StatsReveal({
  imageSrc = teamPhoto,
  imageAlt = "Two colleagues reviewing work together on a laptop",
}) {
  const wrapperRef = useRef(null); // tall outer element — provides scroll distance
  const stickyRef = useRef(null); // sticky visual section, pinned via CSS
  const imageWrapRef = useRef(null);
  const panelRefs = useRef([]);
  const numberRefs = useRef([]);

  useGSAP(
    () => {
      const panels = panelRefs.current;
      const numbers = numberRefs.current;

      // Starting state: panels off-screen to the right, numbers at 0
      gsap.set(panels, { xPercent: 100, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          // no `pin` — CSS `position: sticky` on stickyRef handles pinning
        },
      });

      panels.forEach((panel, i) => {
        const numberEl = numbers[i];
        const target = STATS[i].value;
        const counter = { val: 0 };

        tl.to(
          panel,
          {
            xPercent: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power3.out",
          },
          i * 0.5
        ).to(
          counter,
          {
            val: target,
            duration: 0.6,
            ease: "power1.out",
            onUpdate: () => {
              if (numberEl) {
                numberEl.textContent =
                  Math.round(counter.val) + STATS[i].suffix;
              }
            },
          },
          i * 0.5
        );
      });

      // Subtle parallax on the photo while scrolling through
      gsap.fromTo(
        imageWrapRef.current,
        { scale: 1.08 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );

      // useGSAP auto-reverts every tween/timeline/ScrollTrigger created
      // in this callback on unmount — no manual cleanup needed.
    },
    { scope: wrapperRef }
  );

  return (
    <div ref={wrapperRef} className="relative w-full h-[220vh]">
      <section
        ref={stickyRef}
        className="sticky top-0 w-full h-screen overflow-hidden bg-black"
      >
        <div className="relative w-full h-full">
          {/* Photo */}
          <div
            ref={imageWrapRef}
            className="absolute inset-0 overflow-hidden will-change-transform"
          >
            <img
              src={imageSrc}
              alt={imageAlt}
              className="w-full h-full object-cover block"
            />
          </div>

          {/* Stat panels */}
          <div className="absolute top-0 right-0 h-full w-[60vw] sm:w-[45vw] md:w-[32vw] max-w-[520px] min-w-[280px] flex flex-col">
            {STATS.map((stat, i) => (
              <div
                key={stat.id}
                ref={(el) => (panelRefs.current[i] = el)}
                style={{ background: stat.bg }}
                className="flex-1 flex flex-col justify-center p-5 sm:p-8 md:p-12 lg:p-14 will-change-transform"
              >
                <span
                  ref={(el) => (numberRefs.current[i] = el)}
                  className="font-sans font-bold leading-none tracking-tight text-neutral-900 text-[40px] sm:text-[56px] md:text-[72px] lg:text-[88px]"
                >
                  0{stat.suffix}
                </span>
                <p className="mt-4 max-w-[22ch] font-sans text-neutral-900 text-base sm:text-lg md:text-xl leading-snug">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
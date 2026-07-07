import React from "react";
import { motion } from "framer-motion";

/**
 * EventGallery
 * ---------------------------------------------------------------
 * Dark, acid-yellow hero/gallery block for HackTheCore.
 * - Jagged "torn frame" image on the left (CSS clip-path)
 * - Scalloped "flower" mask image on the right (inline SVG mask)
 * - Duotone (grayscale + yellow tint via mix-blend-mode) treatment
 *
 * Drop-in usage:
 *   <EventGallery
 *     badge="EVENT GALLERY"
 *     titleLines={["An Inspiring Event", "for Builders"]}
 *     images={{ jagged: "/img1.jpg", scalloped: "/img2.jpg" }}
 *   />
 *
 * Requires Tailwind + framer-motion (already in the project stack).
 * Assumes a `font-display` utility mapped to Bebas Neue in tailwind.config.
 */

const SCALLOP_MASK_SVG = `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'>
  <g fill='#fff'>
    <circle cx='200' cy='60' r='95'/>
    <circle cx='330' cy='140' r='95'/>
    <circle cx='330' cy='280' r='95'/>
    <circle cx='200' cy='350' r='95'/>
    <circle cx='70' cy='280' r='95'/>
    <circle cx='70' cy='140' r='95'/>
    <circle cx='200' cy='200' r='150'/>
  </g>
</svg>
`;
const SCALLOP_MASK_URL = `url("data:image/svg+xml,${encodeURIComponent(SCALLOP_MASK_SVG)}")`;

export default function EventGallery({
  badge = "EVENT GALLERY",
  titleLines = ["An Inspiring Event", "for Builders"],
  images = {
    jagged:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop",
    scalloped:
      "https://images.unsplash.com/photo-1515169067868-5387ec356754?q=80&w=1200&auto=format&fit=crop",
  },
}) {
  return (
    <section className="relative w-full overflow-hidden bg-[#0C0C0D] px-6 py-24 sm:py-28">
      {/* corner accent shards */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rotate-12 bg-gradient-to-br from-[#F4DD0E] via-orange-500 to-fuchsia-700 opacity-70 blur-[1px]"
        style={{ clipPath: "polygon(0 0, 70% 0, 100% 40%, 40% 100%, 0 100%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-gradient-to-br from-orange-500 to-[#F4DD0E] opacity-60 blur-[2px]"
      />

      <div className="relative mx-auto max-w-6xl">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-8 w-fit rounded-md border border-[#F4DD0E] px-4 py-1.5"
        >
          <span className="font-sans text-xs font-semibold tracking-[0.25em] text-[#F4DD0E]">
            {badge}
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mx-auto max-w-4xl text-center font-display text-5xl leading-[0.95] text-[#FAFAF8] sm:text-7xl"
        >
          {titleLines.map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </motion.h2>

        {/* Image cluster */}
        <div className="relative mt-16 grid grid-cols-1 items-center gap-10 sm:grid-cols-2 sm:gap-6">
          {/* Jagged stair-step frame */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative mx-auto aspect-[4/5] w-full max-w-md"
          >
            <div
              className="relative h-full w-full overflow-hidden"
              style={{
                clipPath:
                  "polygon(22% 0%, 100% 0%, 100% 78%, 78% 78%, 78% 100%, 0% 100%, 0% 22%, 22% 22%)",
              }}
            >
              <img
                src={images.jagged}
                alt=""
                className="h-full w-full object-cover"
                style={{ filter: "grayscale(1) contrast(1.1) brightness(0.9)" }}
              />
              <div
                aria-hidden
                className="absolute inset-0 mix-blend-color"
                style={{ backgroundColor: "#F4DD0E" }}
              />
              <div aria-hidden className="absolute inset-0 bg-black/35" />
            </div>
          </motion.div>

          {/* Scalloped flower-mask frame */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative mx-auto aspect-square w-full max-w-md"
          >
            <div
              className="relative h-full w-full"
              style={{
                WebkitMaskImage: SCALLOP_MASK_URL,
                maskImage: SCALLOP_MASK_URL,
                WebkitMaskSize: "cover",
                maskSize: "cover",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
              }}
            >
              <img
                src={images.scalloped}
                alt=""
                className="h-full w-full object-cover"
                style={{ filter: "grayscale(1) contrast(1.1) brightness(0.9)" }}
              />
              <div
                aria-hidden
                className="absolute inset-0 mix-blend-color"
                style={{ backgroundColor: "#F4DD0E" }}
              />
              <div aria-hidden className="absolute inset-0 bg-black/35" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
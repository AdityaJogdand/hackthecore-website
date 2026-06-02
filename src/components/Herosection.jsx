import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Silk from "./Silk";

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};


const HeroSection = () => {
  const { scrollY } = useScroll();

// Move left as user scrolls
const watermarkX = useTransform(
  scrollY,
  [0, 1500], // scroll range
  [0, -500]  // movement range
);

  return (
    
    <section className="relative min-h-screen overflow-hidden bg-[#1c1f1e] flex items-center py-24 md:py-0">
      {/* Silk Background */}
      <div className="absolute inset-0 z-0">
        <Silk
          speed={15}
          scale={1}
          color="#525251"
          noiseIntensity={1.5}
          rotation={0}
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-[#1c1f1e]/85 z-10" />

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-5 mt-15 sm:px-8 md:px-10 lg:px-16 pt-16 md:pt-20">
        <motion.div
          className="max-w-6xl"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {/* Top Label */}
          <motion.div
            variants={fadeUp}
            className="uppercase tracking-[0.25em] md:tracking-[0.35em] text-[#F4DD0E]/70 mb-4 md:mb-5 text-[11px] sm:text-xs md:text-sm"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
            }}
          >
            COMMUNITY • HACKATHONS • BUILDERS
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={fadeUp}
            className="
              text-white
              uppercase
              tracking-[-0.03em]
              text-[3.2rem]
              sm:text-[4.5rem]
              md:text-[6rem]
              lg:text-[8rem]
              xl:text-[9rem]
              leading-[0.9]
            "
            style={{
              fontFamily: "'Anton', sans-serif",
              fontWeight: 400,
            }}
          >
            BUILDING THE FUTURE
            <br />
            OF TECH
          </motion.h1>

          {/* Accent */}
          <motion.div
            variants={fadeUp}
            className="flex items-center gap-3 md:gap-5 mt-3 flex-wrap"
          >
            <span
              className="text-[#F4DD0E]"
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "italic",
                fontSize: "clamp(1.5rem,5vw,3.5rem)",
                lineHeight: 1,
              }}
            >
              Innovation
            </span>

            <div className="h-[2px] w-16 sm:w-24 md:w-32 bg-[#F4DD0E]/80" />
          </motion.div>

          {/* Description */}
          <motion.p
            variants={fadeUp}
            className="
              mt-5
              max-w-3xl
              text-white/70
              leading-relaxed
              text-sm
              sm:text-base
              md:text-lg
            "
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
            }}
          >
            HackTheCore is where ambitious developers, designers,
            founders, and innovators come together to build impactful
            products, solve meaningful challenges, and shape the future
            through technology, collaboration, and creativity.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8"
          >
            {/* JOIN COMMUNITY */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="
                w-full
                sm:w-auto
                px-6
                md:px-8
                py-3
                bg-[#F4DD0E]
                text-black
                border
                border-[#F4DD0E]
                transition-all
                duration-200
                hover:bg-transparent
                hover:text-[#F4DD0E]
              "
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
              }}
            >
              JOIN COMMUNITY
            </motion.button>

            {/* EXPLORE EVENTS */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="
                relative
                overflow-hidden
                w-full
                sm:w-auto
                px-6
                md:px-8
                py-3
                border
                border-[#F4DD0E]
                group
              "
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
              }}
            >
              <span
                className="
                  absolute
                  inset-0
                  bg-[#F4DD0E]
                  origin-bottom
                  scale-y-0
                  transition-transform
                  duration-200
                  ease-out
                  group-hover:scale-y-100
                "
              />

              <span
                className="
                  relative
                  z-10
                  text-[#F4DD0E]
                  transition-colors
                  duration-150
                  group-hover:text-black
                "
              >
                EXPLORE EVENTS
              </span>
            </motion.button>
          </motion.div>

          {/* Stats */}
<motion.div
  variants={fadeUp}
  className="
    flex
    flex-wrap
    gap-8
    md:gap-12
    mt-10
    items-start
  "
>
  <div>
    <h3
      className="text-[#F4DD0E]"
      style={{
        fontFamily: "'Anton', sans-serif",
        fontSize: "clamp(1.8rem,4vw,2.6rem)",
        lineHeight: 1,
      }}
    >
      500+
    </h3>
    <p
      className="text-white/60 mt-1 text-sm md:text-base"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      Builders
    </p>
  </div>

  <div>
    <h3
      className="text-[#F4DD0E]"
      style={{
        fontFamily: "'Anton', sans-serif",
        fontSize: "clamp(1.8rem,4vw,2.6rem)",
        lineHeight: 1,
      }}
    >
      30+
    </h3>
    <p
      className="text-white/60 mt-1 text-sm md:text-base"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      Events
    </p>
  </div>

  <div>
    <h3
      className="text-[#F4DD0E]"
      style={{
        fontFamily: "'Anton', sans-serif",
        fontSize: "clamp(1.8rem,4vw,2.6rem)",
        lineHeight: 1,
      }}
    >
      100+
    </h3>
    <p
      className="text-white/60 mt-1 text-sm md:text-base"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      Projects
    </p>
  </div>
</motion.div>
        </motion.div>
      </div>

      {/* Watermark */}
      <motion.div
  style={{
    x: watermarkX,
    fontFamily: "'Archivo Black', sans-serif",
    fontSize: "clamp(4rem,18vw,14rem)",
    fontWeight: 400,
    color: "rgba(244,221,14,0.025)",
    whiteSpace: "nowrap",
    lineHeight: 0.8,
  }}
  className="absolute bottom-0 left-0 w-full text-center pointer-events-none select-none z-10"
>
  HACKTHECORE
</motion.div>
    </section>
  );
};

export default HeroSection;
import React from "react";
import { motion } from "framer-motion";
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
  return (
    <section className="relative h-screen overflow-hidden bg-[#1c1f1e] flex items-center">
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

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-[#1c1f1e]/85 z-10" />

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-8 lg:px-16 pt-20">
        <motion.div
          className="max-w-6xl"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {/* Top Label */}
          <motion.div
            variants={fadeUp}
            className="uppercase tracking-[0.35em] text-[#F4DD0E]/70 mb-5"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: "0.8rem",
            }}
          >
            COMMUNITY • HACKATHONS • BUILDERS
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={fadeUp}
            className="text-white uppercase tracking-[-0.03em]"
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "clamp(8rem, 7vw, 9rem)",
              lineHeight: "0.9",
              fontWeight: 400,
            }}
          >
            BUILDING&nbsp;THE&nbsp;FUTURE
            <br />
            OF&nbsp;TECH
          </motion.h1>

          {/* Accent */}
          <motion.div
            variants={fadeUp}
            className="flex items-center gap-5 mt-3"
          >
            <span
              className="text-[#F4DD0E]"
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "italic",
                fontSize: "clamp(2.2rem, 3.5vw, 3.5rem)",
                lineHeight: 1,
              }}
            >
              Innovation
            </span>

            <div className="h-[2px] w-32 bg-[#F4DD0E]/80" />
          </motion.div>

          {/* Description */}
          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-3xl text-white/70 leading-relaxed"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "1.05rem",
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
            className="flex flex-wrap gap-4 mt-6"
          >
            <motion.button
              whileHover={{
                y: -2,
                scale: 1.02,
                boxShadow: "0 12px 30px rgba(244,221,14,0.18)",
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="px-8 py-3 bg-[#F4DD0E] text-black"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
              }}
            >
              JOIN COMMUNITY
            </motion.button>

            <motion.button
              whileHover={{
                y: -2,
                scale: 1.02,
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="px-8 py-3 border border-[#F4DD0E] text-[#F4DD0E] hover:bg-[#F4DD0E] hover:text-black transition-colors duration-300"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
              }}
            >
              EXPLORE EVENTS
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeUp}
            className="flex gap-10 mt-6 flex-wrap"
          >
            <div className="pr-10 border-r border-white/10">
              <h3
                className="text-[#F4DD0E]"
                style={{
                  fontFamily: "'Anton', sans-serif",
                  fontSize: "2.6rem",
                  lineHeight: 1,
                }}
              >
                500+
              </h3>
              <p
                className="text-white/60 mt-1"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Builders
              </p>
            </div>

            <div className="pr-10 border-r border-white/10">
              <h3
                className="text-[#F4DD0E]"
                style={{
                  fontFamily: "'Anton', sans-serif",
                  fontSize: "2.6rem",
                  lineHeight: 1,
                }}
              >
                30+
              </h3>
              <p
                className="text-white/60 mt-1"
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
                  fontSize: "2.6rem",
                  lineHeight: 1,
                }}
              >
                100+
              </h3>
              <p
                className="text-white/60 mt-1"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Projects
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Watermark */}
      <div
        className="absolute bottom-[-1.5rem] left-0 w-full text-center pointer-events-none select-none z-100"
        style={{
          fontFamily: "'Archivo Black', sans-serif",
          fontSize: "clamp(8rem, 12vw, 14rem)",
          fontWeight: 400,
          color: "rgba(244,221,14,0.025)",
          letterSpacing: "0",
          whiteSpace: "nowrap",
          lineHeight: 0.8,
        }}
      >
        HACKTHECORE
      </div>
    </section>
  );
};

export default HeroSection;
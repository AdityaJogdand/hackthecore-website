import React from "react";

const HeroSection = () => {
  return (
    <section className="relative h-screen bg-[#F4DD0E] overflow-hidden flex items-center">
      <div className="max-w-7xl mx-auto w-full px-8 lg:px-16 mt-20">
        <div className="max-w-6xl">
          {/* Top Label */}
          <div
            className="uppercase tracking-[0.35em] text-black/60 mb-6"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: "0.85rem",
            }}
          >
            COMMUNITY • HACKATHONS • BUILDERS
          </div>

          {/* Main Heading */}
          <h1
            className="text-black leading-[0.88]"
            style={{
              fontFamily: "'Achivo Black', sans-serif",
              fontSize: "clamp(4.5rem, 8vw, 7rem)",
              fontWeight: 700,
              letterSpacing: "-0.08em",
            }}
          >
            BUILDING THE
            <br />
            FUTURE OF
          </h1>

          {/* Accent */}
          <div className="flex items-center gap-6 mt-2">
            <span
              className="text-black"
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "italic",
                fontSize: "clamp(3rem, 5vw, 4.8rem)",
                lineHeight: 1,
              }}
            >
              Innovation
            </span>

            <div className="h-[2px] w-28 bg-black/80" />
          </div>

          {/* Description */}
          <p
            className="mt-8 max-w-3xl text-black/75 leading-relaxed"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "1.2rem",
              fontWeight: 500,
            }}
          >
            HackTheCore is where ambitious developers, designers,
            founders, and innovators come together to build impactful
            products, solve meaningful challenges, and shape the future
            through technology, collaboration, and creativity.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mt-8">
            <button
              className="px-8 py-3 bg-black text-[#F4DD0E] transition-all duration-300 hover:scale-105"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                letterSpacing: "-0.02em",
              }}
            >
              JOIN COMMUNITY
            </button>

            <button
              className="px-8 py-3 border-2 border-black text-black transition-all duration-300 hover:bg-black hover:text-[#F4DD0E]"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                letterSpacing: "-0.02em",
              }}
            >
              EXPLORE EVENTS
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-12 mt-10 flex-wrap">
            <div className="pr-12 border-r border-black/20">
              <h3
                className="text-black"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "3rem",
                  fontWeight: 700,
                  letterSpacing: "-0.05em",
                }}
              >
                500+
              </h3>

              <p
                className="text-black/70"
                style={{
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Builders
              </p>
            </div>

            <div className="pr-12 border-r border-black/20">
              <h3
                className="text-black"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "3rem",
                  fontWeight: 700,
                  letterSpacing: "-0.05em",
                }}
              >
                30+
              </h3>

              <p
                className="text-black/70"
                style={{
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Events
              </p>
            </div>

            <div>
              <h3
                className="text-black"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "3rem",
                  fontWeight: 700,
                  letterSpacing: "-0.05em",
                }}
              >
                100+
              </h3>

              <p
                className="text-black/70"
                style={{
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Projects
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Watermark */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none select-none"
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "clamp(10rem, 16vw, 16rem)",
          fontWeight: 700,
          color: "rgba(0,0,0,0.03)",
          letterSpacing: "-0.08em",
          whiteSpace: "nowrap",
          lineHeight: 1,
        }}
      >
        HACKTHECORE
      </div>
    </section>
  );
};

export default HeroSection;
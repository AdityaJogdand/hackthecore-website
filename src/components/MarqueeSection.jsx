import React from "react";

const rows = [
  {
    words: ["Open Source", "Hackathon", "Full Stack", "DevOps", "Web3", "Machine Learning"],
    direction: "left",
    duration: "25s",
    accent: [1, 4],
  },
  {
    words: ["React", "Build in Public", "TypeScript", "Cloud Native", "API-First", "Startup"],
    direction: "right",
    duration: "20s",
    accent: [],
    outline: [0, 2, 4],
  },
  {
    words: ["Open Source", "AI & ML", "Side Projects", "Founder Mode", "Indie Hacker", "Ship Fast"],
    direction: "left",
    duration: "30s",
    accent: [1, 4],
  },

];

const MarqueeSection = () => {
  return (
    <section
      className="overflow-hidden py-8"
      style={{ backgroundColor: "#1c1f1e" }}
    >
      {rows.map((row, rowIndex) => {
        const doubled = [...row.words, ...row.words];

        return (
          <div key={rowIndex} className="flex my-1 overflow-hidden">
            <div
              className="flex gap-8 whitespace-nowrap"
              style={{
                animation: `marquee-${row.direction} ${row.duration} linear infinite`,
              }}
            >
              {doubled.map((word, i) => {
                const originalIndex = i % row.words.length;
                const isAccent = row.accent?.includes(originalIndex);
                const isOutline = row.outline?.includes(originalIndex);

                return (
                  <span
                    key={i}
                    style={{
                      fontFamily: "'Anton', sans-serif",
                      fontSize: "clamp(2rem, 5vw, 4rem)",
                      fontWeight: 400,
                      lineHeight: 1,
                      textTransform: "uppercase",
                      padding: isAccent ? "0.1em 0.4em" : "0 1rem",
                      color: isAccent
                        ? "#1c1f1e"
                        : isOutline
                        ? "transparent"
                        : "#ffffff",
                      backgroundColor: isAccent ? "#F4DD0E" : "transparent",
                      WebkitTextStroke: isOutline ? "2px #ffffff" : "none",
                    }}
                  >
                    {word}
                  </span>
                );
              })}
            </div>
          </div>
        );
      })}

      <style>{`
        @keyframes marquee-left {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
};

export default MarqueeSection;
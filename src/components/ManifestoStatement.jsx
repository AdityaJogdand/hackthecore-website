import { useRef, useLayoutEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const INK = "#0C0C0D";
const PAPER = "#FAFAF8";

const chapters = [
    {
        number: "01",
        word: "( builders )",
        pre: "HackTheCore turns ",
        accent: "spectators",
        post: " into shippers.",
        copy: "Not another feed of announcements. Real teams, real deadlines, and real code — built shoulder to shoulder with the people who actually show up to hack.",
        accentColor: "#F4DD0E",
        seed: "htc-builder-late-night",
    },
    {
        number: "02",
        word: "( craft )",
        pre: "Every ",
        accent: "ship note",
        post: " is proof, not promise.",
        copy: "Progress here isn't a vibe, it's a commit history. We track what got built, who built it, and what broke along the way.",
        accentColor: "#6EE7B7",
        seed: "htc-craft-workshop",
    },
    {
        number: "03",
        word: "( momentum )",
        pre: "Small wins ",
        accent: "compound",
        post: " into culture.",
        copy: "One hackathon becomes a habit. One habit becomes a community that keeps shipping long after the deadline passes.",
        accentColor: "#93C5FD",
        seed: "htc-momentum-team",
    },
];

// subtle grain texture, tileable, reused across the whole section
const NOISE_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='matrix' values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`;
const NOISE_URL = `url("data:image/svg+xml,${encodeURIComponent(NOISE_SVG)}")`;

function ManifestoStatement() {
    const sectionRef = useRef(null);
    const pinRef = useRef(null);
    const [active, setActive] = useState(0);

    useLayoutEffect(() => {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduceMotion) return; // static first chapter is already rendered by default state

        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top top",
                end: `+=${chapters.length * 100}%`,
                pin: pinRef.current,
                pinSpacing: true,
                scrub: 0.5,
                onUpdate: (self) => {
                    const idx = Math.min(chapters.length - 1, Math.floor(self.progress * chapters.length));
                    setActive((prev) => (prev === idx ? prev : idx));
                },
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen"
            style={{ backgroundColor: PAPER }}
        >
            <div
                ref={pinRef}
                className="relative h-screen w-screen overflow-hidden"
                style={{ backgroundColor: PAPER, height: "100dvh", color: INK }}
            >
                {/* grain overlay, sits above everything, doesn't block interaction */}
                <div
                    className="pointer-events-none absolute inset-0 z-10 mix-blend-multiply"
                    style={{ backgroundImage: NOISE_URL, backgroundRepeat: "repeat", opacity: 0.05 }}
                />

                {/* persistent step indicator — shows progress through 01 / 02 / 03 */}
                <div className="pointer-events-none absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-end gap-3 sm:right-10 md:flex lg:right-14">
                    {chapters.map((chapter, i) => (
                        <span
                            key={chapter.number}
                            className="font-['Bebas_Neue',sans-serif] leading-none transition-all duration-500"
                            style={{
                                fontSize: active === i ? "1.4rem" : "1rem",
                                color: active === i ? chapter.accentColor : `${INK}33`,
                            }}
                        >
                            {chapter.number}
                        </span>
                    ))}
                </div>

                {chapters.map((chapter, i) => (
                    <div
                        key={chapter.number}
                        className="absolute inset-0 flex flex-col px-6 py-16 sm:px-10 md:px-14 lg:px-20 md:py-24 lg:py-28 transition-opacity duration-500 ease-out"
                        style={{
                            opacity: active === i ? 1 : 0,
                            pointerEvents: active === i ? "auto" : "none",
                        }}
                    >
                        <div className="relative mx-auto flex h-full w-full max-w-[1400px] flex-col">
                            {/* top row — eyebrow + mark, index number */}
                            <div className="flex items-start justify-between">
                                <div>
                                    <svg width="34" height="20" viewBox="0 0 34 20" fill="none" className="mb-4 sm:mb-6">
                                        <path d="M12 2 L2 10 L12 18" stroke={chapter.accentColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M22 2 L32 10 L22 18" stroke={chapter.accentColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span className="block font-semibold uppercase tracking-[0.2em] text-[0.85rem] sm:text-[1rem]" style={{ color: `${INK}99` }}>
                                        Manifesto
                                    </span>
                                    <h2
                                        className="mt-1 font-['Bebas_Neue',sans-serif] uppercase leading-[0.9] tracking-[-0.01em]"
                                        style={{ fontSize: "clamp(2.25rem, 6vw, 4.5rem)" }}
                                    >
                                        {chapter.word}
                                    </h2>
                                </div>

                                <span
                                    className="font-['Bebas_Neue',sans-serif] leading-none select-none"
                                    style={{
                                        fontSize: "clamp(3rem, 9vw, 7.5rem)",
                                        WebkitTextStroke: `2px ${INK}`,
                                        color: "transparent",
                                    }}
                                >
                                    {chapter.number}
                                </span>
                            </div>

                            {/* middle — portrait image, centered */}
                            <div className="flex flex-1 items-center justify-center py-8 sm:py-10">
                                <div className="w-[58%] sm:w-[38%] lg:w-[22%] aspect-[3/4] overflow-hidden">
                                    <img
                                        src={`https://picsum.photos/seed/${chapter.seed}/900/1200`}
                                        alt=""
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            </div>

                            {/* bottom — statement left, supporting copy right */}
                            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 lg:gap-16">
                                <h3
                                    className="max-w-[22ch] font-['Bebas_Neue',sans-serif] uppercase leading-[0.92] tracking-[-0.01em]"
                                    style={{ fontSize: "clamp(2rem, 5vw, 3.75rem)" }}
                                >
                                    {chapter.pre}
                                    <span style={{ color: chapter.accentColor }}>{chapter.accent}</span>
                                    {chapter.post}
                                </h3>

                                <p
                                    className="max-w-[24rem] font-semibold leading-[1.65] text-[1rem] sm:text-[1.05rem] lg:pb-2 lg:text-right"
                                    style={{ color: `${INK}B3` }}
                                >
                                    {chapter.copy}
                                </p>
                            </div>

                            {/* quiet meta line */}
                            <div className="mt-8 sm:mt-10 border-t pt-5" style={{ borderColor: `${INK}1A` }}>
                                <span
                                    className="font-mono text-[0.7rem] uppercase tracking-[0.25em] sm:text-[0.8rem]"
                                    style={{ color: `${INK}66` }}
                                >
                                    Mumbai, IN — Est. 2023
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default ManifestoStatement;
import { useRef, useLayoutEffect, useCallback, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const coreValues = [
    { title: "Innovation", copy: "Encouraging creativity and solving real-world problems through technology.", accent: "#F4DD0E" },
    { title: "Community First", copy: "Building meaningful relationships and creating a supportive environment where everyone grows together.", accent: "#6EE7B7" },
    { title: "Merit & Excellence", copy: "Recognizing effort, quality, and genuine talent over popularity or participation alone.", accent: "#93C5FD" },
    { title: "Collaboration", copy: "Bringing students, mentors, and industry leaders together to create greater impact.", accent: "#F4A6C1" },
    { title: "Growth Mindset", copy: "Promoting continuous learning, experimentation, and personal development.", accent: "#C4B5FD" },
];

const INK = "#0C0C0D";

// tileable grain texture, generated once and reused across every card
const NOISE_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='matrix' values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`;
const NOISE_URL = `url("data:image/svg+xml,${encodeURIComponent(NOISE_SVG)}")`;

function CoreValuesList() {
    const trackRef = useRef(null);
    const cardRefs = useRef([]);
    const radiusTweens = useRef([]);
    const fadeTweens = useRef([]);
    const [atStart, setAtStart] = useState(true);
    const [atEnd, setAtEnd] = useState(false);

    useLayoutEffect(() => {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const track = trackRef.current;

        const ctx = gsap.context(() => {
            cardRefs.current.forEach((card, i) => {
                if (!card) return;

                const copy = card.querySelector(".card-copy");
                const rule = card.querySelector(".card-rule");
                const index = card.querySelector(".card-index");

                card.style.setProperty("--mx", "50%");
                card.style.setProperty("--my", "50%");
                card.style.setProperty("--r", "0%");

                gsap.set(rule, { scaleX: 0 });
                gsap.set(copy, { autoAlpha: 0, y: 10 });

                // simple scroll-in reveal, no scroll-jacking — just a fade/rise on entry
                if (!reduceMotion) {
                    gsap.set(card, { autoAlpha: 0, y: 24 });
                    ScrollTrigger.create({
                        trigger: track,
                        start: "top 85%",
                        once: true,
                        onEnter: () =>
                            gsap.to(card, {
                                autoAlpha: 1,
                                y: 0,
                                duration: 0.7,
                                ease: "power3.out",
                                delay: i * 0.08,
                            }),
                    });
                }

                const radiusProxy = { r: 0 };
                radiusTweens.current[i] = gsap.to(radiusProxy, {
                    r: 150,
                    duration: 0.6,
                    ease: "power3.out",
                    paused: true,
                    onUpdate: () => card.style.setProperty("--r", `${radiusProxy.r}%`),
                });

                fadeTweens.current[i] = gsap.timeline({ paused: true })
                    .to(rule, { scaleX: 1, duration: 0.45, ease: "power3.out" }, 0)
                    .to(index, { color: coreValues[i].accent, duration: 0.3 }, 0)
                    .to(copy, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" }, 0.08);
            });
        }, trackRef);

        // keep nav button states in sync with actual scroll position
        const updateEdges = () => {
            if (!track) return;
            const max = track.scrollWidth - track.clientWidth;
            setAtStart(track.scrollLeft <= 4);
            setAtEnd(track.scrollLeft >= max - 4);
        };
        updateEdges();
        track?.addEventListener("scroll", updateEdges, { passive: true });
        window.addEventListener("resize", updateEdges);

        return () => {
            ctx.revert();
            track?.removeEventListener("scroll", updateEdges);
            window.removeEventListener("resize", updateEdges);
        };
    }, []);

    const handleMove = useCallback((e, i) => {
        const card = cardRefs.current[i];
        if (!card) return;
        const bounds = card.getBoundingClientRect();
        const mx = ((e.clientX - bounds.left) / bounds.width) * 100;
        const my = ((e.clientY - bounds.top) / bounds.height) * 100;
        card.style.setProperty("--mx", `${mx}%`);
        card.style.setProperty("--my", `${my}%`);
    }, []);

    const handleEnter = useCallback((i) => {
        radiusTweens.current[i]?.play();
        fadeTweens.current[i]?.play();
    }, []);

    const handleLeave = useCallback((i) => {
        radiusTweens.current[i]?.reverse();
        fadeTweens.current[i]?.reverse();
    }, []);

    const scrollByCard = (direction) => {
        const track = trackRef.current;
        const first = cardRefs.current[0];
        const second = cardRefs.current[1];
        if (!track || !first) return;
        const step = second
            ? second.getBoundingClientRect().left - first.getBoundingClientRect().left
            : first.getBoundingClientRect().width;
        const max = track.scrollWidth - track.clientWidth;
        const target = Math.min(Math.max(track.scrollLeft + direction * step, 0), max);
        gsap.to(track, { scrollLeft: target, duration: 0.6, ease: "power3.out" });
    };

    return (
        <div className="relative">
            <div
                ref={trackRef}
                className="cv-track flex gap-4 sm:gap-5 overflow-x-auto"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {coreValues.map((value, i) => (
                    <div
                        key={value.title}
                        ref={(el) => (cardRefs.current[i] = el)}
                        onMouseEnter={() => handleEnter(i)}
                        onMouseLeave={() => handleLeave(i)}
                        onMouseMove={(e) => handleMove(e, i)}
                        className="group relative flex flex-col justify-between overflow-hidden cursor-default
                            border border-[#0C0C0D]/15 shrink-0
                            w-[80vw] sm:w-[48vw] lg:w-[28vw]
                            min-h-[400px] sm:min-h-[440px]
                            p-7 sm:p-9"
                        style={{ "--mx": "50%", "--my": "50%", "--r": "0%" }}
                    >
                        {/* textured panel, opens from the cursor position like a spotlight */}
                        <div
                            className="absolute inset-0"
                            style={{
                                backgroundColor: value.accent,
                                clipPath: "circle(var(--r) at var(--mx) var(--my))",
                                WebkitClipPath: "circle(var(--r) at var(--mx) var(--my))",
                            }}
                        >
                            <div
                                className="absolute inset-0 mix-blend-multiply opacity-30"
                                style={{ backgroundImage: NOISE_URL, backgroundRepeat: "repeat" }}
                            />
                        </div>

                        <span
                            className="card-index relative z-[1] font-mono text-[0.75rem] font-bold tracking-[0.12em] uppercase"
                            style={{ color: `${INK}99` }}
                        >
                            VAL.{String(i + 1).padStart(2, "0")}
                        </span>

                        <div className="relative z-[1] flex flex-col gap-3">
                            <h3
                                className="m-0 font-['SansPlomb',sans-serif] font-black uppercase leading-[0.9] tracking-[-0.01em]"
                                style={{ color: INK, fontSize: "clamp(2rem, 3.4vw, 2.8rem)" }}
                            >
                                {value.title}
                            </h3>
                            <p
                                className="card-copy m-0 font-semibold leading-[1.6]"
                                style={{ color: `${INK}CC`, fontSize: "0.95rem", maxWidth: "22rem" }}
                            >
                                {value.copy}
                            </p>
                        </div>

                        <span
                            className="card-rule absolute left-0 bottom-0 h-[2px] w-full origin-left"
                            style={{ backgroundColor: value.accent }}
                        />
                    </div>
                ))}
            </div>

            {/* nav controls */}
            <div className="flex items-center justify-end gap-3 mt-6 sm:mt-8">
                <button
                    type="button"
                    aria-label="Previous value"
                    disabled={atStart}
                    onClick={() => scrollByCard(-1)}
                    className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-[#0C0C0D]/25 text-[#0C0C0D] transition-all duration-300 hover:bg-[#0C0C0D] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#0C0C0D] disabled:cursor-not-allowed"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </button>
                <button
                    type="button"
                    aria-label="Next value"
                    disabled={atEnd}
                    onClick={() => scrollByCard(1)}
                    className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-[#0C0C0D]/25 text-[#0C0C0D] transition-all duration-300 hover:bg-[#0C0C0D] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#0C0C0D] disabled:cursor-not-allowed"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            <style>{`.cv-track::-webkit-scrollbar { display: none; }`}</style>
        </div>
    );
}

export default CoreValuesList;
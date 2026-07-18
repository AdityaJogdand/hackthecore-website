import { useRef, useEffect, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import mobileBg from "../assets/1.png";

gsap.registerPlugin(ScrollTrigger);

const ease = "power3.out"; // GSAP equivalent of the cubic-bezier(0.22,1,0.36,1) entrance ease

const description =
    "Hackthecore is a technology-driven developer ecosystem empowering students to learn, build, and innovate through hackathons, community, and real-world opportunities.";

const STAGE = {
    waveExitStart: 0.25,
    waveExitEnd: 0.55,
    bgStart: 0.3,
    bgEnd: 0.62,
    descStart: 0.62,
    descEnd: 0.85,
};

const WAVE_PATH_DESKTOP = `
    M -50 300
    C 60 -80, 210 -120, 320 190
    C 400 320, 500 340, 590 210
    C 660 100, 760 30, 880 160
    C 970 260, 1060 300, 1140 190
    C 1190 130, 1220 150, 1250 210
`;

// Single bold arc — enters top-right, bows far left through center, exits bottom-right
const WAVE_PATH_MOBILE = `
    M 480 -100
    C -300 100, -300 700, 480 900
`;

const DESC_WORDS = description.split(" ");

const BG_FROM = { r: 0xff, g: 0xff, b: 0xff }; // #FFFFFF
const BG_TO = { r: 0x0c, g: 0x0c, b: 0x0d }; // #0C0C0D
const HEAD_FROM = { r: 0x0a, g: 0x0a, b: 0x0a }; // #0a0a0a
const HEAD_TO = { r: 0xff, g: 0xff, b: 0xff }; // #FFFFFF

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function mapRange(v, inMin, inMax, outMin, outMax) {
    const t = Math.max(0, Math.min(1, (v - inMin) / (inMax - inMin)));
    return outMin + (outMax - outMin) * t;
}

function rgbAt(from, to, t) {
    const r = Math.round(lerp(from.r, to.r, t));
    const g = Math.round(lerp(from.g, to.g, t));
    const b = Math.round(lerp(from.b, to.b, t));
    return `rgb(${r}, ${g}, ${b})`;
}

export default function SenseHero() {
    const sectionRef = useRef(null);
    const stickyRef = useRef(null);
    const pathDesktopRef = useRef(null);
    const pathMobileRef = useRef(null);
    const headingRef = useRef(null);
    const eyebrowRef = useRef(null);
    const descParaRef = useRef(null);
    const wordRefs = useRef([]);
    const drawProgressRef = useRef(0); // 0 -> 1 page-load draw-in, animated once on mount

    const wordStep = (STAGE.descEnd - STAGE.descStart) / DESC_WORDS.length;

    // Renders all scroll-driven values for a given progress value s (0..1)
    const render = (s, drawProgress) => {
        // --- wave draw / exit ---
        const exitProgress = mapRange(s, STAGE.waveExitStart, STAGE.waveExitEnd, 1, 0);
        const pathLength = Math.min(drawProgress, exitProgress);

        [pathDesktopRef.current, pathMobileRef.current].forEach((el) => {
            if (!el) return;
            const len = el.getTotalLength();
            el.style.strokeDasharray = `${len} ${len}`;
            el.style.strokeDashoffset = `${len * (1 - pathLength)}`;
        });

        // wave opacity: 1 -> 1 -> 0 across [waveExitStart, waveExitEnd-0.05, waveExitEnd]
        let waveOpacity;
        if (s <= STAGE.waveExitEnd - 0.05) {
            waveOpacity = 1;
        } else {
            waveOpacity = mapRange(s, STAGE.waveExitEnd - 0.05, STAGE.waveExitEnd, 1, 0);
        }
        [pathDesktopRef.current, pathMobileRef.current].forEach((el) => {
            if (el) el.style.opacity = waveOpacity;
        });

        // --- background / heading color ---
        const colorT = mapRange(s, STAGE.bgStart, STAGE.bgEnd, 0, 1);
        if (stickyRef.current) stickyRef.current.style.backgroundColor = rgbAt(BG_FROM, BG_TO, colorT);
        if (headingRef.current) headingRef.current.style.color = rgbAt(HEAD_FROM, HEAD_TO, colorT);

        // --- heading opacity / y (entrance via drawProgress, exit via scroll) ---
        const exitRange = STAGE.descStart - STAGE.waveExitStart;
        const exitT = mapRange(s, STAGE.waveExitStart, STAGE.descStart, 0, 1);
        const headingOpacity = Math.min(drawProgress, 1 - exitT);
        const headingY = (1 - drawProgress) * 30 + exitT * -40;
        if (headingRef.current) {
            headingRef.current.style.opacity = headingOpacity;
            headingRef.current.style.transform = `translateY(${headingY}px)`;
        }

        // --- description block (eyebrow + paragraph wrapper) ---
        const descVisible = s < STAGE.descStart ? 0 : 1;
        const descY = mapRange(s, STAGE.descStart, STAGE.descEnd, 40, 0);
        [eyebrowRef.current, descParaRef.current].forEach((el) => {
            if (!el) return;
            el.style.opacity = descVisible;
            el.style.transform = `translateY(${descY}px)`;
        });

        // --- per-word blur / opacity / y / scale ---
        DESC_WORDS.forEach((_, i) => {
            const start = STAGE.descStart + i * wordStep;
            const end = Math.min(STAGE.descEnd, start + wordStep);
            const el = wordRefs.current[i];
            if (!el) return;

            const blurPx = mapRange(s, start, end, 20, 0);
            const opacity = mapRange(s, start, end, 0.3, 1);
            const y = mapRange(s, start, end, 30, 0);
            const scale = mapRange(s, start, end, 0.85, 1);

            el.style.filter = `blur(${blurPx}px)`;
            el.style.opacity = opacity;
            el.style.transform = `translateY(${y}px) scale(${scale})`;
        });
    };

    useLayoutEffect(() => {
        const st = ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            onUpdate: (self) => render(self.progress, drawProgressRef.current),
        });

        // Initial paint at progress 0 in case the section is already in view
        render(0, drawProgressRef.current);

        return () => st.kill();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // Page-load wave draw-in animation (equivalent to the Framer Motion `animate(drawProgress, 1, ...)`)
        const obj = { d: 0 };
        const tween = gsap.to(obj, {
            d: 1,
            duration: 1.6,
            ease: "power3.out",
            onUpdate: () => {
                drawProgressRef.current = obj.d;
                const s = ScrollTrigger.getAll().find((t) => t.trigger === sectionRef.current);
                render(s ? s.progress : 0, obj.d);
            },
        });
        return () => tween.kill();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <section ref={sectionRef} className="relative h-[300vh]">
            <div
                ref={stickyRef}
                className="sticky top-0 h-screen w-full overflow-hidden"
                style={{ backgroundColor: "#FFFFFF" }}
            >
                {/* Desktop wave */}
                <svg
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 w-full h-full z-20 hidden md:block"
                    viewBox="0 -180 1200 680"
                    preserveAspectRatio="xMidYMid slice"
                >
                    <defs>
                        <linearGradient
                            id="ribbonGradient"
                            x1="0"
                            y1="0"
                            x2="1200"
                            y2="0"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop offset="0%" stopColor="#FEF636" />
                            <stop offset="100%" stopColor="#FEF636" />
                        </linearGradient>
                    </defs>
                    <path
                        ref={pathDesktopRef}
                        d={WAVE_PATH_DESKTOP}
                        stroke="url(#ribbonGradient)"
                        strokeWidth="160"
                        strokeLinecap="round"
                        fill="none"
                    />
                </svg>

                {/* Mobile background image */}
                <img
                    src={mobileBg}
                    alt=""
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 w-full h-full object-cover z-10 block md:hidden"
                />

                {/* Heading — desktop (md+) */}
                <div className="relative z-40 hidden md:flex h-full max-w-[1200px] mx-auto flex-col items-center justify-center text-center px-6">
                    <h1
                        ref={headingRef}
                        className="font-druk font-black uppercase tracking-tight leading-none text-[clamp(1.8rem,7vw,7rem)]"
                        style={{ color: "#0a0a0a" }}
                    >
                        More Than Just Hackathons
                    </h1>
                </div>

                {/* Heading — mobile only */}
                <div className="relative z-40 flex md:hidden h-full w-full flex-col items-center justify-center text-center px-2">
                    <h1 className="uppercase leading-none w-full text-center">
                        <span className="block" style={{ fontFamily: "Impact, 'Arial Narrow', sans-serif", fontSize: "clamp(3rem,17vw,6rem)", letterSpacing: "0.02em", color: "#ffffff" }}>MORE THAN</span>
                        <span className="block" style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(4.5rem,27vw,10rem)", letterSpacing: "0.05em", color: "#ffffff" }}>JUST</span>
                        <span className="block" style={{ fontFamily: "Impact, 'Arial Narrow', sans-serif", fontSize: "clamp(3rem,17vw,6rem)", letterSpacing: "0.02em", color: "#FEF636" }}>HACKATHONS</span>
                    </h1>
                </div>

                {/* Description overlay */}
                <div className="absolute inset-0 flex items-center justify-center z-40 px-4 sm:px-8">
                    <div className="flex flex-col items-center w-full">
                        <div
                            ref={eyebrowRef}
                            style={{ opacity: 0 }}
                            className="mb-3 sm:mb-4 flex items-center gap-3 sm:gap-4 text-[#ffffff]/70"
                        >
                            <span className="h-px w-8 sm:w-16 bg-[#fef636]/70" />
                            <span className="font-Giest font-medium tracking-[0.2em] sm:tracking-[0.3em] uppercase text-xs sm:text-base">
                                About Us
                            </span>
                            <span className="h-px w-8 sm:w-16 bg-[#fef636]/70" />
                        </div>

                        <p
                            ref={descParaRef}
                            style={{ opacity: 0 }}
                            className="max-w-xs sm:max-w-2xl md:max-w-5xl lg:max-w-6xl text-center text-[#FFFFFF] font-Giest font-medium text-[clamp(1.45rem,3.5vw,3.5rem)] leading-tight"
                        >
                            {DESC_WORDS.map((word, i) => (
                                <span
                                    key={i}
                                    ref={(el) => (wordRefs.current[i] = el)}
                                    className="inline-block mr-[0.25em] origin-bottom"
                                >
                                    {word}
                                </span>
                            ))}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
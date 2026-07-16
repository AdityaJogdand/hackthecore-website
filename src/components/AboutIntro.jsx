import { motion, useScroll, useTransform, useMotionValue, animate } from "framer-motion";
import { useRef, useEffect } from "react";

const ease = [0.22, 1, 0.36, 1];

const description = "Hackthecore is a technology-driven developer ecosystem empowering students to learn, build, and innovate through hackathons, community, and real-world opportunities."

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

// Bold diagonal slash — enters top-left, sweeps through center, exits bottom-right
const WAVE_PATH_MOBILE = `
    M -60 80
    C 40 -60, 180 -40, 260 180
    C 320 320, 360 420, 460 380
    C 540 340, 580 260, 660 300
    C 720 340, 740 420, 800 460
`;

// Updated to split into single words instead of word chunks
const DESC_WORDS = description.split(" ");

function DescWord({ word, scrollYProgress, start, end }) {
    const blurPx = useTransform(scrollYProgress, [start, end], [20, 0]);
    const filter = useTransform(blurPx, (b) => `blur(${b}px)`);

    const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);

    // Move upward
    const y = useTransform(scrollYProgress, [start, end], [30, 0]);

    // Pop effect
    const scale = useTransform(scrollYProgress, [start, end], [0.85, 1]);

    return (
        <motion.span
            style={{
                filter,
                y,
                scale,
            }}
            className="inline-block mr-[0.25em] origin-bottom"
        >
            {word}
        </motion.span>
    );
}

function AnimatedHero({ scrollYProgress }) {
    const drawProgress = useMotionValue(0);
    useEffect(() => {
        const controls = animate(drawProgress, 1, { duration: 1.6, ease });
        return () => controls.stop();
    }, []);

    const exitProgress = useTransform(
        scrollYProgress,
        [STAGE.waveExitStart, STAGE.waveExitEnd],
        [1, 0]
    );
    const pathLength = useTransform(
        [drawProgress, exitProgress],
        ([d, e]) => Math.min(d, e)
    );

    const bgColor = useTransform(
        scrollYProgress,
        [STAGE.bgStart, STAGE.bgEnd],
        ["#FFFFFF", "#0C0C0D"]
    );
    const headingColor = useTransform(
        scrollYProgress,
        [STAGE.bgStart, STAGE.bgEnd],
        ["#0a0a0a", "#FFFFFF"]
    );

    const headingOpacity = useTransform(
        [drawProgress, scrollYProgress],
        ([d, s]) => {
            const entrance = d;
            const exitRange = STAGE.descStart - STAGE.waveExitStart;
            const exitT = Math.max(0, Math.min(1, (s - STAGE.waveExitStart) / exitRange));
            return Math.min(entrance, 1 - exitT);
        }
    );

    const headingY = useTransform(
        [drawProgress, scrollYProgress],
        ([d, s]) => {
            const entranceY = (1 - d) * 30;
            const exitRange = STAGE.descStart - STAGE.waveExitStart;
            const exitT = Math.max(0, Math.min(1, (s - STAGE.waveExitStart) / exitRange));
            return entranceY + exitT * -40;
        }
    );

    const descY = useTransform(scrollYProgress, [STAGE.descStart, STAGE.descEnd], [40, 0]);
    const waveOpacity = useTransform(
        scrollYProgress,
        [STAGE.waveExitStart, STAGE.waveExitEnd - 0.05, STAGE.waveExitEnd],
        [1, 1, 0]
    );

    // Calculated based on single word length now
    const wordStep = (STAGE.descEnd - STAGE.descStart) / DESC_WORDS.length;
    const wordOverlap = 0;
    const descVisible = useTransform(scrollYProgress, (v) => (v < STAGE.descStart ? 0 : 1));

    return (
        <motion.div style={{ backgroundColor: bgColor }} className="sticky top-0 h-screen w-full overflow-hidden">

            {/* Desktop wave */}
            <svg
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 w-full h-full z-20 hidden md:block"
                viewBox="0 -180 1200 680"
                preserveAspectRatio="xMidYMid slice"
            >
                <defs>
                    <linearGradient id="ribbonGradient" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#FEF636" />
                        <stop offset="100%" stopColor="#FEF636" />
                    </linearGradient>
                </defs>
                <motion.path
                    style={{ pathLength, opacity: waveOpacity }}
                    d={WAVE_PATH_DESKTOP}
                    stroke="url(#ribbonGradient)"
                    strokeWidth="160"
                    strokeLinecap="round"
                    fill="none"
                />
            </svg>

            {/* Mobile wave — diagonal slash, taller viewBox */}
            <svg
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 w-full h-full z-20 block md:hidden"
                viewBox="-80 -100 560 900"
                preserveAspectRatio="xMidYMid slice"
            >
                <motion.path
                    style={{ pathLength, opacity: waveOpacity }}
                    d={WAVE_PATH_MOBILE}
                    stroke="#FEF636"
                    strokeWidth="150"
                    strokeLinecap="round"
                    fill="none"
                />
            </svg>

            {/* Heading */}
            <div className="relative z-40 flex h-full max-w-[1200px] mx-auto flex-col items-center justify-center text-center px-4 sm:px-6">
                <motion.h1
                    style={{
                        color: headingColor,
                        y: headingY,
                        opacity: headingOpacity,
                    }}
                    className="font-druk font-black uppercase tracking-tight leading-none text-[clamp(2.8rem,7vw,7rem)]"
                >
                    More Than Just Hackathons
                </motion.h1>
            </div>

            {/* Description overlay */}
            <div className="absolute inset-0 flex items-center justify-center z-40 px-4 sm:px-8">
                <div className="flex flex-col items-center w-full">
                    <motion.div
                        style={{ opacity: descVisible, y: descY }}
                        className="mb-3 sm:mb-4 flex items-center gap-3 sm:gap-4 text-[#ffffff]/70"
                    >
                        <span className="h-px w-8 sm:w-16 bg-[#fef636]/70" />
                        <span className="font-Giest font-medium tracking-[0.2em] sm:tracking-[0.3em] uppercase text-xs sm:text-base">
                            About Us
                        </span>
                        <span className="h-px w-8 sm:w-16 bg-[#fef636]/70" />
                    </motion.div>

                    <motion.p
                        style={{ opacity: descVisible, y: descY }}
                        className="max-w-xs sm:max-w-2xl md:max-w-5xl lg:max-w-6xl text-center text-[#FFFFFF] font-Giest font-medium text-[clamp(1.45rem,3.5vw,3.5rem)] leading-tight"
                    >
                        {DESC_WORDS.map((word, i) => {
                            const start = STAGE.descStart + i * wordStep;
                            const end = Math.min(STAGE.descEnd, start + wordStep + wordOverlap);
                            return (
                                <DescWord
                                    key={i}
                                    word={word}
                                    scrollYProgress={scrollYProgress}
                                    start={start}
                                    end={end}
                                />
                            );
                        })}
                    </motion.p>
                </div>
            </div>
        </motion.div>
    );
}

export default function SenseHero() {
    const containerRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    return (
        <section ref={containerRef} className="relative h-[300vh]">
            <AnimatedHero scrollYProgress={scrollYProgress} />
        </section>
    );
}
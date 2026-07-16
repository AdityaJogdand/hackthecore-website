import { motion, useScroll, useTransform, useMotionValue, animate } from "framer-motion";
import { useRef, useEffect } from "react";

const ease = [0.22, 1, 0.36, 1];

const description =
    "Hackthecore is a technology-driven developer ecosystem that empowers students to learn, build, and innovate. We bridge the gap between student talent and industry through hackathons, communities, and real-world opportunities.";

const STAGE = {
    waveExitStart: 0.25,
    waveExitEnd: 0.55,
    bgStart: 0.3,
    bgEnd: 0.62,
    descStart: 0.62,
    descEnd: 0.85,
};

const WAVE_PATH_D = `
    M -50 300
    C 60 -80, 210 -120, 320 190
    C 400 320, 500 340, 590 210
    C 660 100, 760 30, 880 160
    C 970 260, 1060 300, 1140 190
    C 1190 130, 1220 150, 1250 210
`;

export default function SenseHero() {
    const containerRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const drawProgress = useMotionValue(0);
    useEffect(() => {
        const controls = animate(drawProgress, 1, { duration: 1.6, ease });
        return () => controls.stop();
    }, []);

    const exitProgress = useTransform(scrollYProgress, [STAGE.waveExitStart, STAGE.waveExitEnd], [1, 0]);
    const pathLength = useTransform([drawProgress, exitProgress], ([d, e]) => Math.min(d, e));

    const bgColor = useTransform(scrollYProgress, [STAGE.bgStart, STAGE.bgEnd], ["#FFFFFF", "#0C0C0D"]);
    const headingColor = useTransform(scrollYProgress, [STAGE.bgStart, STAGE.bgEnd], ["#0a0a0a", "#FFFFFF"]);

    // FIX: compose entrance (drawProgress 0→1) and exit (scroll-driven) into a single
    // MotionValue so there is no initial/animate fighting with style on the same property.
    const headingOpacity = useTransform(
        [drawProgress, scrollYProgress],
        ([d, s]) => {
            // Entrance: 0→1 as drawProgress goes 0→1 on mount (1.6s animation)
            const entrance = d;
            // Exit: 1→0 between waveExitStart and descStart
            const exitRange = STAGE.descStart - STAGE.waveExitStart;
            const exitT = Math.max(0, Math.min(1, (s - STAGE.waveExitStart) / exitRange));
            const exit = 1 - exitT;
            return Math.min(entrance, exit);
        }
    );

    const headingY = useTransform(
        [drawProgress, scrollYProgress],
        ([d, s]) => {
            // Entrance: slides up from 30px as drawProgress animates in
            const entranceY = (1 - d) * 30;
            // Exit: moves up to -40px between waveExitStart and descStart
            const exitRange = STAGE.descStart - STAGE.waveExitStart;
            const exitT = Math.max(0, Math.min(1, (s - STAGE.waveExitStart) / exitRange));
            const exitY = exitT * -40;
            return entranceY + exitY;
        }
    );

    const descOpacity = useTransform(scrollYProgress, [STAGE.descStart, STAGE.descEnd], [0, 1]);
    const descY = useTransform(scrollYProgress, [STAGE.descStart, STAGE.descEnd], [40, 0]);
    const descScale = useTransform(scrollYProgress, [STAGE.descStart, STAGE.descEnd], [0.85, 1]);

    const waveOpacity = useTransform(
        scrollYProgress,
        [STAGE.waveExitStart, STAGE.waveExitEnd - 0.05, STAGE.waveExitEnd],
        [1, 1, 0]
    );

    return (
        <section ref={containerRef} className="relative h-[300vh]">
            <motion.div
                style={{ backgroundColor: bgColor }}
                className="sticky top-0 h-screen w-full overflow-hidden"
            >
                {/* --- Desktop: scroll-driven sequence --- */}
                <div className="relative hidden md:block h-full w-full">
                    <svg
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 w-full h-full z-20"
                        viewBox="0 -180 1200 680"
                        preserveAspectRatio="none"
                    >
                        <defs>
                            <linearGradient id="ribbonGradient" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="#FEF636" />
                                <stop offset="50%" stopColor="#FEF636" />
                                <stop offset="100%" stopColor="#FEF636" />
                            </linearGradient>
                        </defs>
                        <motion.path
                            style={{
                                pathLength,
                                opacity: waveOpacity,
                            }}
                            d={WAVE_PATH_D}
                            stroke="url(#ribbonGradient)"
                            strokeWidth="160"
                            strokeLinecap="round"
                            fill="none"
                        />
                    </svg>

                    <div className="relative z-40 flex h-full max-w-[1200px] mx-auto flex-col items-center justify-center text-center px-6">
                        {/*
                            FIX: Removed initial={{ opacity: 0, y: 30 }} and animate={{ opacity: 1, y: 0 }}.
                            Those declarative props were fighting the style MotionValues for the same
                            properties. In Framer Motion, style MotionValues take precedence over
                            animate, so animate({ opacity: 1 }) never won against style={{ opacity }},
                            leaving the element stuck at initial opacity: 0 forever.
                            The entrance is now handled entirely inside headingOpacity / headingY above.
                        */}
                        <motion.h1
                            style={{
                                color: headingColor,
                                y: headingY,
                                opacity: headingOpacity,
                            }}
                            className="font-druk font-black uppercase tracking-tight leading-none text-[clamp(3.5rem,6vw,7rem)]"
                        >
                            More Than Just Hackathons
                        </motion.h1>

                        <div className="absolute inset-0 flex items-center justify-center z-40 px-8">
                            <motion.p
                                style={{
                                    opacity: descOpacity,
                                    y: descY,
                                }}
                                className="max-w-6xl text-center text-[#fef636] font-druk font-medium text-[clamp(2rem,3vw,3.5rem)] leading-tight"
                            >
                                {description}
                            </motion.p>
                        </div>
                    </div>
                </div>

                {/* --- Mobile fallback: simple stacked reveal, no scroll-jacked wave --- */}
                <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-6 md:hidden">
                    <h1 className="font-druk font-black uppercase tracking-tight leading-none text-[clamp(3rem,14vw,4.5rem)] text-gray-950">
                        More Than Just Hackathons
                    </h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.7, ease, delay: 0.4 }}
                        className="mt-4 max-w-md text-lg text-black-700"
                    >
                        {description}
                    </motion.p>
                </div>
            </motion.div>
        </section>
    );
}
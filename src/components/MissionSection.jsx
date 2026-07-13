import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import video1 from "@/assets/videos/1.MP4";
import video2 from "@/assets/videos/2.MP4";
import video3 from "@/assets/videos/3.mov";
import video4 from "@/assets/videos/4.MP4";
import video5 from "@/assets/videos/5.MP4";
import video6 from "@/assets/videos/6.MP4";
import video7 from "@/assets/videos/7.MP4";
import video8 from "@/assets/videos/8.MP4";
const RISE_SPAN = 0.35; // shorter rise window per card = less overlap between neighbors

const VIDEOS = [
    {
        id: "kpop",
        src: video1,
        position: "left-1/2 -translate-x-1/2 sm:left-[32%] sm:translate-x-0 md:left-[26%]",
        size: "w-[120px] h-[150px] sm:w-[170px] sm:h-[210px] md:w-[220px] md:h-[280px]",
        rotate: -3,
        z: 5,
        start: 0,
    },
    {
        id: "ski",
        src: video2,
        position: "left-[2%] sm:left-[4%] md:left-[8%]",
        size: "w-[110px] h-[86px] sm:w-[180px] sm:h-[140px] md:w-[260px] md:h-[200px]",
        rotate: -2,
        z: 25,
        start: 0.125,
    },
    {
        id: "fight",
        src: video3,
        position: "right-[2%] sm:right-[4%] md:right-[8%]",
        size: "w-[120px] h-[96px] sm:w-[190px] sm:h-[150px] md:w-[290px] md:h-[230px]",
        rotate: 2,
        z: 5,
        start: 0.25,
    },
    {
        id: "dance",
        src: video4,
        position: "left-[10%] sm:left-[12%] md:left-[16%]",
        size: "w-[100px] h-[120px] sm:w-[160px] sm:h-[200px] md:w-[220px] md:h-[280px]",
        rotate: -1,
        z: 25,
        start: 0.375,
    },
    {
        id: "skate",
        src: video5,
        position: "right-[10%] sm:right-[12%] md:right-[16%]",
        size: "w-[100px] h-[120px] sm:w-[160px] sm:h-[200px] md:w-[220px] md:h-[280px]",
        rotate: 1,
        z: 5,
        start: 0.5,
    },
    {
        id: "surf",
        src: video6,
        position: "left-[20%] sm:left-[22%] md:left-[26%]",
        size: "w-[100px] h-[120px] sm:w-[160px] sm:h-[200px] md:w-[220px] md:h-[280px]",
        rotate: -1,
        z: 25,
        start: 0.625,
    },
    {
        id: "climb",
        src: video7,
        position: "right-[20%] sm:right-[22%] md:right-[26%]",
        size: "w-[100px] h-[120px] sm:w-[160px] sm:h-[200px] md:w-[220px] md:h-[280px]",
        rotate: 1,
        z: 5,
        start: 0.75,
    },
];

 // how much of the total scroll each card's rise+exit takes

function VideoCard({ src, position, size, rotate, z, start, scrollYProgress }) {
    const s = start;
    const gone = Math.min(s + RISE_SPAN, 1);

    // slower rise: same scroll distance (s -> gone), but travels less vertical
    // distance (45vh instead of 60vh) so it reads as more relaxed/slow-motion
    const y = useTransform(scrollYProgress, [s, gone], ["45vh", "-45vh"]);
    const scale = useTransform(scrollYProgress, [s, gone], [0.8, 1.25]);

    const span = gone - s;
    const fadeOffset = Math.min(RISE_SPAN * 0.1, span / 2);
    // peak opacity dropped from 1 -> 0.65 so videos sit further back visually
    const opacity = useTransform(
        scrollYProgress,
        [s, s + fadeOffset, gone - fadeOffset, gone],
        [0, 0.65, 0.65, 0]
    );

    return (
        <motion.div
            style={{ y, scale, opacity, rotate: `${rotate}deg`, zIndex: z }}
            className={`absolute top-1/2 -translate-y-1/2 ${position} ${size} rounded-xl sm:rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.55)] ring-1 ring-white/10 pointer-events-none will-change-transform`}
        >
            <video src={src} autoPlay muted loop playsInline className="w-full h-full object-cover" />
        </motion.div>
    );
}
export default function MissionSection() {
    const sectionRef = useRef(null);

    // "before" | "pinned" | "after" — manual stand-in for position:sticky.
    // Sticky breaks the moment ANY ancestor sets overflow other than visible,
    // which is extremely common (page-transition wrappers, scroll containers, etc).
    // position:fixed doesn't have that problem, so we drive the pin/release
    // ourselves off real scroll progress instead of relying on sticky.
    const [phase, setPhase] = useState("before");

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"],
    });

    useMotionValueEvent(scrollYProgress, "change", (v) => {
        if (v <= 0) setPhase("before");
        else if (v >= 1) setPhase("after");
        else setPhase("pinned");
    });

    const stageClass =
        phase === "pinned"
            ? "fixed top-0 left-0 right-0"
            : phase === "after"
            ? "absolute bottom-0 left-0 right-0"
            : "absolute top-0 left-0 right-0";

    return (
        <section
            id="about-scroll"
            ref={sectionRef}
            className="relative bg-[#0C0C0D] text-[#EDEDE6] min-h-[260vh] sm:min-h-[300vh] md:min-h-[320vh]"
        >
            {/* text stays visually fixed in the viewport while videos rise past it */}
            <div
                className={`${stageClass} h-screen w-full flex items-center justify-center px-4 sm:px-8 md:px-12 lg:px-20 overflow-hidden`}
            >
                <div className="relative max-w-[1400px] mx-auto w-full h-full flex items-center justify-center">

                    {/* every video, positioned by its own z-index relative to the text (z-10) */}
                    {VIDEOS.map((v) => (
                        <VideoCard key={v.id} {...v} scrollYProgress={scrollYProgress} />
                    ))}

                    {/* OUR MISSION — stays put, sits at z-10 between the "behind" and "front" videos */}
                    <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-10 md:px-20">
                    <h2
                        className="font-['SansPlomb'] uppercase leading-[0.95] tracking-[-0.01em] text-[#EDEDE6]/80
                        text-[clamp(3rem,18vw,12rem)]
                        sm:text-[clamp(4.5rem,10vw,8rem)]
                        md:text-[clamp(6rem,8vw,10rem)]"
                    >
                        Our Mission
                    </h2>

                        <p className="max-w-[320px] sm:max-w-3xl md:max-w-4xl mt-6 sm:mt-8 text-white font-bold text-[1.15rem] sm:text-[1.55rem] md:text-[1.8rem] leading-tight">
  Building a thriving{" "}
  <span className="text-yellow-400 font-['Caveat'] text-[2em]">
    ecosystem
  </span>{" "}
  where student talent meets{" "}
  <span className="text-yellow-400 font-['Caveat'] text-[2em]">
    opportunity
  </span>
  . Through communities, hackathons, and industry collaborations, we <span className="text-yellow-400 font-['Caveat'] text-[2em]">
    empower
  </span> aspiring developers to learn, innovate, and{" "}
  <span className="text-yellow-400 font-['Caveat'] text-[2em]">
    grow
  </span>{" "}
  beyond traditional events.
</p>
                    </div>

                </div>
            </div>
        </section>
    );
}
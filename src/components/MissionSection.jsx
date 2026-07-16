import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import video1 from "@/assets/videos/1.MP4";
import video2 from "@/assets/videos/2.MP4";
import video3 from "@/assets/videos/3.mov";
import video4 from "@/assets/videos/4.MP4";
import video5 from "@/assets/videos/5.MP4";
import video6 from "@/assets/videos/6.MP4";
import video7 from "@/assets/videos/7.MP4";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

const RISE_SPAN = 0.35;

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

function VideoCard({ src, position, size, rotate, z, start, scrollYProgress }) {
  const s = start;
  const gone = Math.min(s + RISE_SPAN, 1);
  const y = useTransform(scrollYProgress, [s, gone], ["45vh", "-45vh"]);
  const scale = useTransform(scrollYProgress, [s, gone], [0.8, 1.25]);
  const span = gone - s;
  const fadeOffset = Math.min(RISE_SPAN * 0.1, span / 2);
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
  // outerRef: the tall scroll container (320vh). GSAP pins innerRef inside it.
  const outerRef = useRef(null);
  // innerRef: the 100vh viewport panel that gets pinned by GSAP
  const innerRef = useRef(null);

  // Framer Motion still drives the video cards — we just give it the same
  // scroll target/offset so it stays in sync with the GSAP pin.
  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: outerRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: innerRef.current,   // pin ONLY the inner panel, not the whole container
        pinSpacing: false,       // outerRef already provides the scroll space (320vh)
        anticipatePin: 1,
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    // outerRef: tall container — provides scroll distance, bg color, sits in normal flow
    <section
      id="about-scroll"
      ref={outerRef}
      className="relative bg-[#0C0C0D] text-[#EDEDE6] min-h-[260vh] sm:min-h-[300vh] md:min-h-[320vh]"
    >
      {/*
        innerRef: the pinned viewport panel.
        height: 100vh, no position:fixed/absolute — GSAP handles the pin.
        This is the KEY difference from the old manual phase/fixed approach:
        GSAP's pin is synchronous with the scroll compositor, so there is
        no React state update lag causing the flash/jump at the seam.
      */}
      <div
        ref={innerRef}
        className="w-full overflow-hidden bg-[#0C0C0D]"
        style={{ height: "100vh" }}
      >
        <div className="relative max-w-[1400px] mx-auto w-full h-full flex items-center justify-center px-4 sm:px-8 md:px-12 lg:px-20">

          {VIDEOS.map((v) => (
            <VideoCard key={v.id} {...v} scrollYProgress={scrollYProgress} />
          ))}

          <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-10 md:px-20">
            <h2
              className="font-['SansPlomb'] uppercase leading-[0.95] tracking-[-0.01em] text-[#EDEDE6]/80
              text-[clamp(3rem,18vw,12rem)]
              sm:text-[clamp(4.5rem,10vw,8rem)]
              md:text-[clamp(6rem,8vw,10rem)]"
            >
              Our Mission
            </h2>

            <p className="max-w-[320px] sm:max-w-3xl md:max-w-4xl mt-6 sm:mt-8 text-white text-[1.15rem] sm:text-[1.55rem] md:text-[1.8rem] leading-tight">
              Building a thriving{" "}
              <span className="text-[#FEF636] font-['Caveat'] text-[2em]">ecosystem</span>{" "}
              where student talent meets{" "}
              <span className="text-[#FEF636] font-['Caveat'] text-[2em]">opportunity</span>. Through
              communities, hackathons, and industry collaborations, we{" "}
              <span className="text-[#FEF636] font-['Caveat'] text-[2em]">empower</span> aspiring
              developers to learn, innovate, and{" "}
              <span className="text-[#FEF636] font-['Caveat'] text-[2em]">grow</span> beyond
              traditional events.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
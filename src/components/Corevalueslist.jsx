import { useRef, useLayoutEffect, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import innovationImg from "@/assets/innovation.jpeg";
import excellenceImg from "@/assets/excellence.jpeg";
import collaborationImg from "@/assets/collabration-1.png";
import communityImg from "@/assets/communtiy first-1.png";
import growthImg from "@/assets/growth-1.png";

gsap.registerPlugin(ScrollTrigger);

const ease = [0.16, 1, 0.3, 1];

const coreValues = [
  {
    title: "Innovation",
    copy: "Encouraging creativity and solving real-world problems through technology.",
    accent: "#1E3A8A",
    img: innovationImg,
  },
  {
    title: "Community First",
    copy: "Building meaningful relationships and creating a supportive environment",
    accent: "#166534",
    img: communityImg,
  },
  {
    title: "Excellence",
    copy: "Recognizing effort, quality, and genuine talent over popularity or participation alone.",
    accent: "#881337",
    img: excellenceImg,
  },
  {
    title: "Collaboration",
    copy: "Bringing students, mentors, and industry leaders together to create greater impact.",
    accent: "#312E81",
    img: collaborationImg,
  },
  {
    title: "Growth",
    copy: "Promoting continuous learning, experimentation, and personal development.",
    accent: "#5B3A29",
    img: growthImg,
  },
];

const INK = "#fef636";
const PAPER = "#FAFAF8";

function CoreValuesReveal() {
    const sectionRef = useRef(null);
    const pinRef = useRef(null);
    const panelRef = useRef(null);
    const listRef = useRef(null);
    const [hovered, setHovered] = useState(-1);

    useLayoutEffect(() => {
        const panel = panelRef.current;
        const list = listRef.current;
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        // starting state: a big semicircle sitting on the bottom edge.
        // cy stays pinned to 100% the whole time — the container clips the
        // lower half of the circle away, so what's visible always reads as
        // a semicircle/dome rising off the bottom, right up until the
        // radius is large enough to cover the full viewport.
        panel.style.setProperty("--cx", "50%");
        panel.style.setProperty("--cy", "100%");
        panel.style.setProperty("--r", "22%");

        if (reduceMotion) {
            // skip the scroll choreography, just show the revealed end-state
            panel.style.setProperty("--r", "120%");
            gsap.set(list, { autoAlpha: 1, y: 0 });
            return;
        }

        gsap.set(list, { autoAlpha: 0, y: 24 });

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=200%",
                    scrub: 0.6,
                    pin: pinRef.current,
                    pinSpacing: true,
                },
            });

            // phase 1 — the semicircle domes upward and grows, still
            // anchored to the bottom edge, until it swallows the viewport
            // (120% comfortably covers corner-to-corner from a bottom-center origin)
            tl.to(panel, { "--r": "120%", ease: "power2.inOut", duration: 0.75 }, 0)
                // phase 2 — the values list settles in on top of the revealed panel
                .to(list, { autoAlpha: 1, y: 0, ease: "power2.out", duration: 0.25 }, 0.62);
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <>
            {/* header — split layout, left-weighted, sits on the plain white page above the reveal */}

            {/* interactive value reveal — GSAP driven, pinned, full-bleed */}
            <section
                ref={sectionRef}
                className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen"
                style={{ backgroundColor: PAPER }}
            >
            <div
                ref={pinRef}
                className="relative h-screen w-screen overflow-hidden"
                style={{ backgroundColor: PAPER, height: "100dvh" }}
            >
                {/* the semicircle/circle panel — clipped via CSS vars animated by GSAP/ScrollTrigger */}
                <div
                    ref={panelRef}
                    className="absolute inset-0"
                    style={{
                        backgroundColor: INK,
                        clipPath: "circle(var(--r) at var(--cx) var(--cy))",
                        WebkitClipPath: "circle(var(--r) at var(--cx) var(--cy))",
                    }}
                >
                    {/* stacked background photos, crossfaded by hover */}
                    {coreValues.map((value, i) =>
                        value.img ? (
                            <img
                                key={value.title}
                                src={value.img}
                                alt=""
                                aria-hidden="true"
                                className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out"
                                style={{ opacity: hovered === i ? 1 : 0 }}
                            />
                        ) : null
                    )}

                    {/* scrim so text stays legible over whichever photo is showing */}
                    <div
                        className="absolute inset-0 transition-opacity duration-700"
                        style={{
                            background: `linear-gradient(180deg, ${INK}E6 0%, ${INK}CC 45%, ${INK}F2 100%)`,
                            opacity: hovered === -1 ? 1 : 0.86,
                        }}
                    />

                    {/* the values list itself */}
                    <div
                        ref={listRef}
                        className="relative z-[1] flex h-full w-full flex-col items-center justify-center px-4 sm:px-8"
                    >
                        <span
                            className="mb-2 sm:mb-4 font-mono text-[0.65rem] sm:text-[0.75rem] font-bold uppercase tracking-[0.3em]"
                            style={{ color: `#000000` }}
                        >
                            What we build on
                        </span>

                        <ul className="flex w-full flex-col gap-0 divide-y divide-black/20">
                            {coreValues.map((value, i) => (
                                <li
                                    key={value.title}
                                    onMouseEnter={() => setHovered(i)}
                                    onMouseLeave={() => setHovered(-1)}
                                    onClick={() => setHovered((prev) => (prev === i ? -1 : i))}
                                    className="group relative flex cursor-pointer flex-col items-center justify-center gap-1 py-1 sm:py-1.5 lg:cursor-default lg:gap-0 lg:py-0.5"
                                >
                                    <h3
                                        className="font-['Bebas_Neue',sans-serif] uppercase  leading-[0.86] tracking-[-0.01em] text-center transition-colors duration-300"
                                        style={{
                                            fontSize: "clamp(2.5rem, min(13vw, 12vh), 11rem)",
                                            color: hovered === i ? value.accent : "#000000",
                                        }}
                                    >
                                        {value.title}
                                    </h3>

                                    {/* mobile/touch copy — shown inline below the title on tap, since there's no hover on touch */}
                                    <p
                                        className="block max-w-[20rem] overflow-hidden text-center text-sm font-medium leading-relaxed transition-all duration-300 lg:hidden"
                                        style={{
                                            color: `#000000`,
                                            maxHeight: hovered === i ? "6rem" : "0px",
                                            opacity: hovered === i ? 1 : 0,
                                        }}
                                    >
                                        {value.copy}
                                    </p>

                                    {/* desktop/hover copy — floats to the side since the title is too large to sit beside */}
                                    <p
                                        className="pointer-events-none absolute right-4 sm:right-10 lg:right-16 hidden max-w-[24rem] text-right text-base sm:text-lg font-medium leading-relaxed lg:block transition-opacity duration-300"
                                        style={{
                                            color: `#000000`,
                                            opacity: hovered === i ? 1 : 0,
                                        }}
                                    >
                                        {value.copy}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            </section>
        </>
    );
}

export default CoreValuesReveal;
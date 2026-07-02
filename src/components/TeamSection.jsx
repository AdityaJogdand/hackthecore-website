import { useRef, useLayoutEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Drop each teammate's video/photo in as its own import at the top of the
// file, e.g. import aishaVideo from "@/assets/team/aisha.mp4", then
// reference it below as `video`. `img` still works as a static fallback/
// poster frame. Leave both null for anyone whose media isn't ready yet —
// the card falls back to initials so the grid never breaks.
//
// Layout: row 1 holds 2 cards, row 2 (and on) holds 3 cards each. That
// pattern is driven by the col-span on each entry below — first two
// entries span half the row, the rest span a third.
import main1Video from "@/assets/main_1.mp4";

const team = [
    { name: "Sharvan Kadam", role: "Founder", img: null, video: main1Video },
    { name: "Bhavesh", role: "Co Founder", img: null, video: main1Video },
    { name: "Full Name", role: "Role / Team", img: null, video: null },
    { name: "Full Name", role: "Role / Team", img: null, video: null },
    { name: "Full Name", role: "Role / Team", img: null, video: null },
    { name: "Full Name", role: "Role / Team", img: null, video: null },
    { name: "Full Name", role: "Role / Team", img: null, video: null },
    { name: "Full Name", role: "Role / Team", img: null, video: null },
];

function initials(name) {
    return name
        .split(" ")
        .map((part) => part[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

function TeamCard({ name, role, img, video, cardRef, spanClass }) {
    const videoRef = useRef(null);

    const handleEnter = useCallback(() => {
        const v = videoRef.current;
        if (!v) return;
        v.currentTime = 0;
        // play() returns a promise that can reject if the user moves the
        // mouse away before it resolves — swallow that instead of throwing.
        v.play().catch(() => { });
    }, []);

    const handleLeave = useCallback(() => {
        const v = videoRef.current;
        if (!v) return;
        v.pause();
        v.currentTime = 0;
    }, []);

    return (
        <div
            ref={cardRef}
            className={`group flex flex-col items-center text-center ${spanClass}`}
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
        >
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[20px] bg-white/[0.04]">
                {video ? (
                    <video
                        ref={videoRef}
                        src={video}
                        poster={img || undefined}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        className="absolute inset-0 h-full w-full object-cover grayscale transition-all duration-500 ease-out group-hover:grayscale-0 group-hover:scale-105"
                    />
                ) : img ? (
                    <img
                        src={img}
                        alt={name}
                        className="absolute inset-0 h-full w-full object-cover grayscale transition-all duration-500 ease-out group-hover:grayscale-0 group-hover:scale-105"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-['SansPlomb',sans-serif] text-4xl font-black text-white/15">
                            {initials(name)}
                        </span>
                    </div>
                )}
            </div>
            <h3 className="mt-4 text-base sm:text-lg font-semibold text-white">{name}</h3>
            <span className="text-xs sm:text-sm text-white/50">{role}</span>
        </div>
    );
}

// First 2 cards take half the 6-col track each (row of 2),
// every card after that takes a third (rows of 3).
function spanFor(i) {
    return i < 2 ? "col-span-2 sm:col-span-3" : "col-span-2 sm:col-span-2";
}

function TeamSection() {
    const gridRef = useRef(null);
    const cardRefs = useRef([]);

    useLayoutEffect(() => {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduceMotion) return;

        const ctx = gsap.context(() => {
            cardRefs.current.forEach((card, i) => {
                if (!card) return;
                gsap.set(card, { autoAlpha: 0, y: 24 });
                ScrollTrigger.create({
                    trigger: gridRef.current,
                    start: "top 85%",
                    once: true,
                    onEnter: () =>
                        gsap.to(card, {
                            autoAlpha: 1,
                            y: 0,
                            duration: 0.6,
                            ease: "power3.out",
                            delay: i * 0.05,
                        }),
                });
            });
        }, gridRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className="px-5 py-20 text-white md:px-12 lg:px-20" style={{ backgroundColor: "#212120" }}>
            <div className="mx-auto max-w-7xl">
                <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/50">
                    The people behind it
                </span>
                <h2
                    className="mt-2 font-['SansPlomb',sans-serif] font-black uppercase leading-[0.9] tracking-[-0.01em]"
                    style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)" }}
                >
                    Meet the{" "}
                    <span
                        className="inline-block border-b-[0.06em] pb-1"
                        style={{ color: "#F4DD0E", borderColor: "#F4DD0E" }}
                    >
                        team
                    </span>
                </h2>

                <div
                    ref={gridRef}
                    className="mt-12 sm:mt-16 grid grid-cols-2 sm:grid-cols-6 gap-x-5 gap-y-10 sm:gap-x-6"
                >
                    {team.map((member, i) => (
                        <TeamCard
                            key={i}
                            {...member}
                            cardRef={(el) => (cardRefs.current[i] = el)}
                            spanClass={spanFor(i)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default TeamSection;
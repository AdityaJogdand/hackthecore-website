import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Drop each teammate's photo in as its own import at the top of the file,
// e.g. import aishaPhoto from "@/assets/team/aisha.jpg", then reference it
// below. Leave `img` as null for anyone whose photo isn't ready yet — the
// card falls back to initials so the grid never breaks.
const team = [
    { name: "Full Name", role: "Role / Team", img: null },
    { name: "Full Name", role: "Role / Team", img: null },
    { name: "Full Name", role: "Role / Team", img: null },
    { name: "Full Name", role: "Role / Team", img: null },
    { name: "Full Name", role: "Role / Team", img: null },
    { name: "Full Name", role: "Role / Team", img: null },
    { name: "Full Name", role: "Role / Team", img: null },
    { name: "Full Name", role: "Role / Team", img: null },
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

function TeamCard({ name, role, img, cardRef }) {
    return (
        <div ref={cardRef} className="group flex flex-col">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[20px] bg-white/[0.04] border border-white/10">
                {img ? (
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
                <div className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-[#F4DD0E] transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </div>
            <h3 className="mt-4 text-base sm:text-lg font-semibold text-white">{name}</h3>
            <span className="text-xs sm:text-sm text-white/50">{role}</span>
        </div>
    );
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
        <section className="bg-black px-5 py-20 text-white md:px-12 lg:px-20">
            <div className="mx-auto max-w-6xl">
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
                    className="mt-12 sm:mt-16 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4"
                >
                    {team.map((member, i) => (
                        <TeamCard key={i} {...member} cardRef={(el) => (cardRefs.current[i] = el)} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default TeamSection;
import { useRef, useLayoutEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import glimpseImageOne from "@/assets/SFM_5081.JPG";
import glimpseImageTwo from "@/assets/SFM_5083.JPG";
import glimpseImageFour from "@/assets/SFM_6818.JPG";
import hackUpLogo from "@/assets/HackUp.PNG";

gsap.registerPlugin(ScrollTrigger);

// One bento mosaic per event, laid out left to right: Bento-1, Bento-2, Bento-3...
// Add a new object here for every new edition.
// Card order matters within each event: with grid-auto-flow "column" and
// 2 fixed rows, items fill top-to-bottom then wrap into the next column.
// A row-span-2/col-span-2 item eats a full 2-column block by itself; two
// 1x1 items back to back share a single column.
const events = [
    {
        name: "HackUp",
        tag: "Edition 01",
        cards: [
            {
                type: "image",
                area: "hero",
                img: glimpseImageOne,
                alt: "Opening ceremony crowd",
                eyebrow: "Edition 01",
                title: "Where it all began",
            },
            { type: "logo", area: "logo" },
            {
                type: "stat",
                area: "stat",
                value: "500+",
                label: "Builders across three editions",
            },
            {
                type: "image",
                area: "team",
                img: glimpseImageTwo,
                alt: "Team debugging at 2am",
                eyebrow: "Hour 19",
                title: "Late-night breakthroughs",
            },
            {
                type: "quote",
                area: "quote",
                text: "“We walked in with an idea on a napkin and walked out with a working product — and a team we still build with.”",
                attribution: "— Past participant",
            },
            {
                type: "image",
                area: "closing",
                img: glimpseImageFour,
                alt: "Winning team on stage",
                eyebrow: "Closing",
                title: "Celebrating the wins",
            },
        ],
    },
    {
        // Placeholder second event — swap copy, stat, quote and images
        // for the real edition once you have them.
        name: "HackUp 2.0",
        tag: "Edition 02",
        cards: [
            {
                type: "image",
                area: "hero",
                img: glimpseImageTwo,
                alt: "Placeholder — opening moment",
                eyebrow: "Edition 02",
                title: "Bigger, louder, faster",
            },
            { type: "logo", area: "logo" },
            {
                type: "stat",
                area: "stat",
                value: "1000+",
                label: "Applicants this edition",
            },
            {
                type: "image",
                area: "team",
                img: glimpseImageOne,
                alt: "Placeholder — teams building",
                eyebrow: "Hour 06",
                title: "Heads down, building",
            },
            {
                type: "quote",
                area: "quote",
                text: "“Placeholder quote — swap for a real testimonial from this edition.”",
                attribution: "— Past participant",
            },
            {
                type: "image",
                area: "closing",
                img: glimpseImageFour,
                alt: "Placeholder — closing moment",
                eyebrow: "Closing",
                title: "A new bar, set",
            },
        ],
    },
];

function ImageCard({ img, alt, eyebrow, title }) {
    return (
        <div className="group relative h-full w-full overflow-hidden rounded-[20px]">
            <img
                src={img}
                alt={alt}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
            <div className="relative flex h-full flex-col justify-end p-5 sm:p-6">
                <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/60">
                    {eyebrow}
                </span>
                <h3 className="mt-1 text-lg sm:text-xl font-semibold text-white">{title}</h3>
            </div>
        </div>
    );
}

function LogoCard() {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-[20px] border border-white/10 bg-white/[0.04] p-5">
            <img src={hackUpLogo} alt="HackUp" className="w-full max-w-[140px] object-contain" />
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/50">
                Since day one
            </span>
        </div>
    );
}

function StatCard({ value, label }) {
    return (
        <div className="flex h-full w-full flex-col justify-center rounded-[20px] border border-white/10 bg-white/[0.04] p-5 sm:p-6">
            <span className="text-3xl sm:text-4xl font-bold tracking-tight text-white">{value}</span>
            <span className="mt-2 text-xs sm:text-sm text-white/60">{label}</span>
        </div>
    );
}

function QuoteCard({ text, attribution }) {
    return (
        <div className="flex h-full w-full flex-col justify-center rounded-[20px] border border-white/10 bg-white/[0.04] p-5 sm:p-6">
            <p className="text-sm sm:text-base leading-relaxed text-white/85">{text}</p>
            <span className="mt-3 text-xs sm:text-sm text-white/50">{attribution}</span>
        </div>
    );
}

// A single event's mosaic — fixed-size grid, no internal scroll of its own.
// It just sits shrink-0 inside the shared outer track.
// Top block: hero (2 cols x 2 rows) | logo/stat stacked | team/quote stacked.
// Bottom block: closing image spans the full width, its own row — no holes.
const MOSAIC_AREAS = `
    "hero hero logo team"
    "hero hero stat quote"
    "closing closing closing closing"
`;

function EventMosaic({ name, tag, cards, cardRef }) {
    return (
        <div className="shrink-0">
            <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-['SansPlomb',sans-serif] text-xl sm:text-2xl font-bold uppercase tracking-tight text-white">
                    {name}
                </h3>
                <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/40">
                    {tag}
                </span>
            </div>

            <div
                className="mt-5 sm:mt-6 grid gap-4 sm:gap-5"
                style={{
                    gridTemplateColumns: "repeat(4, 220px)",
                    gridTemplateRows: "220px 220px 220px",
                    gridTemplateAreas: MOSAIC_AREAS,
                }}
            >
                {cards.map((card, i) => (
                    <div key={i} ref={cardRef(i)} style={{ gridArea: card.area }}>
                        {card.type === "image" && <ImageCard {...card} />}
                        {card.type === "logo" && <LogoCard />}
                        {card.type === "stat" && <StatCard {...card} />}
                        {card.type === "quote" && <QuoteCard {...card} />}
                    </div>
                ))}
            </div>
        </div>
    );
}

function JourneySoFarBento() {
    const trackRef = useRef(null);
    const eventGroupRefs = useRef([]); // one wrapper el per event, for step-scrolling
    const cardRefs = useRef({}); // keyed "eventIndex-cardIndex"
    const [atStart, setAtStart] = useState(true);
    const [atEnd, setAtEnd] = useState(false);

    useLayoutEffect(() => {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const track = trackRef.current;

        const ctx = gsap.context(() => {
            if (!reduceMotion) {
                Object.values(cardRefs.current).forEach((card, i) => {
                    if (!card) return;
                    gsap.set(card, { autoAlpha: 0, y: 24 });
                    ScrollTrigger.create({
                        trigger: track,
                        start: "top 85%",
                        once: true,
                        onEnter: () =>
                            gsap.to(card, {
                                autoAlpha: 1,
                                y: 0,
                                duration: 0.6,
                                ease: "power3.out",
                                delay: i * 0.04,
                            }),
                    });
                });
            }
        }, trackRef);

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

    // step by one event-block width at a time (block width + gap)
    const scrollByStep = (direction) => {
        const track = trackRef.current;
        const first = eventGroupRefs.current[0];
        const second = eventGroupRefs.current[1];
        if (!track || !first) return;
        const step = second
            ? second.getBoundingClientRect().left - first.getBoundingClientRect().left
            : first.getBoundingClientRect().width;
        const max = track.scrollWidth - track.clientWidth;
        const target = Math.min(Math.max(track.scrollLeft + direction * step, 0), max);
        gsap.to(track, { scrollLeft: target, duration: 0.6, ease: "power3.out" });
    };

    return (
        <section className="bg-black px-5 py-20 text-white md:px-12 lg:px-20">
            <div className="mx-auto max-w-6xl">
                <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/50">
                    The story so far
                </span>
                <h2
                    className="mt-2 font-['SansPlomb',sans-serif] font-black uppercase leading-[0.9] tracking-[-0.01em]"
                    style={{ fontSize: "clamp(3rem, 9vw, 8rem)" }}
                >
                    Our journey &nbsp;

                    <span
                        style={{ color: "#F4DD0E", borderColor: "#F4DD0E" }}
                    >
                        so far ...
                    </span>
                </h2>

                <div
                    ref={trackRef}
                    className="jf-track mt-12 sm:mt-16 flex gap-10 sm:gap-14 overflow-x-auto pb-2"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {events.map((event, eIdx) => (
                        <div key={event.name} ref={(el) => (eventGroupRefs.current[eIdx] = el)}>
                            <EventMosaic
                                {...event}
                                cardRef={(cIdx) => (el) => {
                                    cardRefs.current[`${eIdx}-${cIdx}`] = el;
                                }}
                            />
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-end gap-3 mt-6 sm:mt-8">
                    <button
                        type="button"
                        aria-label="Scroll left"
                        disabled={atStart}
                        onClick={() => scrollByStep(-1)}
                        className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-white/25 text-white transition-all duration-300 hover:bg-white hover:text-black disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white disabled:cursor-not-allowed"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        aria-label="Scroll right"
                        disabled={atEnd}
                        onClick={() => scrollByStep(1)}
                        className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-white/25 text-white transition-all duration-300 hover:bg-white hover:text-black disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white disabled:cursor-not-allowed"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            <style>{`.jf-track::-webkit-scrollbar { display: none; }`}</style>
        </section>
    );
}

export default JourneySoFarBento;
import { useRef, useLayoutEffect, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Meloni from "@/assets/Meloni.jpg";
import Rahul from "@/assets/Rahul.jpg";
import Shravan from "@/assets/Shravan.jpg";
import Rugved from "@/assets/Rugved.jpg";
import Bhavesh from "@/assets/Bhavesh.jpg";
import ShravanKid from "@/assets/Shravankid.png";
import Rugvedkid from "@/assets/Rugvedkid.png";
import Bhaveshkid from "@/assets/Bhaveskid.png";
import Rahulkid from "@/assets/Rahulkid.png";
import Melonikid from "@/assets/Melonikid.png";
gsap.registerPlugin(ScrollTrigger);

const team = [
    {
        name: "Shravan Kadam",
        img: Shravan,
        hoverImg: ShravanKid,
        large: true,
    },
    { name: "Bhavesh Rajdev", img: Bhavesh, hoverImg: Bhaveshkid, large: true },
    { name: "Rugved Dalvi", img: Rugved, hoverImg: Rugvedkid, large: true },
    { name: "Rahul Patil", img: Rahul, hoverImg: Rahulkid, large: true },
    { name: "Meloni Shah", img: Meloni, hoverImg: Melonikid, large: true },
];

const words = [
    "Builders.",
    "Designers.",
    "Developers.",
    "Dreamers.",

];

function initials(name) {
    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

function TeamCard({ member, cardRef, spanClass }) {
    const isLarge = member.large;
    const [imgSrc, setImgSrc] = useState(member.img);

    return (
        <div
            ref={cardRef}
            className={`group flex flex-col items-center text-center ${spanClass}`}
        >
            <div
                className={
                    isLarge
                        ? "w-90 sm:w-80 lg:w-[28rem] xl:w-[25rem]"
                        : "w-90 sm:w-80 lg:w-[28rem] xl:w-[25rem]"
                }
            >
                {member.img ? (
                    <img
                        src={imgSrc}
                        alt={member.name}
                        onMouseEnter={() =>
                            member.hoverImg && setImgSrc(member.hoverImg)
                        }
                        onMouseLeave={() => setImgSrc(member.img)}
                        className="w-full h-auto object-contain"
                    />
                ) : (
                    <div className="aspect-[4/5] rounded-3xl bg-black/5 flex items-center justify-center">
                        <span
                            className="text-5xl font-black text-black/20"
                            style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                            {initials(member.name)}
                        </span>
                    </div>
                )}
            </div>

            <h3
                className={`mt-5 text-black ${
                    isLarge ? "text-2xl lg:text-3xl" : "text-xl lg:text-2xl"
                }`}
                style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 700,
                }}
            >
                {member.name}
            </h3>

            {member.role && (
                <p
                    className="mt-1 text-black/60"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                    {member.role}
                </p>
            )}
        </div>
    );
}

function spanFor(index) {
    // First card (Shravan) centered on first row
    if (index === 0) {
        return "col-span-2 sm:col-start-3 sm:col-span-2";
    }

    // Remaining four cards
    return "col-span-2 sm:col-span-3";
}

export default function TeamSection() {
    const sectionRef = useRef(null);
    const gridRef = useRef(null);
    const cardRefs = useRef([]);
    const wordsRef = useRef([]);
    const headingRef = useRef([]);
    const imageRefs = useRef([]);

    useLayoutEffect(() => {

        const ctx = gsap.context(() => {

            // Heading Animation — tied to the section itself, not the grid below it,
            // so it fires as soon as the hero text is actually on screen
            gsap.set(headingRef.current, {
                opacity: 0,
                y: 50,
            });

            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top 90%",
                once: true,
                onEnter: () => {
                    gsap.to(headingRef.current, {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        ease: "power4.out",
                        stagger: 0.12,
                    });
                },
            });

            // Hero Words — same fix, trigger off the section, not the grid
            gsap.set(wordsRef.current, {
                opacity: 0,
                y: 45,
            });

            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top 90%",
                once: true,
                onEnter: () => {
                    gsap.to(wordsRef.current, {
                        opacity: 1,
                        y: 0,
                        duration: 0.9,
                        ease: "power4.out",
                        stagger: 0.12,
                    });
                },
            });

            // Cards — stay tied to the grid, since they're genuinely lower
            // on the page and should wait until they're actually approaching view
            cardRefs.current.forEach((card, i) => {
                if (!card) return;

                gsap.set(card, {
                    autoAlpha: 0,
                    y: 40,
                });

                ScrollTrigger.create({
                    trigger: gridRef.current,
                    start: "top 80%",
                    once: true,
                    onEnter: () =>
                        gsap.to(card, {
                            autoAlpha: 1,
                            y: 0,
                            duration: 0.8,
                            ease: "power3.out",
                            delay: i * 0.08,
                        }),
                });
            });
        });

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="bg-[#FFFFFF] py-28 px-6 lg:px-16">
            <div className="mx-auto max-w-[1700px]">

                {/* HERO */}
                <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-16 lg:gap-24">

                    {/* LEFT */}
                    <div className="max-w-4xl">
                        <span className="uppercase tracking-[0.28em] text-xs text-black/40">
                            The people behind it
                        </span>

                        <div
                            className="mt-5 pb-4 font-['SansPlomb',sans-serif] font-black uppercase leading-[0.88]"
                            style={{
                                fontSize: "clamp(4rem,8vw,8rem)",
                            }}
                        >
                            <div className="overflow-hidden pb-3">
                                <div
                                    ref={(el) => (headingRef.current[0] = el)}
                                    className="text-black"
                                >
                                    Meet the{" "}
                                    <span className="text-[#F4DD0E]">
                                        Team
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="hidden lg:flex flex-col items-end text-right">
                        <div
                            className="font-['Geist_Variable'] font-medium uppercase tracking-[-0.05em] leading-[0.88]"
                            style={{
                                fontSize: "clamp(2.5rem,3vw,4rem)",
                            }}
                        >
                            {words.map((word, index) => (
                                <div
                                    key={word}
                                    className="overflow-hidden"
                                >
                                    <div
                                        ref={(el) =>
                                            (wordsRef.current[index] = el)
                                        }
                                        className={
                                            word === "Dreamers."
                                                ? "text-[#F4DD0E]"
                                                : "text-black/85"
                                        }
                                    >
                                        {word}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* TEAM GRID */}
                <div
                    ref={gridRef}
                    className="mt-28 grid grid-cols-2 sm:grid-cols-6 gap-y-20 gap-x-8 lg:gap-x-12"
                >
                    {team.map((member, i) => (
                        <TeamCard
                            key={i}
                            member={member}
                            spanClass={spanFor(i)}
                            cardRef={(el) => (cardRefs.current[i] = el)}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
}
import { useRef, useLayoutEffect, useState, useCallback } from "react";
import gsap from "gsap";

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

const team = [
    {
        name: "Shravan Kadam",
        img: Shravan,
        hoverImg: ShravanKid,
        linkedin: "https://linkedin.com/in/shravankadam",
        instagram: "https://instagram.com/shravankadam",
    },
    {
        name: "Bhavesh Rajdev",
        img: Bhavesh,
        hoverImg: Bhaveshkid,
        linkedin: "https://linkedin.com/in/bhaveshrajdev",
        instagram: "https://instagram.com/bhaveshrajdev",
    },
    {
        name: "Rugved Dalvi",
        img: Rugved,
        hoverImg: Rugvedkid,
        linkedin: "https://linkedin.com/in/rugveddalvi",
        instagram: "https://instagram.com/rugveddalvi",
    },
    {
        name: "Rahul Patil",
        img: Rahul,
        hoverImg: Rahulkid,
        linkedin: "https://linkedin.com/in/rahulpatil",
        instagram: "https://instagram.com/rahulpatil",
    },
    {
        name: "Meloni Shah",
        img: Meloni,
        hoverImg: Melonikid,
        linkedin: "https://linkedin.com/in/melonishah",
        instagram: "https://instagram.com/melonishah",
    },
];

const words = ["Builders.", "Designers.", "Developers.", "Dreamers."];

function initials(name) {
    return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}



function LinkedInIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-black">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
    );
}

function InstagramIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-black">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
        </svg>
    );
}

function SocialButton({ href, children }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-white/90 hover:bg-white hover:scale-110 transition-all duration-150 shadow-lg"
        >
            {children}
        </a>
    );
}

function TeamCard({ member }) {
    const [imgSrc, setImgSrc] = useState(member.img);
    const [hovered, setHovered] = useState(false);

    return (
        <div className="flex flex-col items-center text-center flex-shrink-0 w-[240px] sm:w-[280px] lg:w-[340px]">
            <div className="w-full">
                {member.img ? (
                    <div
                        className="relative cursor-pointer aspect-[4/5] overflow-hidden bg-black/5 rounded-2xl"
                        onMouseEnter={() => {
                            member.hoverImg && setImgSrc(member.hoverImg);
                            setHovered(true);
                        }}
                        onMouseLeave={() => {
                            setImgSrc(member.img);
                            setHovered(false);
                        }}
                    >
                        <img
                            src={imgSrc}
                            alt={member.name}
                            className="w-full h-full object-cover transition-all duration-300 pointer-events-none select-none"
                            draggable={false}
                        />

                        {/* Orange overlay */}
                        <div
                            className="absolute inset-0 flex items-center justify-center gap-3 transition-opacity duration-300"
                            style={{
                                backgroundColor: "rgba(255, 140, 0, 0.55)",
                                opacity: hovered ? 1 : 0,
                                pointerEvents: hovered ? "auto" : "none",
                            }}
                        >
                            {member.linkedin && (
                                <SocialButton href={member.linkedin}>
                                    <LinkedInIcon />
                                </SocialButton>
                            )}
                            {member.instagram && (
                                <SocialButton href={member.instagram}>
                                    <InstagramIcon />
                                </SocialButton>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="aspect-[4/5] bg-black/5 flex items-center justify-center rounded-2xl">
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
                className="mt-5 text-black text-2xl lg:text-3xl"
                style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}
            >
                {member.name}
            </h3>

            {member.role && (
                <p className="mt-1 text-black/60" style={{ fontFamily: "Montserrat, sans-serif" }}>
                    {member.role}
                </p>
            )}
        </div>
    );
}

export default function TeamSection() {
    const sectionRef = useRef(null);
    const viewportRef = useRef(null);
    const trackRef = useRef(null);
    const wordsRef = useRef([]);
    const headingRef = useRef([]);
    const scrollTween = useRef(null);

    // Create a duplicated array to allow seamless scrolling layout (Double the array)
    const doubleTeam = [...team, ...team];

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // ---- Continuous Infinite Marquee Scroll Setup ----
            const track = trackRef.current;
            if (track) {
                // Determine width of half the track (single iteration of team cards)
                const totalWidth = track.scrollWidth;
                const singleLoopWidth = totalWidth / 2;

                // Animate track translation smoothly over x-axis
                scrollTween.current = gsap.to(track, {
                    x: -singleLoopWidth,
                    duration: 22, // Customize speed here (higher is slower)
                    ease: "none",
                    repeat: -1,
                });
            }

            // Heading entrance animations
            gsap.set(headingRef.current, { opacity: 0, y: 50 });
            gsap.to(headingRef.current, {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power4.out",
                stagger: 0.12,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 90%",
                    once: true,
                }
            });

            // Hero words entrance animations
            gsap.set(wordsRef.current, { opacity: 0, y: 45 });
            gsap.to(wordsRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.9,
                ease: "power4.out",
                stagger: 0.12,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 90%",
                    once: true,
                }
            });
        });

        return () => ctx.revert();
    }, []);

    // Handlers to pause and resume the marquee on hover
    const handleMouseEnter = () => {
        if (scrollTween.current) {
            scrollTween.current.pause();
        }
    };

    const handleMouseLeave = () => {
        if (scrollTween.current) {
            scrollTween.current.play();
        }
    };

    return (
        <section ref={sectionRef} className="bg-[#FFFFFF] py-28 overflow-hidden">

            {/* HERO */}
            <div className="mx-auto max-w-[1700px] px-6 lg:px-16">
                <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-16 lg:gap-24">

                    {/* LEFT */}
                    <div className="max-w-4xl">
                        <span className="uppercase tracking-[0.28em] text-xs text-black/40">
                            The people behind it
                        </span>
                        <div
                            className="mt-5 pb-4 font-['SansPlomb',sans-serif] font-black uppercase leading-[0.88]"
                            style={{ fontSize: "clamp(4rem,8vw,8rem)" }}
                        >
                            <div className="overflow-hidden pb-3">
                                <div
                                    ref={(el) => (headingRef.current[0] = el)}
                                    className="text-black"
                                >
                                    Meet the{" "}
                                    <span className="text-[#FEA400]">Team</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="hidden lg:flex flex-col items-end text-right">
                        <div
                            className="font-['Geist_Variable'] font-medium uppercase tracking-[-0.05em] leading-[0.88]"
                            style={{ fontSize: "clamp(2.5rem,3vw,4rem)" }}
                        >
                            {words.map((word, index) => (
                                <div key={word} className="overflow-hidden">
                                    <div
                                        ref={(el) => (wordsRef.current[index] = el)}
                                        className={word === "Dreamers." ? "text-[#FEA400]" : "text-black/85"}
                                    >
                                        {word}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* CAROUSEL — Seamless, Auto-scrolling, Infinite */}
            <div
                className="mt-28 relative overflow-hidden"
                ref={viewportRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div
                    ref={trackRef}
                    className="flex gap-8 select-none w-max"
                    style={{ willChange: "transform" }}
                >
                    {doubleTeam.map((member, i) => (
                        <div
                            key={i}
                            className="flex-shrink-0"
                        >
                            <TeamCard member={member} />
                        </div>
                    ))}
                </div>
            </div>

        </section>
    );
}
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PastGlimpseScrollSection from "@/components/PastGlimpseScrollSection";
import AboutIntro from "@/components/AboutIntro";
import ScrollReveal from "@/components/ScrollReveal";
import CoreValuesList from "../components/Corevalueslist";
import hackUpLogo from "@/assets/HackUp.PNG";
import TeamSection from "@/components/TeamSection";
const ease = [0.22, 1, 0.36, 1];



function ArrowPill({ label, href }) {
    return (
        <a
            href={href}
            className="group inline-flex items-center gap-4 sm:gap-6 rounded-full bg-[#EDEDE6] border border-[#0C0C0D]/80 pl-5 sm:pl-7 pr-1.5 sm:pr-2 py-1.5 sm:py-2 transition-colors duration-300 hover:bg-white"
        >
            <span className="text-[0.85rem] sm:text-[0.95rem] font-bold text-[#0C0C0D] whitespace-nowrap">
                {label}
            </span>

            <span className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#0C0C0D] text-white shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                ...
            </span>
        </a >
    );
}
function MissionMeta() {
    const [time, setTime] = useState("");

    useEffect(() => {
        const update = () => {
            const formatted = new Intl.DateTimeFormat("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
                timeZone: "Asia/Kolkata",
            }).format(new Date());
            setTime(formatted);
        };
        update();
        const id = setInterval(update, 30000);
        return () => clearInterval(id);
    }, []);

    return (
        <span className="text-[0.78rem] sm:text-[0.85rem] font-semibold text-[#5A5A58]">
            / Mumbai, IN — {time}
        </span>
    );
}

export default function AboutHero() {
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, []);
    return (
        <>
            <AboutIntro />
            {/* HERO */}


            {/* MISSION */}
            <section
                id="about-scroll"
                className="relative overflow-hidden bg-[#FAFAF8] text-[#0C0C0D] py-12 sm:py-16 md:py-20 lg:py-24 px-5 md:px-12 lg:px-20"
            >
                <div className="relative z-[1] max-w-[1400px] mx-auto w-full">

                    {/* top bar */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.6, ease }}
                        className="flex items-center justify-between border-b border-[#0C0C0D]/15 pb-4 sm:pb-5"
                    >
                        <p className="flex items-center gap-2.5 text-[0.78rem] sm:text-[0.85rem] font-bold uppercase tracking-[0.12em]">
                            <span className="w-2.5 h-2.5 bg-[#F4DD0E]" />
                            Our Mission
                        </p>
                        <MissionMeta />
                    </motion.div>

                    {/* headline */}
                    <motion.div
                        className="pt-10 sm:pt-14 md:pt-20"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.15 }}
                        transition={{ duration: 0.8, ease }}
                    >
                        <h2 className="font-['SansPlomb',sans-serif] font-black uppercase leading-[0.88] tracking-[-0.01em]
                            text-[clamp(2.6rem,11vw,4.5rem)]
                            sm:text-[clamp(3.4rem,9vw,6rem)]
                            md:text-[clamp(4.2rem,8vw,8rem)]
                            lg:text-[clamp(4.8rem,7.5vw,9rem)]">
                            Building What's Next <span className="text-[#F4DD0E]">Together</span>
                        </h2>

                        <ScrollReveal
                            className="max-w-full lg:max-w-[22rem] text-center mb-1 sm:mb-2 lg:mb-3"
                            textClassName="text-[#3A3A38] font-bold leading-[1.65] text-[1.2rem] sm:text-[1.5rem]"
                            enableBlur={false}
                            baseOpacity={0}
                            baseRotation={0}
                            blurStrength={0}
                            highlightWords={["thriving ecosystem", "hackathons", "learn, innovate, and grow"]}
                        >
                            Building a thriving ecosystem where student talent meets opportunity. Through communities, hackathons, and industry collaborations, we empower aspiring developers to learn, innovate, and grow beyond traditional events.
                        </ScrollReveal>
                    </motion.div>

                    {/* CTA pills */}
                    <motion.div
                        className="flex flex-wrap gap-3 sm:gap-4 mt-12 sm:mt-16 md:mt-20"
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.75, ease, delay: 0.1 }}
                    >

                    </motion.div>

                    {/* closing strip */}
                    <motion.div
                        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 sm:gap-4 mt-16 sm:mt-20 md:mt-24 pt-6 sm:pt-8 border-t border-[#0C0C0D]/15"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.7, ease, delay: 0.15 }}
                    >
                        <div>
                            <p className="font-['SansPlomb',sans-serif] font-black uppercase tracking-[-0.01em] text-[1.05rem] sm:text-[1.2rem]">
                                Hack The Core
                            </p>

                        </div>


                        <a
                            href="mailto:hello@hackthecore.com"
                            className="text-[1rem] sm:text-[1.1rem] font-bold underline underline-offset-4 decoration-[#0C0C0D]/40 hover:decoration-[#F4DD0E] transition-colors"
                        >
                            hello@hackthecore.com
                        </a>
                    </motion.div>

                </div>
            </section >

            {/* CORE VALUES */}
            < section className="relative overflow-hidden bg-white text-[#0C0C0D] py-20 sm:py-28 md:py-32 lg:py-40 px-5 md:px-12 lg:px-20" >
                <div className="relative z-[1] max-w-[1320px] mx-auto">

                    {/* header — split layout, left-weighted */}
                    <motion.div
                        className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 lg:gap-12 mb-14 sm:mb-16 md:mb-20 pb-10 sm:pb-12 border-b border-[#0C0C0D]/15"
                        initial={{ opacity: 0, y: 28 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.22 }}
                        transition={{ duration: 0.75, ease }}
                    >
                        <div className="max-w-[44rem]">
                            <h2 className="mt-4 sm:mt-6 font-['SansPlomb',sans-serif] font-black uppercase leading-[0.84] tracking-[-0.01em] text-[#0C0C0D]
            text-[clamp(2.8rem,11vw,4.2rem)]
            sm:text-[clamp(3.6rem,8vw,5.6rem)]
            lg:text-[clamp(4.4rem,6.5vw,6.8rem)]">
                                The <span className="text-[#F4DD0E]">Code</span><br />
                                We Build By
                            </h2>
                        </div>

                        <p className="max-w-[20rem] text-[#3A3A38] font-semibold leading-[1.65] text-[1rem] sm:text-[1.1rem] lg:text-right lg:pb-2">
                            These principles guide how HackTheCore designs events, evaluates effort, supports builders, and creates long-term community momentum.
                        </p>
                    </motion.div>

                    {/* interactive value list — GSAP driven */}
                    <CoreValuesList />
                </div>
            </section >

            {/* PAST GLIMPSE */}
            <PastGlimpseScrollSection />
            <TeamSection />

        </>
    );
}
import { useEffect } from "react";
import { motion } from "framer-motion";
import PastGlimpseScrollSection from "@/components/PastGlimpseScrollSection";
import AboutIntro from "@/components/AboutIntro";
import CoreValuesList from "../components/Corevalueslist";
import hackUpLogo from "@/assets/HackUp.PNG";
import TeamSection from "@/components/TeamSection";
import BookACall from "@/components/BookACall";
import Footer from "@/components/Footer";
import MarqueeSection from "@/components/MarqueeSection";
import MissionSection from "@/components/MissionSection";
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

export default function AboutHero() {
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, []);
    return (
        <>
            <AboutIntro />
            {/* HERO */}


            {/* MISSION */}
            <MissionSection />

            {/* CORE VALUES */}
            <CoreValuesList />

            {/* PAST GLIMPSE */}
            <PastGlimpseScrollSection />
            <TeamSection />
            <BookACall />
            <Footer />

        </>
    );
}
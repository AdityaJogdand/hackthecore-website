import { motion } from "framer-motion";
import aboutImage1 from "../assets/aboutus.jpeg";
import aboutImage2 from "../assets/SFM_5081.JPG";
import aboutImage3 from "../assets/SFM_5083.JPG";

const ease = [0.22, 1, 0.36, 1];

const photos = [
    { src: aboutImage2, alt: "Hack The Core community" },
    { src: aboutImage1, alt: "Hack The Core community" },
    { src: aboutImage3, alt: "Hack The Core community" },
];

// Script accent font — make sure Caveat is linked in index.html:
// <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap" rel="stylesheet">
const scriptFont = { fontFamily: "'Caveat', cursive" };

export default function AboutIntro() {
    return (
        <section
            id="about-scroll"
            className="relative overflow-hidden bg-[#FAFAF8] py-24 lg:py-32 px-6 md:px-12 lg:px-20"
        >
            {/* --- Background texture layer (no gradients, no glows) --- */}
            <div className="pointer-events-none absolute inset-0 z-0">

                {/* fine dot grid */}
                <svg className="absolute inset-0 w-full h-full opacity-[0.5]" xmlns="http://www.w3.org/2000/svg">
                    <pattern id="aboutDotGrid" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
                        <circle cx="1.4" cy="1.4" r="1.4" fill="#0a0a0a" fillOpacity="0.07" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#aboutDotGrid)" />
                </svg>

                {/* large oversized outline wordmark, sits behind content */}
                <span
                    aria-hidden="true"
                    className="absolute -bottom-6 left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-sans font-black uppercase text-[clamp(6rem,16vw,13rem)] leading-none tracking-tight text-transparent"
                    style={{ WebkitTextStroke: "1.5px rgba(10,10,10,0.06)" }}
                >
                    HACK THE CORE
                </span>

                {/* thin frame lines for structure */}
                <div className="absolute inset-x-6 md:inset-x-12 lg:inset-x-20 top-10 bottom-10 border border-neutral-900/[0.06]" />
                <div className="absolute left-1/2 top-10 bottom-10 w-px bg-neutral-900/[0.05] hidden lg:block" />

                {/* corner brackets */}
                <div className="absolute left-6 md:left-12 lg:left-20 top-10 w-10 h-10 border-l-2 border-t-2 border-neutral-900/15" />
                <div className="absolute right-6 md:right-12 lg:right-20 bottom-10 w-10 h-10 border-r-2 border-b-2 border-neutral-900/15" />

                {/* subtle grain/noise texture for tactile depth */}
                <svg className="absolute inset-0 w-full h-full mix-blend-multiply opacity-[0.035]">
                    <filter id="aboutGrain">
                        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
                        <feColorMatrix type="saturate" values="0" />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#aboutGrain)" />
                </svg>
            </div>

            <div className="relative z-10 mx-auto max-w-[1400px] grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-16 items-center">

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: .8, ease }}
                >
                    <p className="flex items-center gap-4 uppercase tracking-[0.28em] text-[13px] font-semibold text-neutral-900">
                        <span className="w-10 h-[3px] bg-[#F4DD0E]" />
                        About Us
                    </p>

                    <h2 className="mt-8 font-sans font-black uppercase tracking-[-0.02em] leading-[0.95] text-[clamp(3.2rem,7vw,6rem)] text-neutral-950">
                        Beyond the
                        <br />
                        <span style={scriptFont} className="capitalize text-[1.3em] text-[#F4DD0E]">
                            Hack
                        </span>
                    </h2>

                    <p className="mt-10 max-w-[640px] text-[1.08rem] leading-[1.9] text-neutral-600 font-medium">
                        Hack The Core is a community-driven technology platform focused on
                        empowering student developers through hackathons, meetups, and
                        industry collaborations. We aim to build a strong ecosystem where
                        ambitious builders can learn, innovate, and connect with
                        opportunities that extend beyond a single event.
                    </p>

                    <motion.a
                        href="#"
                        whileHover={{ y: -4, scale: 1.03 }}
                        whileTap={{ scale: .98 }}
                        className="inline-flex mt-12 rounded-full bg-neutral-950 px-10 py-4 text-white font-semibold shadow-2xl transition hover:bg-[#F4DD0E] hover:text-black"
                    >
                        Explore Us
                    </motion.a>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: .9, ease }}
                    className="relative h-[380px] sm:h-[480px] lg:h-[620px]"
                >
                    <motion.div animate={{ y: [0, -18, 0] }} transition={{ repeat: Infinity, duration: 8 }} className="absolute left-[5%] top-[12%] w-20 h-20 sm:w-28 sm:h-28 lg:w-36 lg:h-36 rounded-full bg-[#F4DD0E]" />
                    <motion.div animate={{ y: [0, 14, 0] }} transition={{ repeat: Infinity, duration: 6 }} className="absolute right-[8%] top-6 w-14 h-14 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-black" />
                    <motion.div animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 7 }} className="absolute right-0 bottom-10 w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full bg-[#F4DD0E]" />
                    <motion.div animate={{ y: [0, -16, 0] }} transition={{ repeat: Infinity, duration: 5.5 }} className="absolute right-[28%] top-[2%] w-8 h-8 sm:w-10 sm:h-10 lg:w-14 lg:h-14 rounded-full bg-[#F4DD0E]" />

                    {/* bottom-left corner circles */}
                    <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 6.5 }} className="absolute left-[-2%] bottom-[-2%] w-16 h-16 sm:w-20 sm:h-20 lg:w-28 lg:h-28 rounded-full bg-[#F4DD0E]" />
                    <motion.div animate={{ y: [0, 12, 0] }} transition={{ repeat: Infinity, duration: 7.5 }} className="absolute left-[10%] bottom-[-4%] w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-black" />
                    <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 5 }} className="absolute left-[-4%] bottom-[18%] w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-full bg-[#F4DD0E]" />

                    <div className="absolute inset-0">

                        <motion.figure
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 5 }}
                            className="absolute left-0 top-6 w-[26%] h-[82%] overflow-hidden rounded-[999px] ring-2 sm:ring-4 lg:ring-8 ring-white shadow-[0_30px_70px_rgba(0,0,0,.18)]"
                        >
                            <img src={photos[0].src} alt={photos[0].alt} className="w-full h-full object-cover" />
                        </motion.figure>

                        <motion.figure
                            animate={{ y: [0, -14, 0] }}
                            transition={{ repeat: Infinity, duration: 6 }}
                            className="absolute left-1/2 -translate-x-1/2 top-0 w-[38%] h-full overflow-hidden rounded-[999px] ring-2 sm:ring-4 lg:ring-8 ring-white shadow-[0_35px_80px_rgba(0,0,0,.22)] z-20"
                        >
                            <img src={photos[1].src} alt={photos[1].alt} className="w-full h-full object-cover" />
                        </motion.figure>

                        <motion.figure
                            animate={{ y: [0, -8, 0] }}
                            transition={{ repeat: Infinity, duration: 5.5 }}
                            className="absolute right-0 bottom-6 w-[26%] h-[82%] overflow-hidden rounded-[999px] ring-2 sm:ring-4 lg:ring-8 ring-white shadow-[0_30px_70px_rgba(0,0,0,.18)]"
                        >
                            <img src={photos[2].src} alt={photos[2].alt} className="w-full h-full object-cover" />
                        </motion.figure>

                    </div>
                </motion.div>

            </div>
        </section>
    );
}
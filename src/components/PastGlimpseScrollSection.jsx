import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import hackUpLogo from "@/assets/HackUp.PNG";
import glimpseImageOne from "@/assets/SFM_5081.JPG";
import glimpseImageTwo from "@/assets/SFM_5083.JPG";
import glimpseImageThree from "@/assets/SFM_6818.JPG";
import glimpseImageFour from "@/assets/SFM_6818.JPG";

gsap.registerPlugin(ScrollTrigger);

const LOGO_MAX_WIDTH = 560; // px — must match the CSS max-width below

const carouselImages = [
    glimpseImageOne,
    glimpseImageTwo,
    glimpseImageThree,
    glimpseImageFour,
];

function PastGlimpseScrollSection() {
    const sectionRef = useRef(null);
    const logoRef = useRef(null);
    const imagesWrapRef = useRef(null); // rises up from bottom
    const trackRef = useRef(null);      // slides horizontally (the carousel)

    useLayoutEffect(() => {
        // re-measure once every carousel image has actually loaded, so the
        // track's scrollWidth (and therefore the stop distance) is accurate
        const imgs = trackRef.current
            ? Array.from(trackRef.current.querySelectorAll("img"))
            : [];
        let loadedCount = 0;
        const handleImgLoad = () => {
            loadedCount += 1;
            if (loadedCount === imgs.length) ScrollTrigger.refresh();
        };
        imgs.forEach((img) => {
            if (img.complete) {
                handleImgLoad();
            } else {
                img.addEventListener("load", handleImgLoad);
            }
        });

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                defaults: { ease: "none" },
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=300%", // longer runway since carousel needs scroll distance too
                    scrub: 0.5,
                    pin: true,
                    anticipatePin: 1,
                },
            });

            // phase 1: logo (with eyebrow) scales up (0 -> 25%)
            tl.to(logoRef.current, { scale: 2, duration: 0.25 });

            // phase 2: logo group moves upward, out of the way (25% -> 45%)
            tl.to(logoRef.current, { yPercent: -140, duration: 0.2 }, 0.25);

            // phase 3: image strip rises up from the bottom (30% -> 50%, overlaps logo exit)
            tl.fromTo(
                imagesWrapRef.current,
                { autoAlpha: 0, y: 160 },
                { autoAlpha: 1, y: 0, duration: 0.2 },
                0.3
            );

            // phase 4: horizontal carousel — track slides left across remaining scroll (50% -> 100%)
            // x is computed as a function so GSAP re-measures on ScrollTrigger.refresh() (resize-safe),
            // and it's the EXACT pixel distance needed to bring the last image flush with the right
            // edge of the visible track — no overshoot, no undershoot.
            tl.to(
                trackRef.current,
                {
                    x: () => {
                        const trackWidth = trackRef.current.scrollWidth;
                        const viewportWidth = imagesWrapRef.current.offsetWidth;
                        const distance = trackWidth - viewportWidth;
                        return distance > 0 ? -distance : 0;
                    },
                    duration: 0.5,
                },
                0.5
            );
        }, sectionRef);

        return () => {
            imgs.forEach((img) => img.removeEventListener("load", handleImgLoad));
            ctx.revert();
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative bg-black text-white h-screen overflow-hidden flex flex-col justify-center px-5 md:px-12 lg:px-20"
        >
            <div className="relative flex-1 flex items-center justify-center overflow-hidden">
                {/* LOGO GROUP — eyebrow sits above the logo, both scale/move together, then rise up out of frame */}
                <div
                    ref={logoRef}
                    style={{ transformOrigin: "center center" }}
                    className="flex flex-col items-center gap-4 sm:gap-6 will-change-transform absolute"
                >

                    <img
                        src={hackUpLogo}
                        alt="HackUp"
                        style={{ maxWidth: LOGO_MAX_WIDTH }}
                        className="w-full object-contain"
                    />
                </div>

                {/* IMAGE CAROUSEL — rises from bottom, then slides horizontally */}
                <div
                    ref={imagesWrapRef}
                    className="absolute inset-0 flex items-center overflow-hidden opacity-0"
                >
                    <div
                        ref={trackRef}
                        className="flex gap-6 sm:gap-8 will-change-transform pl-[10vw]"
                    >
                        {carouselImages.map((src, i) => (
                            <div
                                key={i}
                                className="shrink-0 w-[280px] sm:w-[380px] md:w-[460px] h-[360px] sm:h-[460px] md:h-[560px] rounded-[20px] overflow-hidden shadow-2xl"
                            >
                                <img
                                    src={src}
                                    alt={`Glimpse ${i + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default PastGlimpseScrollSection;
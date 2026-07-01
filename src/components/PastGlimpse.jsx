import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1];

// 9 columns, each with 1-3 stacked photos. curveOffset controls vertical
// position to create the inward (smile-shaped) curve: edges sit high,
// center dips down toward the title above it.
const columns = [
    {
        curveOffset: 0, images: [
            "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&q=80",
            "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80",
        ]
    },
    {
        curveOffset: 34, images: [
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80",
        ]
    },
    {
        curveOffset: 64, images: [
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
            "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&q=80",
        ]
    },
    {
        curveOffset: 86, images: [
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
            "https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&q=80",
        ]
    },
    {
        curveOffset: 98, images: [
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
            "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80",
        ]
    },
    {
        curveOffset: 86, images: [
            "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&q=80",
            "https://images.unsplash.com/photo-1545167622-3a6ac756afa4?w=400&q=80",
        ]
    },
    {
        curveOffset: 64, images: [
            "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
            "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80",
        ]
    },
    {
        curveOffset: 34, images: [
            "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=400&q=80",
            "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&q=80",
        ]
    },
    {
        curveOffset: 0, images: [
            "https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&q=80",
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
        ]
    },
];

export default function PastGlimpse() {
    return (
        <section className="past-glimpse-section">
            <style>{`
                .past-glimpse-section {
                    position: relative;
                    overflow: hidden;
                    background: #0C0C0D;
                    color: #FAFAF8;
                    padding: clamp(5rem, 10vw, 7rem) clamp(1.25rem, 5vw, 5rem) 0;
                }

                .past-glimpse-shell {
                    position: relative;
                    z-index: 2;
                    max-width: 1400px;
                    margin: 0 auto;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                }

                .past-glimpse-kicker {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.75rem;
                    color: #F4DD0E;
                    font-size: 0.68rem;
                    font-weight: 900;
                    letter-spacing: 0.22em;
                    text-transform: uppercase;
                }

                .past-glimpse-kicker::before,
                .past-glimpse-kicker::after {
                    content: "";
                    width: clamp(1.6rem, 4vw, 3rem);
                    height: 1px;
                    background: rgba(250, 250, 248, 0.4);
                }

                .past-glimpse-title {
                    margin: clamp(0.6rem, 2vw, 1rem) 0 0;
                    font-family: 'SansPlomb', sans-serif;
                    font-size: clamp(4.5rem, 13vw, 11rem);
                    line-height: 0.82;
                    letter-spacing: 0;
                    text-transform: uppercase;
                    color: #F4DD0E;
                }

                .past-glimpse-copy {
                    margin: clamp(1rem, 2.5vw, 1.5rem) 0 0;
                    max-width: 36rem;
                    color: rgba(250, 250, 248, 0.62);
                    font-size: clamp(0.92rem, 1.1vw, 1.02rem);
                    font-weight: 560;
                    line-height: 1.6;
                }

                .past-glimpse-curve {
                    position: relative;
                    z-index: 1;
                    display: grid;
                    grid-template-columns: repeat(9, minmax(0, 1fr));
                    gap: clamp(0.55rem, 1.1vw, 1rem);
                    width: 100%;
                    margin-top: clamp(2.5rem, 6vw, 4rem);
                }

                .past-glimpse-col {
                    display: flex;
                    flex-direction: column;
                    gap: clamp(0.55rem, 1.1vw, 1rem);
                }

                .past-glimpse-photo {
                    position: relative;
                    overflow: hidden;
                    border-radius: 18px;
                    aspect-ratio: 3 / 4;
                    background: #1A1A1B;
                    border: 1px solid rgba(250, 250, 248, 0.08);
                }

                .past-glimpse-photo img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                    filter: saturate(1.05) contrast(1.02);
                }

                .past-glimpse-fade {
                    position: absolute;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    height: 40%;
                    background: linear-gradient(180deg, transparent, #0C0C0D 92%);
                    z-index: 1;
                    pointer-events: none;
                }

                @media (max-width: 980px) {
                    .past-glimpse-curve {
                        grid-template-columns: repeat(5, minmax(0, 1fr));
                    }
                    .past-glimpse-col:nth-child(6),
                    .past-glimpse-col:nth-child(7),
                    .past-glimpse-col:nth-child(8),
                    .past-glimpse-col:nth-child(9) {
                        display: none;
                    }
                }

                @media (max-width: 620px) {
                    .past-glimpse-curve {
                        grid-template-columns: repeat(3, minmax(0, 1fr));
                    }
                    .past-glimpse-col:nth-child(4),
                    .past-glimpse-col:nth-child(5) {
                        display: none;
                    }
                    .past-glimpse-col {
                        transform: none !important;
                    }
                }
            `}</style>

            <div className="past-glimpse-shell">
                <motion.p
                    className="past-glimpse-kicker"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.6, ease }}
                >
                    Past Glimpse
                </motion.p>

                <motion.h2
                    className="past-glimpse-title"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, delay: 0.08, ease }}
                >
                    HackUp
                </motion.h2>

                <motion.p
                    className="past-glimpse-copy"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.6, delay: 0.16, ease }}
                >
                    Faces from the floor, the mentors, the builders, and the
                    community that showed up and made HackUp unforgettable.
                </motion.p>
            </div>

            <motion.div
                className="past-glimpse-curve"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.9, delay: 0.1, ease }}
            >
                {columns.map((col, i) => (
                    <div
                        className="past-glimpse-col"
                        key={i}
                        style={{ transform: `translateY(${col.curveOffset}px)` }}
                    >
                        {col.images.map((src, j) => (
                            <div className="past-glimpse-photo" key={j}>
                                <img src={src} alt="HackUp community member" loading="lazy" />
                            </div>
                        ))}
                    </div>
                ))}
                <div className="past-glimpse-fade" />
            </motion.div>
        </section>
    );
}
import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);
import footerbg from "../assets/1.png";
import wordmark from "../assets/hackthecore_Neonlogowhitetext.png";
import appleLogo from "../assets/apple.png";
import playLogo from "../assets/play.png";
import { Link } from "react-router-dom";

/* ─── tokens ──────────────────────────────────────────────────────────── */
const C = {
    bg: "#0C0C0D",
    ink: "#fef636",
    inkMid: "#DDDDDD",
    inkFaint: "#2A2A28",
    yellow: "#FEF636",
    rule: "#1E1E1C",
    white: "#FFFFFF"
};

const IconMail = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        style={{ color: C.yellow, flexShrink: 0 }}
    >
        <path
            d="M4 6h16v12H4V6zm0 0 8 6 8-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);
const IconPhone = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        style={{ color: C.yellow, flexShrink: 0 }}
    >
        <path
            d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 3.09 5.18 2 2 0 0 1 5.08 3h3a2 2 0 0 1 2 1.72l.38 2.66a2 2 0 0 1-.57 1.73l-1.27 1.27a16 16 0 0 0 6.26 6.26l1.27-1.27a2 2 0 0 1 1.73-.57l2.66.38A2 2 0 0 1 22 16.92z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);
const IconLocation = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        style={{ color: C.yellow, flexShrink: 0 }}
    >
        <path
            d="M12 21s7-5.33 7-11a7 7 0 1 0-14 0c0 5.67 7 11 7 11Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <circle
            cx="12"
            cy="10"
            r="2.5"
            stroke="currentColor"
            strokeWidth="2"
        />
    </svg>
);

/* ─── nav columns ─────────────────────────────────────────────────────── */
const NAV_COLS = [
    {
        heading: "Get Involved",
        buttons: [
            { label: "Join Community", href: "/community" },
            { label: "Be a Partner", href: "/partner" },
        ],
    },
    {
        heading: "Pages",
        links: [
            { label: "Home", href: "/" },
            { label: "About", href: "/aboutpage" },
            { label: "Event", href: "/events" },
            { label: "Showcase", href: "/showcase" },
        ],
    },
    {
        contact: {
            heading: "Get in touch",
            name: "connect@hackthecore.in",
            phone: "+91 83080 78534",
            location: "Navi Mumbai, Maharashtra",

        },
    },
];

const LEGAL = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Settings", href: "/cookies" },
];

/* ─── social icons ────────────────────────────────────────────────────── */
const IconX = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.722-8.844L1.999 2.25H8.08l4.267 5.643 5.897-5.643zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);
const IconInstagram = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
);
const IconLinkedIn = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
);
const IconWhatsApp = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);

const SOCIALS = [
    { label: "X", Icon: IconX, href: "https://x.com/hackthecore" },
    { label: "Instagram", Icon: IconInstagram, href: "https://instagram.com/hackthecore" },
    { label: "LinkedIn", Icon: IconLinkedIn, href: "https://linkedin.com/company/hackthecore" },
    { label: "WhatsApp", Icon: IconWhatsApp, href: "https://wa.me/hackthecore" },
];

/* ─── hover link ──────────────────────────────────────────────────────── */
function FootLink({ href, children, size = "0.88rem", color = C.inkMid, hoverColor = C.ink, underline = false }) {
    const [hov, setHov] = useState(false);
    return (
        <a
            href={href}
            style={{
                fontSize: size,
                color: hov ? hoverColor : color,
                textDecoration: underline ? "underline" : "none",
                textUnderlineOffset: "3px",
                transition: "color 0.16s",
                letterSpacing: "0.01em",
                cursor: "pointer",
            }}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
        >
            {children}
        </a>
    );
}

/* ─── social button ───────────────────────────────────────────────────── */
function SocialBtn({ label, Icon, href }) {
    const [hov, setHov] = useState(false);
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 34,
                height: 34,
                borderRadius: 10,
                border: `1px solid ${hov ? C.yellow + "55" : C.rule}`,
                color: hov ? C.yellow : C.inkMid,
                background: hov ? C.yellow + "0D" : "transparent",
                transition: "all 0.18s",
                cursor: "pointer",
                textDecoration: "none",
                flexShrink: 0,
            }}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
        >
            <Icon />
        </a>
    );
}

/* ─── nav CTA button ──────────────────────────────────────────────────── */
function NavButton({ label, href }) {
    const [hov, setHov] = useState(false);
    return (
        <a
            href={href}
            style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0.5rem 0.9rem",
                borderRadius: 8,
                border: `1px solid ${hov ? C.yellow : "#444442"}`,
                background: hov ? C.yellow + "12" : "transparent",
                color: hov ? C.yellow : C.inkMid,
                fontSize: "0.8rem",
                fontWeight: 500,
                letterSpacing: "0.01em",
                textDecoration: "none",
                whiteSpace: "nowrap",
                transition: "all 0.16s",
                cursor: "pointer",
            }}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
        >
            {label}
        </a>
    );
}

/* ─── footer ──────────────────────────────────────────────────────────── */
export default function Footer() {
    const year = new Date().getFullYear();
    const [isVisible, setIsVisible] = useState(false);
    const footerRef = useRef(null);

useEffect(() => {
    const ctx = gsap.context(() => {
        gsap.fromTo(
            footerRef.current,
            { y: 40 },
            {
                y: 0,
                ease: "none",
                scrollTrigger: {
                    trigger: footerRef.current,
                    start: "top bottom",
                    end: "bottom bottom",
                    scrub: true,
                },
            }
        );
    });

    return () => ctx.revert();
}, []);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const entry = entries[0];
            if (entry.isIntersecting) {
                setIsVisible(true);
                if (footerRef.current) observer.unobserve(footerRef.current);
            }
        }, { threshold: 0.1 });

        const currentRef = footerRef.current;
        if (currentRef) observer.observe(currentRef);

        return () => {
            if (footerRef.current) observer.unobserve(footerRef.current);
        };
    }, []);

    return (
        <footer
            ref={footerRef}
            style={{
                backgroundImage: `url(${footerbg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                borderTop: `1px solid ${C.rule}`,
                fontFamily: "'Inter', sans-serif",
                overflow: "hidden",
                borderRadius: "68px 68px 0 0",
                position: "relative",
            }}
        >

            <style>{`
                .htc-footer-main {
                    display: grid;
                    grid-template-columns: 1fr auto;
                    gap: clamp(3rem, 6vw, 8rem);
                    align-items: start;
                }
                .htc-footer-nav {
    display: grid;
    grid-template-columns: max-content max-content max-content;
    column-gap: clamp(4rem, 8vw, 8rem);
    justify-content: space-between;
    align-items: start;
}
                .htc-footer-bottom {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    gap: 1rem;
                }
                .htc-footer-legal {
                    display: flex;
                    gap: 1.75rem;
                    align-items: center;
                    flex-wrap: wrap;
                }

                @media (max-width: 860px) {
                    .htc-footer-main {
                        grid-template-columns: 1fr;
                        gap: 2.5rem;
                    }
                    .htc-footer-left {
                        max-width: none !important;
                    }
                    .htc-footer-nav {
                        grid-template-columns: repeat(3, minmax(0, 1fr));
                    }
                }

                @media (max-width: 520px) {
                    .htc-footer-nav {
                        grid-template-columns: repeat(2, 1fr);
                        row-gap: 2rem;
                    }
                    .htc-footer-bottom {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    .htc-footer-legal {
                        gap: 1.1rem;
                    }
                }

                @media (max-width: 360px) {
                    .htc-footer-nav {
                        grid-template-columns: 1fr;
                        row-gap: 1.5rem;
                    }
                }
            `}</style>

            <div style={{ maxWidth: 1280, margin: "0 auto", padding: "clamp(2.5rem, 5vw, 5rem) clamp(1.25rem, 5vw, 5rem) 0", position: "relative", zIndex: 1 }}>

                {/* ── main grid ── */}
                <div
                    className="htc-footer-main"
                    style={{
                        paddingBottom: "clamp(2rem, 4vw, 3.5rem)",
                        borderBottom: `1px solid ${C.rule}`,
                    }}
                >
                    {/* left: wordmark + tagline + socials */}
                    <div className="htc-footer-left" style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: 320 }}>

                        {/* wordmark */}
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <img
                                src={wordmark}
                                alt="HackTheCore"
                                style={{ height: 48, width: "auto", objectFit: "contain" }}
                            />
                        </div>

                        {/* tagline */}
                        <p style={{ fontSize: "0.93rem", color: C.inkMid, lineHeight: 1.65, margin: 0, letterSpacing: "0.01em" }}>
                            India's builder community — where hackers, creators, and founders come to ship.
                        </p>

                        {/* social icons */}
                        <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", flexWrap: "wrap" }}>
                            {SOCIALS.map(s => <SocialBtn key={s.label} {...s} />)}
                        </div>

                        {/* app store buttons */}
                        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "nowrap" }}>
                            {/* App Store */}
                            <a
                                href="https://apps.apple.com/in/app/hack-the-core/id6758599070"
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                    padding: "0.5rem 1rem 0.5rem 0.8rem",
                                    borderRadius: 8,
                                    border: `1px solid rgba(255,255,255,0.18)`,
                                    background: "#111",
                                    textDecoration: "none",
                                    color: "#fff",
                                    transition: "border-color 0.18s",
                                    overflow: "hidden",
                                }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = C.yellow}
                                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"}
                            >
                                <img src={appleLogo} alt="Apple" style={{ width: 18, height: 22, objectFit: "contain", flexShrink: 0 }} />
                                <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
                                    <span style={{ fontSize: "0.6rem", letterSpacing: "0.04em", color: "rgba(255,255,255,0.6)" }}>Download on the</span>
                                    <span style={{ fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.01em" }}>App Store</span>
                                </div>
                            </a>

                            {/* Google Play */}
                            <a
                                href="https://play.google.com/store/apps/details?id=com.unitecloud.hackthecore.app&hl=en_IN"
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                    padding: "0.5rem 1rem 0.5rem 0.8rem",
                                    borderRadius: 8,
                                    border: `1px solid rgba(255,255,255,0.18)`,
                                    background: "#111",
                                    textDecoration: "none",
                                    color: "#fff",
                                    transition: "border-color 0.18s",
                                }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = C.yellow}
                                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"}
                            >
                                <img src={playLogo} alt="Google Play" style={{ width: 22, height: 24, objectFit: "contain", flexShrink: 0 }} />
                                <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
                                    <span style={{ fontSize: "0.6rem", letterSpacing: "0.04em", color: "rgba(255,255,255,0.6)" }}>GET IT ON</span>
                                    <span style={{ fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.01em" }}>Google Play</span>
                                </div>
                            </a>
                        </div>
                    </div>

                   {/* right: nav columns */}
<div className="htc-footer-nav">
    {NAV_COLS.map((col, i) => (
        <div
            key={col.heading || i}
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                minWidth: 0,
            }}
        >
            {col.heading && (
                <span
                    style={{
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: C.ink,
                        marginBottom: "0.25rem",
                    }}
                >
                    {col.heading}
                </span>
            )}

            {col.links &&
                col.links.map((link) => (
                    <FootLink key={link.label} href={link.href}>
                        {link.label}
                    </FootLink>
                ))}

            {col.buttons && (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.6rem",
                    }}
                >
                    {col.buttons.map((btn) => (
                        <NavButton key={btn.label} {...btn} />
                    ))}
                </div>
            )}

            {col.contact && (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.9rem",
                    }}
                >
                    <span
                        style={{
                            fontSize: "0.72rem",
                            fontWeight: 600,
                            letterSpacing: "0.14em",
                            textTransform: "uppercase",
                            color: C.ink,
                        }}
                    >
                        {col.contact.heading}
                    </span>

                    <a
                        href={`mailto:${col.contact.name}`}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.65rem",
                            color: C.inkMid,
                            textDecoration: "none",
                            fontSize: "0.88rem",
                            fontWeight: 500,
                        }}
                    >
                        <IconMail />
                        {col.contact.name}
                    </a>

                    <a
                        href={`tel:${col.contact.phone.replace(/\s/g, "")}`}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.65rem",
                            color: C.inkMid,
                            textDecoration: "none",
                            fontSize: "0.88rem",
                        }}
                    >
                        <IconPhone />
                        {col.contact.phone}
                    </a>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.65rem",
                            color: C.inkMid,
                            fontSize: "0.88rem",
                        }}
                    >
                        <IconLocation />
                        {col.contact.location}
                    </div>
                </div>
            )}
        </div>
    ))}
</div>
</div>

                {/* ── bottom bar ── */}
                <div
                    className="htc-footer-bottom"
                    style={{
                        padding: "clamp(1.25rem, 2vw, 1.75rem) 0 clamp(1rem, 2vw, 1.5rem)",
                    }}
                >
                    <span style={{ fontSize: "0.78rem", color: C.inkMid, letterSpacing: "0.01em" }}>
                        © {year} Hackthecore — All rights reserved.
                    </span>
                    <div className="htc-footer-legal">
                        {LEGAL.map(l => (
                            <Link
                                key={l.label}
                                to={l.href}
                                style={{
                                    fontSize: "0.78rem",
                                    color: C.inkMid,
                                    textDecoration: "underline",
                                    textUnderlineOffset: "3px",
                                    transition: "color 0.16s",
                                    letterSpacing: "0.01em",
                                }}
                                onMouseEnter={e => e.currentTarget.style.color = C.ink}
                                onMouseLeave={e => e.currentTarget.style.color = C.inkMid}
                            >
                                {l.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── big fading wordmark ── */}
            <div
                style={{
                    position: "relative",
                    overflow: "hidden",
                    lineHeight: 0.85,
                    pointerEvents: "none",
                    userSelect: "none",
                    zIndex: 1,
                }}
            >
            </div>
        </footer>
    );
}
import { useState } from "react";

/* ─── tokens ──────────────────────────────────────────────────────────── */
const C = {
    bg: "#0C0C0D",
    ink: "#FAFAF8",
    inkMid: "#5A5A58",
    inkFaint: "#2A2A28",
    yellow: "#F4DD0E",
    rule: "#1E1E1C",
};

/* ─── nav columns ─────────────────────────────────────────────────────── */
const NAV_COLS = [
    {
        heading: "Platform",
        links: [
            { label: "Hackathons", href: "/hackathons" },
            { label: "Events", href: "/events" },
            { label: "Courses", href: "/courses" },
            { label: "Merch", href: "/merch" },
        ],
    },
    {
        heading: "Community",
        links: [
            { label: "Discord", href: "/discord" },
            { label: "Blog", href: "/blog" },
            { label: "Leaderboard", href: "/leaderboard" },
            { label: "Showcase", href: "/showcase" },
        ],
    },
    {
        heading: "Company",
        links: [
            { label: "About", href: "/about" },
            { label: "Partner", href: "/partner" },
            { label: "Press", href: "/press" },
            { label: "Contact", href: "/contact" },
        ],
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
const IconGitHub = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
);

const SOCIALS = [
    { label: "X", Icon: IconX, href: "https://x.com/hackthecore" },
    { label: "Instagram", Icon: IconInstagram, href: "https://instagram.com/hackthecore" },
    { label: "LinkedIn", Icon: IconLinkedIn, href: "https://linkedin.com/company/hackthecore" },
    { label: "GitHub", Icon: IconGitHub, href: "https://github.com/hackthecore" },
];

/* ─── hover link ──────────────────────────────────────────────────────── */
function FootLink({ href, children, size = "0.78rem", color = C.inkMid, hoverColor = C.ink, underline = false }) {
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
                width: 32,
                height: 32,
                borderRadius: 6,
                border: `1px solid ${hov ? C.yellow + "55" : C.rule}`,
                color: hov ? C.yellow : C.inkMid,
                background: hov ? C.yellow + "0D" : "transparent",
                transition: "all 0.18s",
                cursor: "pointer",
                textDecoration: "none",
            }}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
        >
            <Icon />
        </a>
    );
}

/* ─── footer ──────────────────────────────────────────────────────────── */
export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer
            style={{
                background: C.bg,
                borderTop: `1px solid ${C.rule}`,
                fontFamily: "'Inter', sans-serif",
                overflow: "hidden",
            }}
        >
            {/* Google Fonts — Bebas Neue for the wordmark */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600&display=swap');
            `}</style>

            <div style={{ maxWidth: 1280, margin: "0 auto", padding: "clamp(3rem, 5vw, 5rem) clamp(1.5rem, 5vw, 5rem) 0" }}>

                {/* ── main grid ── */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr auto",
                        gap: "clamp(3rem, 6vw, 8rem)",
                        paddingBottom: "clamp(2rem, 4vw, 3.5rem)",
                        borderBottom: `1px solid ${C.rule}`,
                        alignItems: "start",
                    }}
                >
                    {/* left: wordmark + tagline + socials */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: 320 }}>

                        {/* wordmark */}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                                <rect width="22" height="22" rx="4" fill={C.yellow} />
                                <path d="M7 6v10M15 6v10M7 11h8" stroke="#0C0C0D" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            <span
                                style={{
                                    fontFamily: "'Bebas Neue', sans-serif",
                                    fontWeight: 400,
                                    fontSize: "1.35rem",
                                    letterSpacing: "0.06em",
                                    color: C.ink,
                                    lineHeight: 1,
                                }}
                            >
                                HackTheCore
                            </span>
                        </div>

                        {/* tagline */}
                        <p style={{ fontSize: "0.82rem", color: C.inkMid, lineHeight: 1.65, margin: 0, letterSpacing: "0.01em" }}>
                            India's builder community — where hackers, creators, and founders come to ship.
                        </p>

                        {/* social icons */}
                        <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
                            {SOCIALS.map(s => <SocialBtn key={s.label} {...s} />)}
                        </div>
                    </div>

                    {/* right: nav columns */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, minmax(110px, 1fr))",
                            gap: "clamp(2rem, 4vw, 4rem)",
                        }}
                    >
                        {NAV_COLS.map(col => (
                            <div key={col.heading} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                <span
                                    style={{
                                        fontSize: "0.63rem",
                                        fontWeight: 600,
                                        letterSpacing: "0.14em",
                                        textTransform: "uppercase",
                                        color: C.ink,
                                        marginBottom: "0.25rem",
                                    }}
                                >
                                    {col.heading}
                                </span>
                                {col.links.map(link => (
                                    <FootLink key={link.label} href={link.href}>{link.label}</FootLink>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── bottom bar ── */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "1rem",
                        padding: "clamp(1.25rem, 2vw, 1.75rem) 0 clamp(1rem, 2vw, 1.5rem)",
                    }}
                >
                    <span style={{ fontSize: "0.68rem", color: C.inkMid, letterSpacing: "0.01em" }}>
                        © {year} HackTheCore — All rights reserved.
                    </span>
                    <div style={{ display: "flex", gap: "1.75rem", alignItems: "center" }}>
                        {LEGAL.map(l => (
                            <FootLink key={l.label} href={l.href} size="0.68rem" underline>{l.label}</FootLink>
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
                }}
            >
                <span
                    style={{
                        display: "block",
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: "clamp(5rem, 16vw, 14rem)",
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                        color: C.ink,
                        WebkitMaskImage: "linear-gradient(to bottom, rgba(250,250,248,0.08) 0%, rgba(250,250,248,0) 100%)",
                        maskImage: "linear-gradient(to bottom, rgba(250,250,248,0.08) 0%, rgba(250,250,248,0) 100%)",
                        textAlign: "center",
                        whiteSpace: "nowrap",
                    }}
                >
                    HACKTHECORE
                </span>
            </div>
        </footer>
    );
}
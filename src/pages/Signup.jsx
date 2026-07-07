import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_URL;

const C = {
    bg: "#FAFAF8",
    leftBg: "#F0F0ED",
    surface: "#ffffff",
    border: "#E4E4E0",
    borderFocus: "#0C0C0D",
    ink: "#0C0C0D",
    inkMid: "#888886",
    inkFaint: "#C4C4C0",
    yellow: "#F4DD0E",
    error: "#E5484D",
};

const IconGoogle = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

const IconGitHub = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
);

const IconEye = ({ open }) => open ? (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
) : (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
);

/* ─── DESKTOP: 5 separate scattered cards ─── */
function ScatteredCards() {
    const [secs, setSecs] = useState(8);
    const [mins, setMins] = useState(32);
    const [hrs, setHrs] = useState(14);

    useEffect(() => {
        const t = setInterval(() => {
            setSecs(s => {
                if (s > 0) return s - 1;
                setMins(m => {
                    if (m > 0) return m - 1;
                    setHrs(h => (h > 0 ? h - 1 : 0));
                    return 59;
                });
                return 59;
            });
        }, 1000);
        return () => clearInterval(t);
    }, []);

    const pad = n => String(n).padStart(2, "0");

    return (
        <div style={{ position: "relative", width: "100%", height: "100%", minHeight: 420 }}>
            <div style={{ position: "absolute", top: "8%", left: "4%", width: 190, borderRadius: 14, background: "#0C0C0D", boxShadow: "0 12px 40px rgba(0,0,0,0.28)", overflow: "hidden", animation: "floatA 5s ease-in-out infinite" }}>
                <div style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", gap: 5, marginBottom: 10 }}>
                        {["#FF5F57", "#FEBC2E", "#28C840"].map(c => (
                            <div key={c} style={{ width: 7, height: 7, borderRadius: "50%", background: c }} />
                        ))}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <div><span style={{ fontFamily: "monospace", fontSize: "0.62rem", color: C.yellow }}>const</span><span style={{ fontFamily: "monospace", fontSize: "0.62rem", color: "#7DD3FC" }}> hack</span></div>
                        <div><span style={{ fontFamily: "monospace", fontSize: "0.62rem", color: "#86EFAC" }}>  = async</span></div>
                    </div>
                    <div style={{ marginTop: 10, borderRadius: 6, background: "rgba(244,221,14,0.15)", border: "1px solid rgba(244,221,14,0.25)", padding: "4px 9px", display: "inline-block" }}>
                        <span style={{ fontFamily: "monospace", fontSize: "0.56rem", color: C.yellow }}>▶ build success</span>
                    </div>
                </div>
            </div>

            <div style={{ position: "absolute", bottom: "14%", left: "3%", width: 160, borderRadius: 14, background: "#0C0C0D", boxShadow: "0 12px 40px rgba(0,0,0,0.28)", overflow: "hidden", animation: "floatB 6s ease-in-out infinite" }}>
                <div style={{ padding: "12px 14px" }}>
                    <div style={{ fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 6 }}>Total prizes</div>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", color: C.yellow, lineHeight: 1, marginBottom: 2 }}>₹5L+</div>
                    <div style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.45)", marginBottom: 10 }}>Across 6 tracks</div>
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                        {["🏆", "💻", "⚡", "🔥", "🌐"].map((e, i) => (
                            <div key={i} style={{ width: 22, height: 22, borderRadius: 6, background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem" }}>{e}</div>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ position: "absolute", top: "40%", left: "35%", transform: "translateX(-50%)", width: 210, borderRadius: 14, background: C.surface, border: `1px solid ${C.border}`, boxShadow: "0 8px 32px rgba(0,0,0,0.08)", overflow: "hidden", animation: "floatC 5.5s ease-in-out infinite" }}>
                <div style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 0 3px rgba(34,197,94,0.2)" }} />
                        <span style={{ fontSize: "0.52rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#15803D" }}>Live now</span>
                    </div>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.04em", color: C.ink, marginBottom: 2 }}>HackTheCore '25</div>
                    <div style={{ fontSize: "0.58rem", color: C.inkMid, marginBottom: 12 }}>48hr · Full-stack + AI track</div>
                    <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                        {[[pad(hrs), "HRS"], [pad(mins), "MIN"], [pad(secs), "SEC"]].map(([v, l]) => (
                            <div key={l} style={{ flex: 1, background: C.bg, borderRadius: 8, padding: "6px 4px", textAlign: "center" }}>
                                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", color: C.ink, lineHeight: 1 }}>{v}</div>
                                <div style={{ fontSize: "0.42rem", color: C.inkMid, letterSpacing: "0.08em" }}>{l}</div>
                            </div>
                        ))}
                    </div>
                    <div style={{ height: 3, borderRadius: 99, background: C.border, overflow: "hidden", marginBottom: 4 }}>
                        <div style={{ width: "62%", height: "100%", borderRadius: 99, background: C.yellow }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: "0.48rem", color: C.inkMid }}>62% done</span>
                        <span style={{ fontSize: "0.48rem", color: C.inkMid }}>247 teams</span>
                    </div>
                </div>
            </div>

            <div style={{ position: "absolute", top: "6%", right: "3%", width: 155, borderRadius: 14, background: C.surface, border: `1px solid ${C.border}`, boxShadow: "0 8px 32px rgba(0,0,0,0.08)", overflow: "hidden", animation: "floatD 4.5s ease-in-out infinite" }}>
                <div style={{ padding: "12px 14px" }}>
                    <div style={{ fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.inkMid, marginBottom: 10 }}>Tech stack</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                        {[
                            { label: "React", bg: "#EFF6FF", color: "#1D4ED8" },
                            { label: "Python", bg: "#FEF9C3", color: "#854D0E" },
                            { label: "GPT-4", bg: "#F0FDF4", color: "#166534" },
                            { label: "FastAPI", bg: "#FFF7ED", color: "#9A3412" },
                            { label: "Docker", bg: "#EFF6FF", color: "#1D4ED8" },
                        ].map(({ label, bg, color }) => (
                            <span key={label} style={{ fontSize: "0.55rem", fontWeight: 600, background: bg, color, borderRadius: 5, padding: "3px 7px" }}>{label}</span>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ position: "absolute", bottom: "10%", right: "2%", width: 175, borderRadius: 14, background: C.surface, border: `1px solid ${C.border}`, boxShadow: "0 8px 32px rgba(0,0,0,0.08)", overflow: "hidden", animation: "floatE 6.5s ease-in-out infinite" }}>
                <div style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                        <span style={{ fontSize: "0.52rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.ink }}>Leaderboard</span>
                        <span style={{ fontSize: "0.48rem", color: "#22C55E", fontWeight: 600 }}>Live</span>
                    </div>
                    {[
                        { rank: "01", name: "TeamNexus", pts: "9840", medal: "#FFD700" },
                        { rank: "02", name: "ByteForge", pts: "9210", medal: "#C0C0C0" },
                        { rank: "03", name: "Axiom.dev", pts: "8750", medal: "#CD7F32" },
                    ].map((t, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: i < 2 ? 7 : 0 }}>
                            <div style={{ width: 20, height: 20, borderRadius: 6, background: t.medal + "22", border: `1px solid ${t.medal}44`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <span style={{ fontFamily: "monospace", fontSize: "0.46rem", fontWeight: 700, color: C.ink }}>{t.rank}</span>
                            </div>
                            <span style={{ fontSize: "0.6rem", fontWeight: 500, color: C.ink, flex: 1 }}>{t.name}</span>
                            <span style={{ fontFamily: "monospace", fontSize: "0.56rem", color: C.inkMid }}>{t.pts}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ─── MOBILE: stacked animated cards ─── */
function StackedCards() {
    const W = 230, H = 140, R = 18;
    const cards = [
        {
            anim: "stackTop", rotate: "-14deg", translateX: "14px", translateY: "-52px",
            zIndex: 3, bg: "#0C0C0D", shadow: "0 28px 60px rgba(0,0,0,0.22)",
            content: (
                <div style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", gap: 5, marginBottom: 10 }}>
                        {["#FF5F57", "#FEBC2E", "#28C840"].map(c => (
                            <div key={c} style={{ width: 7, height: 7, borderRadius: "50%", background: c }} />
                        ))}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                        {[
                            [C.yellow, "const", "#7DD3FC", " hack", "rgba(255,255,255,0.12)", 55],
                            ["#86EFAC", "await", "#FDA4AF", " submit(", "rgba(255,255,255,0.08)", 44],
                            ["#C4B5FD", "return", "rgba(255,255,255,0.3)", " 200", "rgba(255,255,255,0.06)", 36],
                        ].map(([c1, t1, c2, t2, barBg, barW], i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                <span style={{ fontFamily: "monospace", fontSize: "0.6rem", color: c1 }}>{t1}</span>
                                <span style={{ fontFamily: "monospace", fontSize: "0.6rem", color: c2 }}>{t2}</span>
                                <div style={{ flex: 1, height: 2, borderRadius: 99, background: barBg, maxWidth: barW }} />
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: 10, borderRadius: 6, background: "rgba(244,221,14,0.15)", border: "1px solid rgba(244,221,14,0.25)", padding: "4px 9px", display: "inline-block" }}>
                        <span style={{ fontFamily: "monospace", fontSize: "0.58rem", color: C.yellow }}>▶ build passed</span>
                    </div>
                </div>
            ),
        },
        {
            anim: "stackMid", rotate: "3deg", translateX: "-6px", translateY: "0px",
            zIndex: 2, bg: C.surface, border: `1px solid ${C.border}`, shadow: "0 24px 56px rgba(0,0,0,0.12)",
            content: (
                <div style={{ padding: "16px 18px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 0 3px rgba(34,197,94,0.18)" }} />
                            <span style={{ fontSize: "0.58rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#15803D" }}>Live</span>
                        </div>
                        <span style={{ fontSize: "0.58rem", color: C.inkMid }}>48 hrs left</span>
                    </div>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.05rem", letterSpacing: "0.04em", color: C.ink, marginBottom: 2 }}>HackTheCore '25</div>
                    <div style={{ fontSize: "0.62rem", color: C.inkMid, marginBottom: 12 }}>247 teams · AI + Full-stack</div>
                    <div style={{ height: 3, borderRadius: 99, background: C.border, overflow: "hidden", marginBottom: 4 }}>
                        <div style={{ width: "62%", height: "100%", borderRadius: 99, background: C.yellow }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: "0.52rem", color: C.inkMid }}>62% through</span>
                        <span style={{ fontSize: "0.52rem", color: C.inkMid }}>₹5L+ prizes</span>
                    </div>
                </div>
            ),
        },
        {
            anim: "stackBot", rotate: "17deg", translateX: "-22px", translateY: "52px",
            zIndex: 1, bg: C.yellow, shadow: "0 32px 72px rgba(244,221,14,0.38)",
            content: (
                <div style={{ padding: "14px 16px" }}>
                    <div style={{ fontSize: "0.58rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(0,0,0,0.45)", marginBottom: 8 }}>
                        Leaderboard
                    </div>
                    {[
                        { rank: "01", name: "TeamNexus", pts: "9840" },
                        { rank: "02", name: "ByteForge", pts: "9210" },
                        { rank: "03", name: "Axiom.dev", pts: "8750" },
                    ].map((t, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: i < 2 ? 7 : 0 }}>
                            <div style={{ width: 18, height: 18, borderRadius: 5, background: "rgba(0,0,0,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <span style={{ fontFamily: "monospace", fontSize: "0.48rem", fontWeight: 700, color: C.ink }}>{t.rank}</span>
                            </div>
                            <span style={{ fontSize: "0.65rem", fontWeight: 500, color: C.ink, flex: 1 }}>{t.name}</span>
                            <span style={{ fontFamily: "monospace", fontSize: "0.6rem", color: "rgba(0,0,0,0.5)" }}>{t.pts}</span>
                        </div>
                    ))}
                </div>
            ),
        },
    ];

    return (
        <div style={{ position: "relative", width: W, height: H + 120, margin: "0 auto" }}>
            {cards.map((card, i) => (
                <div key={i} style={{ position: "absolute", top: "50%", left: "50%", width: W, height: H, borderRadius: R, background: card.bg, border: card.border || "none", boxShadow: card.shadow, transform: `translate(-50%, -50%) rotate(${card.rotate}) translateX(${card.translateX}) translateY(${card.translateY})`, animation: `${card.anim} 4s ease-in-out infinite`, zIndex: card.zIndex, overflow: "hidden" }}>
                    {card.content}
                </div>
            ))}
        </div>
    );
}

/* ── Shared form ── */
function Field({ label, type = "text", placeholder, value, onChange, error, suffix }) {
    const [focused, setFocused] = useState(false);
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.68rem", fontWeight: 500, letterSpacing: "0.07em", textTransform: "uppercase", color: focused ? C.ink : C.inkMid, transition: "color 0.15s" }}>{label}</label>
            <div style={{ position: "relative", border: `1.5px solid ${error ? C.error : focused ? C.borderFocus : C.border}`, borderRadius: 8, background: focused ? "#fff" : C.bg, transition: "border-color 0.15s, background 0.15s", boxShadow: focused && !error ? "0 0 0 3px rgba(12,12,13,0.06)" : "none" }}>
                <input type={type} placeholder={placeholder} value={value} onChange={onChange}
                    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                    style={{ width: "100%", boxSizing: "border-box", background: "transparent", border: "none", outline: "none", padding: suffix ? "0.72rem 2.8rem 0.72rem 0.9rem" : "0.72rem 0.9rem", fontFamily: "'Inter', sans-serif", fontSize: "0.88rem", color: C.ink }} />
                {suffix && <div style={{ position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)", color: C.inkMid, display: "flex", cursor: "pointer" }}>{suffix}</div>}
            </div>
            {error && <span style={{ fontSize: "0.68rem", color: C.error }}>{error}</span>}
        </div>
    );
}

function OAuthBtn({ icon, label, onClick, disabled }) {
    const [hov, setHov] = useState(false);
    return (
        <button type="button" onClick={onClick} disabled={disabled}
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.45rem", background: hov ? C.leftBg : C.surface, border: `1.5px solid ${C.border}`, borderRadius: 8, padding: "0.65rem", cursor: disabled ? "not-allowed" : "pointer", transition: "background 0.15s", fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", fontWeight: 500, color: disabled ? C.inkFaint : C.ink, whiteSpace: "nowrap", opacity: disabled ? 0.5 : 1, position: "relative" }}
            onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            title={disabled ? "Coming soon" : undefined}>
            {icon} {label}
            {disabled && <span style={{ position: "absolute", top: -8, right: -4, fontSize: "0.5rem", background: C.ink, color: C.yellow, padding: "1px 5px", borderRadius: 4, fontWeight: 600, letterSpacing: "0.05em" }}>SOON</span>}
        </button>
    );
}

function FormPanel({ done, setDone }) {
    const { register, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPw, setConfirmPw] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");

    // ── Google OAuth click and query param error checker ──
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const error = params.get("error");
        if (error) {
            setServerError("Google authentication failed. Please try again.");
            window.history.replaceState({}, document.title, window.location.pathname);
        }
        
        const hasToken = params.get("token");
        if (hasToken) {
            setLoading(true);
        }
    }, []);

    const handleGoogleClick = () => {
        window.location.href = `${API_BASE}/api/auth/google`;
    };

    const validate = () => {
        const e = {};
        if (!name.trim()) e.name = "Name is required.";
        if (!email.trim()) e.email = "Email is required.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email.";
        
        if (!password) e.password = "Password is required.";
        else if (password.length < 8) e.password = "Password must be at least 8 characters.";
        else {
            if (!/[A-Z]/.test(password)) e.password = "Must contain an uppercase letter.";
            else if (!/[a-z]/.test(password)) e.password = "Must contain a lowercase letter.";
            else if (!/[0-9]/.test(password)) e.password = "Must contain a number.";
        }

        if (password !== confirmPw) {
            e.confirmPw = "Passwords do not match.";
        }
        return e;
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        const e = validate();
        if (Object.keys(e).length) { setErrors(e); return; }
        setErrors({});
        setServerError("");
        setLoading(true);

        try {
            await register(name, email, password);
            setDone(true);
            setTimeout(() => navigate("/"), 1200);
        } catch (err) {
            setServerError(err.message || "Registration failed.");
        } finally {
            setLoading(false);
        }
    };

    if (done) {
        return (
            <div style={{ textAlign: "center", animation: "fadeUp 0.4s ease both" }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: C.ink, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M5 13l4 4L19 7" stroke={C.yellow} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", letterSpacing: "0.04em", color: C.ink, marginBottom: "0.4rem" }}>Account Created.</h2>
                <p style={{ fontSize: "0.8rem", color: C.inkMid }}>Redirecting to your dashboard…</p>
            </div>
        );
    }

    return (
        <>
            <div className="f0" style={{ marginBottom: "1.5rem" }}>
                <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.6rem", letterSpacing: "0.03em", color: C.ink, lineHeight: 1, marginBottom: "0.35rem" }}>Create Account</h2>
                <p style={{ fontSize: "0.8rem", color: C.inkMid }}>
                    Have an account?{" "}
                    <Link to="/login" style={{ color: C.ink, fontWeight: 600, textDecoration: "none", borderBottom: `1px solid ${C.ink}`, paddingBottom: 1 }}>Sign in here</Link>
                </p>
            </div>

            {serverError && (
                <div style={{ marginBottom: "1.5rem", padding: "0.6rem 0.8rem", background: "#FEE2E2", border: "1px solid #FECACA", borderRadius: 8, fontSize: "0.78rem", color: "#DC2626" }}>
                    {serverError}
                </div>
            )}

            <div className="f1" style={{ display: "flex", gap: "0.5rem", marginBottom: "1.2rem" }}>
                <OAuthBtn icon={<IconGoogle />} label="Google" onClick={handleGoogleClick} />
                <OAuthBtn icon={<IconGitHub />} label="GitHub" disabled />
            </div>

            <div className="f2" style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.2rem" }}>
                <div style={{ flex: 1, height: 1, background: C.border }} />
                <span style={{ fontSize: "0.62rem", color: C.inkFaint, letterSpacing: "0.1em", textTransform: "uppercase" }}>or</span>
                <div style={{ flex: 1, height: 1, background: C.border }} />
            </div>

            <form onSubmit={handleSubmit} noValidate>
                <div className="f3" style={{ marginBottom: "0.8rem" }}>
                    <Field label="Full Name" type="text" placeholder="John Doe" value={name}
                        onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: "" })); setServerError(""); }}
                        error={errors.name} />
                </div>
                <div className="f3" style={{ marginBottom: "0.8rem" }}>
                    <Field label="Email" type="email" placeholder="you@example.com" value={email}
                        onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: "" })); setServerError(""); }}
                        error={errors.email} />
                </div>
                <div className="f3" style={{ marginBottom: "0.8rem" }}>
                    <Field label="Password" type={showPw ? "text" : "password"} placeholder="Min. 8 characters" value={password}
                        onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: "" })); setServerError(""); }}
                        error={errors.password}
                        suffix={<span onClick={() => setShowPw(p => !p)}><IconEye open={showPw} /></span>} />
                </div>
                <div className="f3" style={{ marginBottom: "1.2rem" }}>
                    <Field label="Confirm Password" type={showPw ? "text" : "password"} placeholder="••••••••" value={confirmPw}
                        onChange={e => { setConfirmPw(e.target.value); setErrors(p => ({ ...p, confirmPw: "" })); setServerError(""); }}
                        error={errors.confirmPw} />
                </div>

                <div className="f5">
                    <button type="submit" disabled={loading}
                        style={{ width: "100%", padding: "0.82rem", background: loading ? C.leftBg : C.ink, border: "none", borderRadius: 8, fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: loading ? C.inkMid : C.bg, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", transition: "opacity 0.15s" }}
                        onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = "0.85"; }}
                        onMouseLeave={e => { if (!loading) e.currentTarget.style.opacity = "1"; }}>
                        {loading ? (
                            <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 0.75s linear infinite" }}>
                                <circle cx="12" cy="12" r="10" stroke="#ddd" strokeWidth="2.5" />
                                <path d="M12 2a10 10 0 0110 10" stroke={C.ink} strokeWidth="2.5" strokeLinecap="round" />
                            </svg> Registering…</>
                        ) : "Sign Up"}
                    </button>
                </div>
            </form>

            <p style={{ marginTop: "1.5rem", fontSize: "0.62rem", color: C.inkFaint, textAlign: "center", lineHeight: 1.6 }}>
                By signing up you agree to our{" "}
                <a href="/terms" style={{ color: C.inkMid, textDecoration: "underline", textUnderlineOffset: 2 }}>Terms</a> &amp;{" "}
                <a href="/privacy" style={{ color: C.inkMid, textDecoration: "underline", textUnderlineOffset: 2 }}>Privacy</a>.
            </p>
        </>
    );
}

/* ── Desktop layout ── */
function DesktopLayout({ done, setDone }) {
    return (
        <div style={{ minHeight: "100vh", display: "flex" }}>
            <div style={{ flex: "0 0 48%", background: C.leftBg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "2.5rem 2rem", position: "relative", overflow: "hidden", borderRight: `1px solid ${C.border}` }}>
                <div style={{ width: "100%", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
                        <rect width="22" height="22" rx="4" fill={C.ink} />
                        <path d="M7 6v10M15 6v10M7 11h8" stroke={C.yellow} strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.06em", color: C.ink, lineHeight: 1 }}>HackTheCore</span>
                </div>

                <div style={{ flex: 1, width: "100%", position: "relative" }}>
                    <ScatteredCards />
                </div>

                <div style={{ width: "100%", textAlign: "center" }}>
                    <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.7rem", letterSpacing: "0.04em", color: C.ink, lineHeight: 1.05, marginBottom: "0.35rem" }}>Build. Ship. Win.</p>
                    <p style={{ fontSize: "0.74rem", color: C.inkMid, marginBottom: "1.2rem" }}>India's builder community</p>
                    <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                        {[["2.4K+", "Builders"], ["48", "Hackathons"], ["₹50L+", "In prizes"]].map(([v, l]) => (
                            <div key={l} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "0.4rem 0.75rem", textAlign: "center" }}>
                                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.92rem", letterSpacing: "0.03em", color: C.ink, lineHeight: 1 }}>{v}</div>
                                <div style={{ fontSize: "0.52rem", color: C.inkMid, letterSpacing: "0.06em", textTransform: "uppercase", marginTop: 2 }}>{l}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 2rem", background: C.surface }}>
                <div style={{ width: "100%", maxWidth: 380 }}>
                    <FormPanel done={done} setDone={setDone} />
                </div>
            </div>
        </div>
    );
}

/* ── Mobile layout ── */
function MobileLayout({ done, setDone }) {
    return (
        <div style={{ minHeight: "100vh", background: C.bg }}>
            <div style={{ background: C.leftBg, borderBottom: `1px solid ${C.border}`, padding: "16px 20px 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
                    <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
                        <rect width="22" height="22" rx="4" fill={C.ink} />
                        <path d="M7 6v10M15 6v10M7 11h8" stroke={C.yellow} strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.06em", color: C.ink, lineHeight: 1 }}>HackTheCore</span>
                </div>

                <StackedCards />

                <div style={{ textAlign: "center", padding: "14px 0 18px" }}>
                    <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", letterSpacing: "0.04em", color: C.ink, lineHeight: 1.05, marginBottom: 2 }}>Build. Ship. Win.</p>
                    <p style={{ fontSize: "0.72rem", color: C.inkMid }}>India's builder community</p>
                </div>

                <div style={{ display: "flex", gap: 6, justifyContent: "center", paddingBottom: 18 }}>
                    {[["2.4K+", "Builders"], ["48", "Hackathons"], ["₹50L+", "Prizes"]].map(([v, l]) => (
                        <div key={l} style={{ flex: 1, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "6px 8px", textAlign: "center" }}>
                            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.85rem", letterSpacing: "0.03em", color: C.ink, lineHeight: 1 }}>{v}</div>
                            <div style={{ fontSize: "0.5rem", color: C.inkMid, letterSpacing: "0.05em", textTransform: "uppercase", marginTop: 2 }}>{l}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ padding: "20px 20px 28px", background: C.surface }}>
                <FormPanel done={done} setDone={setDone} />
            </div>
        </div>
    );
}

/* ── Root ── */
export default function Signup() {
    const [done, setDone] = useState(false);
    const [isMobile, setIsMobile] = useState(
        typeof window !== "undefined" ? window.innerWidth < 768 : false
    );

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 767px)");
        const handler = (e) => setIsMobile(e.matches);
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", background: C.bg }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::placeholder { color: #C4C4C0; }

        @keyframes floatA {
          0%,100% { transform: translateY(0px) rotate(-2deg); }
          50%      { transform: translateY(-10px) rotate(-1deg); }
        }
        @keyframes floatB {
          0%,100% { transform: translateY(0px) rotate(1deg); }
          50%      { transform: translateY(-8px) rotate(2deg); }
        }
        @keyframes floatC {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          50%      { transform: translateY(-12px) rotate(0.5deg); }
        }
        @keyframes floatD {
          0%,100% { transform: translateY(0px) rotate(2deg); }
          50%      { transform: translateY(-9px) rotate(1deg); }
        }
        @keyframes floatE {
          0%,100% { transform: translateY(0px) rotate(-1deg); }
          50%      { transform: translateY(-11px) rotate(-2deg); }
        }

        @keyframes stackTop {
          0%,100% { transform: translate(-50%,-50%) rotate(-14deg) translateX(14px) translateY(-52px); }
          50%      { transform: translate(-50%,-50%) rotate(-11deg) translateX(18px) translateY(-60px); }
        }
        @keyframes stackMid {
          0%,100% { transform: translate(-50%,-50%) rotate(3deg) translateX(-6px) translateY(0px); }
          50%      { transform: translate(-50%,-50%) rotate(5deg) translateX(-9px) translateY(-9px); }
        }
        @keyframes stackBot {
          0%,100% { transform: translate(-50%,-50%) rotate(17deg) translateX(-22px) translateY(52px); }
          50%      { transform: translate(-50%,-50%) rotate(14deg) translateX(-18px) translateY(60px); }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .f0 { animation: fadeUp 0.45s ease both; }
        .f1 { animation: fadeUp 0.45s 0.06s ease both; }
        .f2 { animation: fadeUp 0.45s 0.12s ease both; }
        .f3 { animation: fadeUp 0.45s 0.18s ease both; }
        .f4 { animation: fadeUp 0.45s 0.24s ease both; }
        .f5 { animation: fadeUp 0.45s 0.30s ease both; }
      `}</style>

            {isMobile
                ? <MobileLayout done={done} setDone={setDone} />
                : <DesktopLayout done={done} setDone={setDone} />
            }
        </div>
    );
}

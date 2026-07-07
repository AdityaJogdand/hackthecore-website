import { useState } from "react";

const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

const C = {
    bg: "#FAFAF8",
    bg2: "#F2F2EF",
    bgCard: "#ffffff",
    bgDark: "#111110",
    border: "#E8E8E6",
    borderDark: "#2a2e2c",
    borderHover: "#F4DD0E",
    ink: "#111110",
    inkMid: "#666664",
    inkFaint: "#ABABAA",
    yellow: "#F4DD0E",
    rule: "#DDDDD9",
};

/* ─── book a call form ────────────────────────────────────────────────────── */
export default function BookACall() {
    const [activeType, setActiveType] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", org: "", phone: "" });
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const TYPES = ["Sponsor", "Mentor", "Infra / Tools", "Conducting Hackathon", "Hiring", "Other"];

    const canSubmit = formData.name.trim() && formData.email.trim() && activeType && !submitting;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!canSubmit) return;
        setSubmitting(true);
        setSubmitError("");
        try {
            const response = await fetch(`${API_BASE}/partnerships`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    org: formData.org,
                    phone: formData.phone,
                    partnershipType: activeType,
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to submit request.");
            }
            setSubmitted(true);
        } catch (err) {
            setSubmitError(err.message || "Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section id="book-a-call" style={{
            background: C.bg2,
            padding: "clamp(2rem, 5vw, 80px) clamp(1.5rem, 5vw, 80px)",
            boxSizing: "border-box",
        }}>
            {/* responsive overrides */}
            <style>{`
        .htc-book-grid {
          display: grid;
          grid-template-columns: 5fr 6fr;
          gap: clamp(3rem, 6vw, 100px);
          align-items: start;
        }
        @media (max-width: 860px) {
          .htc-book-grid { grid-template-columns: 1fr; gap: 2.5rem; }
        }
        .htc-field input:focus {
          border-color: ${C.yellow} !important;
          box-shadow: 0 0 0 2px rgba(244,221,14,0.08);
        }
        .htc-submit-btn {
          position: relative;
          overflow: hidden;
        }
        .htc-submit-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
          transform: translateX(-100%);
          transition: transform 0.4s ease;
        }
        .htc-submit-btn:hover::after {
          transform: translateX(100%);
        }
        @keyframes htc-pulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.25); opacity: 1; }
        }
      `}</style>

            <div style={{
                maxWidth: 1200,
                margin: "0 auto",
                boxSizing: "border-box",
            }}>
                <div className="htc-book-grid">

                    {/* ── left: copy ── */}
                    <div style={{ paddingTop: 8 }}>
                        <div style={{
                            display: "flex", alignItems: "center", gap: "0.75rem",
                            marginBottom: 28,
                        }}>
                            <div style={{ width: 28, height: 1, background: C.border }} />
                            <span style={{
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 500,
                                fontSize: "0.65rem",
                                letterSpacing: "0.2em",
                                textTransform: "uppercase",
                                color: C.inkFaint,
                            }}>Partner With Us</span>
                        </div>

                        <h2 style={{
                            fontFamily: "'Anton', 'Inter', sans-serif",
                            fontWeight: 400,
                            fontSize: "clamp(2.6rem,5vw,5rem)",
                            lineHeight: 0.92,
                            letterSpacing: "-0.02em",
                            color: C.ink,
                            margin: "0 0 clamp(1.2rem,2.5vw,2rem)",
                            textTransform: "uppercase",
                        }}>
                            LET'S BUILD<br />
                            <span style={{
                                fontFamily: "'Instrument Serif', serif",
                                fontStyle: "italic",
                                fontWeight: 400,
                                letterSpacing: "-0.03em",
                                textTransform: "none",
                                color: C.inkMid,
                                fontSize: "0.92em",
                            }}>Together.</span>
                        </h2>

                        <div style={{ height: 1, background: C.border, marginBottom: "clamp(1.2rem,2.5vw,2rem)" }} />

                        <p style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 400,
                            fontSize: "clamp(0.88rem,1.3vw,1rem)",
                            lineHeight: 1.75,
                            color: C.inkMid,
                            margin: "0 0 2.5rem",
                            maxWidth: 420,
                        }}>
                            Reach 2,400+ builders, hackers, and founders across India.
                            Schedule a brief call and let's explore how we can grow together.
                        </p>

                        {/* key details */}
                        <div style={{
                            display: "flex", flexDirection: "column", gap: "1rem",
                            borderLeft: `2px solid ${C.border}`,
                            paddingLeft: "1.2rem",
                            marginBottom: "2.5rem",
                        }}>
                            {[
                                { label: "Duration", value: "20 minutes" },
                                { label: "Format", value: "Video call or async" },
                                { label: "Response", value: "Within 24 hours" },
                            ].map(item => (
                                <div key={item.label} style={{ display: "flex", gap: "0.6rem", alignItems: "baseline" }}>
                                    <span style={{
                                        fontFamily: "'Inter', sans-serif",
                                        fontWeight: 500,
                                        fontSize: "0.68rem",
                                        letterSpacing: "0.08em",
                                        textTransform: "uppercase",
                                        color: C.inkMid,
                                        minWidth: 72,
                                    }}>{item.label}</span>
                                    <span style={{
                                        fontFamily: "'Inter', sans-serif",
                                        fontWeight: 500,
                                        fontSize: "0.88rem",
                                        color: C.ink,
                                    }}>{item.value}</span>
                                </div>
                            ))}
                        </div>

                        <p style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 400,
                            fontSize: "0.78rem",
                            color: C.inkFaint,
                            margin: 0,
                            lineHeight: 1.6,
                            maxWidth: 360,
                        }}>
                            No commitment required. We'll share a calendar link
                            after reviewing your details.
                        </p>
                    </div>

                    {/* ── right: form card ── */}
                    {!submitted ? (
                        <form
                            onSubmit={handleSubmit}
                            style={{
                                background: C.bgDark,
                                borderRadius: 8,
                                padding: "clamp(2rem,4vw,2.8rem)",
                                display: "flex",
                                flexDirection: "column",
                                gap: "1.3rem",
                            }}
                        >
                            {/* card header */}
                            <div style={{
                                paddingBottom: "1.2rem",
                                borderBottom: `1px solid ${C.borderDark}`,
                                marginBottom: "0.2rem",
                            }}>
                                <p style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontWeight: 500,
                                    fontSize: "1rem",
                                    letterSpacing: "-0.01em",
                                    color: "#FAFAF8",
                                    margin: 0,
                                }}>Schedule a Partnership Call</p>
                                <p style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontWeight: 400,
                                    fontSize: "0.78rem",
                                    color: "#666664",
                                    margin: "6px 0 0",
                                }}>Fill in your details and we'll set up a time that works.</p>
                            </div>

                            {/* form fields */}
                            {[
                                { key: "name", label: "Full Name", placeholder: "Arjun Sharma", type: "text", required: true },
                                { key: "email", label: "Work Email", placeholder: "arjun@company.com", type: "email", required: true },
                                { key: "org", label: "Organisation", placeholder: "Company / Startup / Fund", type: "text", required: false },
                                { key: "phone", label: "Phone Number", placeholder: "+91 98765 43210 (Optional)", type: "tel", required: false },
                            ].map(field => (
                                <div key={field.key} className="htc-field" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                    <label style={{
                                        fontFamily: "'Inter', sans-serif",
                                        fontWeight: 500,
                                        fontSize: "0.72rem",
                                        color: "#999",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.3rem",
                                    }}>
                                        {field.label}
                                        {field.required && <span style={{ color: C.yellow, fontSize: "0.8rem" }}>*</span>}
                                    </label>
                                    <input
                                        type={field.type}
                                        required={field.required}
                                        placeholder={field.placeholder}
                                        value={formData[field.key]}
                                        onChange={e => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                                        style={{
                                            background: "#1a1e1c",
                                            border: `1px solid ${C.borderDark}`,
                                            borderRadius: 6,
                                            padding: "0.7rem 0.9rem",
                                            fontFamily: "'Inter', sans-serif",
                                            fontSize: "0.88rem",
                                            color: "#FAFAF8",
                                            outline: "none",
                                            transition: "border-color 0.2s, box-shadow 0.2s",
                                            width: "100%",
                                            boxSizing: "border-box",
                                        }}
                                    />
                                </div>
                            ))}

                            {/* partnership type */}
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                <label style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontWeight: 500,
                                    fontSize: "0.72rem",
                                    color: "#999",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.3rem",
                                }}>
                                    Partnership Type
                                    <span style={{ color: C.yellow, fontSize: "0.8rem" }}>*</span>
                                </label>
                                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                    {TYPES.map(type => {
                                        const active = activeType === type;
                                        return (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setActiveType(active ? null : type)}
                                                style={{
                                                    fontFamily: "'Inter', sans-serif",
                                                    fontWeight: 500,
                                                    fontSize: "0.72rem",
                                                    letterSpacing: "0.02em",
                                                    color: active ? C.ink : "#888",
                                                    background: active ? C.yellow : "transparent",
                                                    border: `1px solid ${active ? C.yellow : C.borderDark}`,
                                                    borderRadius: 6,
                                                    padding: "0.4em 0.85em",
                                                    cursor: "pointer",
                                                    transition: "all 0.2s ease",
                                                }}
                                                onMouseEnter={e => {
                                                    if (!active) e.currentTarget.style.borderColor = "#555";
                                                }}
                                                onMouseLeave={e => {
                                                    if (!active) e.currentTarget.style.borderColor = C.borderDark;
                                                }}
                                            >{type}</button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* submit */}
                            {submitError && (
                                <p style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: "0.8rem",
                                    color: "#ff6b6b",
                                    margin: "0 0 10px 0",
                                    textAlign: "center"
                                }}>
                                    {submitError}
                                </p>
                            )}
                            <button
                                type="submit"
                                disabled={!canSubmit || submitting}
                                className="htc-submit-btn"
                                style={{
                                    marginTop: 8,
                                    background: canSubmit ? C.yellow : "#333",
                                    color: canSubmit ? C.ink : "#666",
                                    border: "none",
                                    borderRadius: 6,
                                    padding: "0.85rem 1.5rem",
                                    fontFamily: "'Inter', sans-serif",
                                    fontWeight: 600,
                                    fontSize: "0.82rem",
                                    letterSpacing: "0.02em",
                                    cursor: canSubmit ? "pointer" : "not-allowed",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "0.5rem",
                                    width: "100%",
                                    transition: "background 0.2s, color 0.2s, opacity 0.2s",
                                    opacity: canSubmit ? 1 : 0.6,
                                }}
                            >
                                {submitting ? "Booking call..." : "Book My Call"}
                                {!submitting && (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                        <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </button>

                            <p style={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: "0.7rem",
                                color: "#555",
                                textAlign: "center",
                                margin: 0,
                                lineHeight: 1.5,
                            }}>
                                We'll respond within 24 hours with a calendar invite.
                            </p>
                        </form>
                    ) : (
                        /* ── success state ── */
                        <div style={{
                            background: C.bgDark,
                            borderRadius: 8,
                            padding: "clamp(2.5rem,5vw,3.5rem) clamp(2rem,4vw,2.8rem)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                            gap: "1rem",
                            minHeight: 380,
                        }}>
                            {/* checkmark */}
                            <div style={{
                                width: 56, height: 56,
                                borderRadius: "50%",
                                background: C.yellow,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginBottom: 8,
                            }}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                    <path d="M5 13l4 4L19 7" stroke={C.ink} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>

                            <h3 style={{
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 600,
                                fontSize: "1.25rem",
                                color: "#FAFAF8",
                                margin: 0,
                                letterSpacing: "-0.01em",
                            }}>Request Received</h3>

                            <p style={{
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 400,
                                fontSize: "0.88rem",
                                color: "#888",
                                margin: 0,
                                lineHeight: 1.6,
                                maxWidth: 320,
                            }}>
                                Thanks, {formData.name.split(" ")[0]}. We'll review your details and
                                send a calendar invite to <strong style={{ color: "#bbb" }}>{formData.email}</strong> within 24 hours.
                            </p>

                            <button
                                onClick={() => {
                                    setSubmitted(false);
                                    setFormData({ name: "", email: "", org: "", phone: "" });
                                    setActiveType(null);
                                }}
                                style={{
                                    marginTop: 12,
                                    background: "transparent",
                                    color: "#888",
                                    border: `1px solid ${C.borderDark}`,
                                    borderRadius: 6,
                                    padding: "0.55rem 1.2rem",
                                    fontFamily: "'Inter', sans-serif",
                                    fontWeight: 500,
                                    fontSize: "0.75rem",
                                    cursor: "pointer",
                                    transition: "border-color 0.2s, color 0.2s",
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.borderColor = "#555";
                                    e.currentTarget.style.color = "#ccc";
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.borderColor = C.borderDark;
                                    e.currentTarget.style.color = "#888";
                                }}
                            >Submit Another Request</button>
                        </div>
                    )}
                </div>
            </div>
        </section >
    );
}
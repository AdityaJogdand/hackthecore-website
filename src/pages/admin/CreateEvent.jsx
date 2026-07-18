import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const FONT = "Barlow, sans-serif";
const ease = [0.22, 1, 0.36, 1];
const API = `${import.meta.env.VITE_API_URL}`;

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${sessionStorage.getItem("htc_admin_token")}`,
});

/* ─── Shared style primitives ─── */
const fieldBase = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10,
  padding: "12px 14px",
  fontFamily: FONT,
  fontSize: 14,
  color: "#fff",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

const focusHandlers = {
  onFocus: e => (e.target.style.borderColor = "rgba(255,255,0,0.45)"),
  onBlur: e => (e.target.style.borderColor = "rgba(255,255,255,0.1)"),
};

/* ─── Shared sub-components ─── */
const Label = ({ children, required }) => (
  <label style={{ fontFamily: FONT, fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", display: "block", marginBottom: 6 }}>
    {children}{required && <span style={{ color: "#FFFF00", marginLeft: 3 }}>*</span>}
  </label>
);

const Field = ({ label, required, children }) => (
  <div style={{ display: "flex", flexDirection: "column" }}>
    <Label required={required}>{label}</Label>
    {children}
  </div>
);

const Input = ({ label, required, ...props }) => (
  <Field label={label} required={required}>
    <input {...props} style={fieldBase} {...focusHandlers} />
  </Field>
);

const TextArea = ({ label, required, rows = 3, ...props }) => (
  <Field label={label} required={required}>
    <textarea {...props} rows={rows} style={{ ...fieldBase, resize: "vertical" }} {...focusHandlers} />
  </Field>
);

const Select = ({ label, required, value, onChange, options }) => (
  <Field label={label} required={required}>
    <select
      value={value}
      onChange={onChange}
      style={{ ...fieldBase, background: "#111112", appearance: "none", cursor: "pointer" }}
      {...focusHandlers}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value} style={{ background: "#111112" }}>
          {opt.label}
        </option>
      ))}
    </select>
  </Field>
);

const SectionLabel = ({ children, action }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, marginTop: 44 }}>
    <span style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,0,0.6)", whiteSpace: "nowrap" }}>{children}</span>
    <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
    {action}
  </div>
);

const SmallBtn = ({ children, onClick, danger }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      fontFamily: FONT, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
      color: danger ? "rgba(255,120,120,0.7)" : "#FFFF00",
      background: "none",
      border: `1px solid ${danger ? "rgba(255,120,120,0.25)" : "rgba(255,255,0,0.25)"}`,
      borderRadius: 6, padding: "5px 12px", cursor: "pointer",
    }}
  >
    {children}
  </button>
);

const Card = ({ children }) => (
  <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "18px" }}>
    {children}
  </div>
);

/* ─── ImageUpload ─── */
function ImageUpload({ label, required, value, onChange, placeholder = "https://…", previewHeight = 120, previewFit = "cover" }) {
  const fileRef = useRef(null);
  const [mode, setMode] = useState("url");
  const [dragging, setDragging] = useState(false);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => { onChange(e.target.result); setMode("file"); };
    reader.readAsDataURL(file);
  };

  const isBase64 = value && value.startsWith("data:");

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <label style={{ fontFamily: FONT, fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>
          {label}{required && <span style={{ color: "#FFFF00", marginLeft: 3 }}>*</span>}
        </label>
        <div style={{ display: "flex", gap: 4 }}>
          {["url", "file"].map(m => (
            <button key={m} type="button" onClick={() => setMode(m)} style={{
              fontFamily: FONT, fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
              color: mode === m ? "#0C0C0D" : "rgba(255,255,255,0.3)",
              background: mode === m ? "#FFFF00" : "none",
              border: `1px solid ${mode === m ? "#FFFF00" : "rgba(255,255,255,0.12)"}`,
              borderRadius: 5, padding: "3px 9px", cursor: "pointer", transition: "all 0.15s",
            }}>
              {m === "url" ? "URL" : "Upload"}
            </button>
          ))}
        </div>
      </div>

      {mode === "url" && (
        <input
          type="url" placeholder={placeholder}
          value={isBase64 ? "" : (value || "")}
          onChange={e => onChange(e.target.value)}
          style={fieldBase} {...focusHandlers}
        />
      )}

      {mode === "file" && (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => fileRef.current?.click()}
          style={{
            border: `1px dashed ${dragging ? "rgba(255,255,0,0.6)" : "rgba(255,255,255,0.15)"}`,
            borderRadius: 10, padding: "22px 16px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
            cursor: "pointer",
            background: dragging ? "rgba(255,255,0,0.04)" : "rgba(255,255,255,0.02)",
            transition: "all 0.2s",
          }}
        >
          <span style={{ fontSize: 22 }}>🖼</span>
          <span style={{ fontFamily: FONT, fontSize: 12, color: "rgba(255,255,255,0.35)", textAlign: "center" }}>
            {isBase64 ? "Image loaded — click or drop to replace" : "Click to browse or drag & drop"}
          </span>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />
        </div>
      )}

      {value && (
        <div style={{ marginTop: 8, borderRadius: 10, overflow: "hidden", height: previewHeight, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <img src={value} alt="Preview" style={{ width: "100%", height: "100%", objectFit: previewFit }} onError={e => { e.target.style.display = "none"; }} />
          <button type="button" onClick={() => onChange("")} style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 6, color: "rgba(255,255,255,0.6)", fontSize: 11, fontFamily: FONT, fontWeight: 700, letterSpacing: "0.1em", padding: "4px 9px", cursor: "pointer", textTransform: "uppercase" }}>
            ✕ Clear
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Empty row factories ─── */
const emptyTimelineItem = () => ({ time: "", label: "" });
const emptyTrack = () => ({ name: "", desc: "" });
const emptyPrize = () => ({ place: "", label: "", amount: "", perks: [""] });
const emptySponsor = () => ({ name: "", logo: "", tier: "", url: "" });
const emptyFaq = () => ({ question: "", answer: "" });
const emptyJudge = () => ({ name: "", title: "", company: "", photo: "", bio: "" });

const EVENT_TYPE_OPTIONS = [
  { value: "hackathon", label: "Hackathon", desc: "Timeline · problem statement · prizes" },
  { value: "meetup", label: "Meetup", desc: "Single-person RSVP · timeline" },
];

const MODE_OPTIONS = [
  { value: "offline", label: "Offline" },
  { value: "online", label: "Online" },
  { value: "hybrid", label: "Hybrid" },
];

export default function CreateEvent() {
  const navigate = useNavigate();
  const [step, setStep] = useState("pick-type");
  const [eventType, setEventType] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  /* ── Core fields ── */
  const [title, setTitle] = useState("");
  const [banner, setBanner] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [venue, setVenue] = useState("");
  const [city, setCity] = useState("");
  const [eventMode, setEventMode] = useState("offline");
  const [fee, setFee] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [capacity, setCapacity] = useState("");
  const [deadline, setDeadline] = useState("");
  const [registrationLink, setRegistrationLink] = useState("");
  const [description, setDescription] = useState("");
  const [timeline, setTimeline] = useState([emptyTimelineItem()]);
  const [sponsors, setSponsors] = useState([emptySponsor()]);
  const [contact, setContact] = useState({ email: "", twitter: "", discord: "", whatsapp: "" });

  /* ── Venue images ── */
  const [venueImage1, setVenueImage1] = useState("");
  const [venueImage2, setVenueImage2] = useState("");

  /* ── Hackathon-only fields ── */
  const [edition, setEdition] = useState("");
  const [theme, setTheme] = useState("");
  const [themeImage, setThemeImage] = useState("");
  const [overview, setOverview] = useState("");
  const [tracks, setTracks] = useState([emptyTrack()]);
  const [prizes, setPrizes] = useState([emptyPrize()]);
  const [faqs, setFaqs] = useState([emptyFaq()]);
  const [judges, setJudges] = useState([emptyJudge()]);

  /* ── handlers ── */
  const addTimelineItem = () => setTimeline(t => [...t, emptyTimelineItem()]);
  const removeTimelineItem = i => setTimeline(t => t.filter((_, idx) => idx !== i));
  const setTimelineField = (i, key) => e => setTimeline(t => t.map((r, idx) => idx === i ? { ...r, [key]: e.target.value } : r));

  const addTrack = () => setTracks(t => [...t, emptyTrack()]);
  const removeTrack = i => setTracks(t => t.filter((_, idx) => idx !== i));
  const setTrackField = (i, key) => e => setTracks(t => t.map((r, idx) => idx === i ? { ...r, [key]: e.target.value } : r));

  const addPrize = () => setPrizes(p => [...p, emptyPrize()]);
  const removePrize = i => setPrizes(p => p.filter((_, idx) => idx !== i));
  const setPrizeField = (i, key) => e => setPrizes(p => p.map((r, idx) => idx === i ? { ...r, [key]: e.target.value } : r));
  const addPerk = i => setPrizes(p => p.map((r, idx) => idx === i ? { ...r, perks: [...r.perks, ""] } : r));
  const setPerk = (i, j) => e => setPrizes(p => p.map((r, idx) => idx === i ? { ...r, perks: r.perks.map((pk, pj) => pj === j ? e.target.value : pk) } : r));
  const removePerk = (i, j) => setPrizes(p => p.map((r, idx) => idx === i ? { ...r, perks: r.perks.filter((_, pj) => pj !== j) } : r));

  const addSponsor = () => setSponsors(s => [...s, emptySponsor()]);
  const removeSponsor = i => setSponsors(s => s.filter((_, idx) => idx !== i));
  const setSponsorField = (i, key) => e => setSponsors(s => s.map((r, idx) => idx === i ? { ...r, [key]: e.target.value } : r));
  const setSponsorImage = (i, val) => setSponsors(s => s.map((r, idx) => idx === i ? { ...r, logo: val } : r));

  const addFaq = () => setFaqs(f => [...f, emptyFaq()]);
  const removeFaq = i => setFaqs(f => f.filter((_, idx) => idx !== i));
  const setFaqField = (i, key) => e => setFaqs(f => f.map((r, idx) => idx === i ? { ...r, [key]: e.target.value } : r));

  const addJudge = () => setJudges(j => [...j, emptyJudge()]);
  const removeJudge = i => setJudges(j => j.filter((_, idx) => idx !== i));
  const setJudgeField = (i, key) => e => setJudges(j => j.map((r, idx) => idx === i ? { ...r, [key]: e.target.value } : r));
  const setJudgePhoto = (i, val) => setJudges(j => j.map((r, idx) => idx === i ? { ...r, photo: val } : r));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const payload = {
      eventType,
      title, banner, thumbnail, venue, city, date, time,
      mode: eventMode,
      fee,
      capacity, registrationDeadline: deadline, registrationLink,
      description,
      venueImages: [venueImage1, venueImage2].filter(Boolean),
      timeline: timeline.filter(t => t.time && t.label),
      sponsors: sponsors.filter(s => s.name),
      contact,
      ...(eventType === "hackathon" && {
        edition,
        themeImage,
        problemStatement: { theme, overview, tracks: tracks.filter(t => t.name) },
        prizes: prizes.filter(p => p.label).map(p => ({ ...p, perks: p.perks.filter(Boolean) })),
        faqs: faqs.filter(f => f.question && f.answer),
        judges: judges.filter(j => j.name),
      }),
    };

    try {
      const res = await fetch(`${API}/api/events`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });

      // Safely parse — server might return HTML on 404/500
      const contentType = res.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await res.json()
        : { message: `Server error ${res.status}: ${res.statusText}` };

      if (!res.ok) throw new Error(data.message || "Failed to create event.");

      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ background: "#0C0C0D", minHeight: "100vh", color: "#fff" }}>
      {/* Top bar */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, position: "sticky", top: 0, background: "#0C0C0D", zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: "1.1rem", textTransform: "uppercase", letterSpacing: "-0.02em" }}>HackTheCore</span>
          <span style={{ fontFamily: FONT, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,0,0.6)", background: "rgba(255,255,0,0.07)", border: "1px solid rgba(255,255,0,0.2)", borderRadius: 99, padding: "3px 10px" }}>Admin</span>
        </div>
        <button onClick={() => navigate("/admin/dashboard")} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "7px 16px", cursor: "pointer" }}>
          ← Back to dashboard
        </button>
      </div>

      <div style={{ maxWidth: 880, margin: "0 auto", padding: "48px 40px 120px" }}>
        <AnimatePresence mode="wait">
          {step === "pick-type" ? (
            <motion.div key="pick-type" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease }}>
              <h1 style={{ fontFamily: FONT, fontWeight: 900, fontSize: "clamp(2rem, 4vw, 3rem)", textTransform: "uppercase", letterSpacing: "-0.04em", margin: "0 0 8px" }}>Create event</h1>
              <p style={{ fontFamily: FONT, fontSize: 14, color: "rgba(255,255,255,0.35)", marginBottom: 40 }}>Choose what kind of event you're listing.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {EVENT_TYPE_OPTIONS.map(opt => (
                  <button key={opt.value} onClick={() => { setEventType(opt.value); setStep("form"); }}
                    style={{ textAlign: "left", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 16, padding: "24px 26px", cursor: "pointer", transition: "border-color 0.2s, background 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,0,0.35)"; e.currentTarget.style.background = "rgba(255,255,0,0.03)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <h3 style={{ fontFamily: FONT, fontWeight: 900, fontSize: "1.3rem", textTransform: "uppercase", letterSpacing: "-0.02em", color: "#fff", margin: "0 0 6px" }}>{opt.label}</h3>
                        <p style={{ fontFamily: FONT, fontSize: 13, color: "rgba(255,255,255,0.4)", margin: 0 }}>{opt.desc}</p>
                      </div>
                      <span style={{ fontFamily: FONT, fontSize: 20, color: "rgba(255,255,0,0.5)" }}>→</span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={handleSubmit} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <h1 style={{ fontFamily: FONT, fontWeight: 900, fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", textTransform: "uppercase", letterSpacing: "-0.04em", margin: 0 }}>New {eventType}</h1>
                <select value={eventType} onChange={e => setEventType(e.target.value)} style={{ ...fieldBase, width: "auto", background: "#111112", appearance: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  {EVENT_TYPE_OPTIONS.map(o => <option key={o.value} value={o.value} style={{ background: "#111112" }}>{o.label}</option>)}
                </select>
              </div>
              <p style={{ fontFamily: FONT, fontSize: 13, color: "rgba(255,255,255,0.3)", marginBottom: 8 }}>This becomes the banner, sub-header, and content of the public registration page.</p>

              {/* ── BASICS ── */}
              <SectionLabel>Basics</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <Input label="Event title" required placeholder="e.g. 48H Hackathon" value={title} onChange={e => setTitle(e.target.value)} />
                {eventType === "hackathon" && (
                  <Input label="Edition / co-host tag" placeholder="e.g. HTC × BuildFast" value={edition} onChange={e => setEdition(e.target.value)} />
                )}
                <ImageUpload label="Banner image" required value={banner} onChange={setBanner} placeholder="https://… banner image" previewHeight={160} />
                <ImageUpload label="Thumbnail image (optional)" value={thumbnail} onChange={setThumbnail} placeholder="https://… card thumbnail" previewHeight={100} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <Input label="Venue" required placeholder="e.g. NSRCEL, IIM Bangalore" value={venue} onChange={e => setVenue(e.target.value)} />
                  <Input label="City" required placeholder="e.g. Bengaluru" value={city} onChange={e => setCity(e.target.value)} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <Select
                    label="Mode"
                    required
                    value={eventMode}
                    onChange={e => setEventMode(e.target.value)}
                    options={MODE_OPTIONS}
                  />
                  <Input
                    label="Registration fee"
                    placeholder="e.g. Free or ₹499 per team"
                    value={fee}
                    onChange={e => setFee(e.target.value)}
                  />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <Input label="Date" required placeholder="e.g. Sat–Sun, Aug 2–3 2026" value={date} onChange={e => setDate(e.target.value)} />
                  <Input label="Time" required placeholder="e.g. Starts 10:00 AM IST" value={time} onChange={e => setTime(e.target.value)} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <Input label="Capacity" placeholder={eventType === "hackathon" ? "e.g. 300 hackers · 60 teams" : "e.g. 80 seats"} value={capacity} onChange={e => setCapacity(e.target.value)} />
                  <Input label="Registration deadline" placeholder="e.g. Jul 25 2026" value={deadline} onChange={e => setDeadline(e.target.value)} />
                  <Input label="Registration link (external)" placeholder="https://devfolio.co/..." value={registrationLink} onChange={e => setRegistrationLink(e.target.value)} />
                </div>
                <TextArea label="Description" required rows={4} placeholder="Use a blank line between paragraphs." value={description} onChange={e => setDescription(e.target.value)} />
              </div>

              {/* ── VENUE IMAGES ── */}
              <SectionLabel>Venue photos</SectionLabel>
              <p style={{ fontFamily: FONT, fontSize: 12, color: "rgba(255,255,255,0.3)", marginBottom: 16, marginTop: -12 }}>Two images shown side-by-side on the event page.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <ImageUpload label="Venue photo 1" value={venueImage1} onChange={setVenueImage1} placeholder="https://… venue photo" previewHeight={140} />
                <ImageUpload label="Venue photo 2" value={venueImage2} onChange={setVenueImage2} placeholder="https://… venue photo" previewHeight={140} />
              </div>

              {/* ── HACKATHON ONLY ── */}
              {eventType === "hackathon" && (
                <>
                  {/* Problem statement */}
                  <SectionLabel>Problem statement</SectionLabel>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 20 }}>
                    <Input label="Theme" placeholder="e.g. Infra for the Next Billion" value={theme} onChange={e => setTheme(e.target.value)} />
                    <ImageUpload label="Theme / hero image" value={themeImage} onChange={setThemeImage} placeholder="https://… theme banner" previewHeight={160} />
                    <TextArea label="Overview" rows={4} placeholder="Use a blank line between paragraphs." value={overview} onChange={e => setOverview(e.target.value)} />
                  </div>

                  <Label>Tracks</Label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 8 }}>
                    {tracks.map((track, i) => (
                      <Card key={i}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                          <span style={{ fontFamily: FONT, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,0,0.45)" }}>Track {i + 1}</span>
                          {tracks.length > 1 && <SmallBtn danger onClick={() => removeTrack(i)}>Remove</SmallBtn>}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          <input placeholder="Track name, e.g. FinTech" value={track.name} onChange={setTrackField(i, "name")} style={{ ...fieldBase, fontSize: 13 }} {...focusHandlers} />
                          <input placeholder="Short description" value={track.desc} onChange={setTrackField(i, "desc")} style={{ ...fieldBase, fontSize: 13 }} {...focusHandlers} />
                        </div>
                      </Card>
                    ))}
                  </div>
                  <SmallBtn onClick={addTrack}>+ Add track</SmallBtn>
                </>
              )}

              {/* ── TIMELINE ── */}
              <SectionLabel>Schedule / timeline</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 8 }}>
                {timeline.map((item, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "140px 1fr 36px", gap: 10, alignItems: "center" }}>
                    <input placeholder="Sat 10:00 AM" value={item.time} onChange={setTimelineField(i, "time")} style={{ ...fieldBase, fontSize: 13 }} {...focusHandlers} />
                    <input placeholder="What happens" value={item.label} onChange={setTimelineField(i, "label")} style={{ ...fieldBase, fontSize: 13 }} {...focusHandlers} />
                    {timeline.length > 1 && (
                      <button type="button" onClick={() => removeTimelineItem(i)} style={{ background: "none", border: "1px solid rgba(255,120,120,0.25)", borderRadius: 8, color: "rgba(255,120,120,0.7)", height: 40, cursor: "pointer" }}>×</button>
                    )}
                  </div>
                ))}
              </div>
              <SmallBtn onClick={addTimelineItem}>+ Add timeline item</SmallBtn>

              {/* ── PRIZES (hackathon) ── */}
              {eventType === "hackathon" && (
                <>
                  <SectionLabel>Prizes & awards</SectionLabel>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 8 }}>
                    {prizes.map((prize, i) => (
                      <Card key={i}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                          <span style={{ fontFamily: FONT, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,0,0.45)" }}>Prize {i + 1}</span>
                          {prizes.length > 1 && <SmallBtn danger onClick={() => removePrize(i)}>Remove</SmallBtn>}
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "70px 1fr 120px", gap: 10, marginBottom: 10 }}>
                          <input placeholder="01" value={prize.place} onChange={setPrizeField(i, "place")} style={{ ...fieldBase, fontSize: 13, textAlign: "center" }} {...focusHandlers} />
                          <input placeholder="Label, e.g. Grand Prize" value={prize.label} onChange={setPrizeField(i, "label")} style={{ ...fieldBase, fontSize: 13 }} {...focusHandlers} />
                          <input placeholder="₹1,50,000" value={prize.amount} onChange={setPrizeField(i, "amount")} style={{ ...fieldBase, fontSize: 13 }} {...focusHandlers} />
                        </div>
                        <Label>Perks</Label>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {prize.perks.map((perk, j) => (
                            <div key={j} style={{ display: "grid", gridTemplateColumns: "1fr 32px", gap: 8 }}>
                              <input placeholder="e.g. AWS credits ₹5L" value={perk} onChange={setPerk(i, j)} style={{ ...fieldBase, fontSize: 13 }} {...focusHandlers} />
                              {prize.perks.length > 1 && (
                                <button type="button" onClick={() => removePerk(i, j)} style={{ background: "none", border: "1px solid rgba(255,120,120,0.25)", borderRadius: 8, color: "rgba(255,120,120,0.7)", cursor: "pointer" }}>×</button>
                              )}
                            </div>
                          ))}
                        </div>
                        <div style={{ marginTop: 8 }}><SmallBtn onClick={() => addPerk(i)}>+ Add perk</SmallBtn></div>
                      </Card>
                    ))}
                  </div>
                  <SmallBtn onClick={addPrize}>+ Add prize</SmallBtn>
                </>
              )}

              {/* ── JUDGES (hackathon) ── */}
              {eventType === "hackathon" && (
                <>
                  <SectionLabel>Judges <span style={{ fontFamily: FONT, fontSize: 10, fontWeight: 400, letterSpacing: "0.08em", color: "rgba(255,255,255,0.25)", textTransform: "none", marginLeft: 6 }}>optional</span></SectionLabel>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 8 }}>
                    {judges.map((judge, i) => (
                      <Card key={i}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                          <span style={{ fontFamily: FONT, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,0,0.45)" }}>Judge {i + 1}</span>
                          {judges.length > 1 && <SmallBtn danger onClick={() => removeJudge(i)}>Remove</SmallBtn>}
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 14 }}>
                          {/* Photo upload */}
                          <ImageUpload label="Photo" value={judge.photo} onChange={val => setJudgePhoto(i, val)} placeholder="https://…" previewHeight={100} previewFit="cover" />
                          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            <input placeholder="Full name *" value={judge.name} onChange={setJudgeField(i, "name")} style={{ ...fieldBase, fontSize: 13 }} {...focusHandlers} />
                            <input placeholder="Title, e.g. CTO" value={judge.title} onChange={setJudgeField(i, "title")} style={{ ...fieldBase, fontSize: 13 }} {...focusHandlers} />
                            <input placeholder="Company / org" value={judge.company} onChange={setJudgeField(i, "company")} style={{ ...fieldBase, fontSize: 13 }} {...focusHandlers} />
                          </div>
                        </div>
                        <div style={{ marginTop: 10 }}>
                          <textarea placeholder="Short bio (optional)" value={judge.bio} onChange={setJudgeField(i, "bio")} rows={2} style={{ ...fieldBase, resize: "vertical", fontSize: 13 }} {...focusHandlers} />
                        </div>
                      </Card>
                    ))}
                  </div>
                  <SmallBtn onClick={addJudge}>+ Add judge</SmallBtn>
                </>
              )}

              {/* ── SPONSORS ── */}
              <SectionLabel>Sponsors</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 8 }}>
                {sponsors.map((sponsor, i) => (
                  <Card key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                      <span style={{ fontFamily: FONT, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,0,0.45)" }}>Sponsor {i + 1}</span>
                      {sponsors.length > 1 && <SmallBtn danger onClick={() => removeSponsor(i)}>Remove</SmallBtn>}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                      <input placeholder="Sponsor name" value={sponsor.name} onChange={setSponsorField(i, "name")} style={{ ...fieldBase, fontSize: 13 }} {...focusHandlers} />
                      <input placeholder="Tier, e.g. Title Sponsor" value={sponsor.tier} onChange={setSponsorField(i, "tier")} style={{ ...fieldBase, fontSize: 13 }} {...focusHandlers} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      <ImageUpload label="Logo" value={sponsor.logo} onChange={val => setSponsorImage(i, val)} placeholder="https://… logo" previewHeight={70} previewFit="contain" />
                      <input placeholder="Website URL (optional)" value={sponsor.url} onChange={setSponsorField(i, "url")} style={{ ...fieldBase, fontSize: 13 }} {...focusHandlers} />
                    </div>
                  </Card>
                ))}
              </div>
              <SmallBtn onClick={addSponsor}>+ Add sponsor</SmallBtn>

              {/* ── FAQ (hackathon) ── */}
              {eventType === "hackathon" && (
                <>
                  <SectionLabel>FAQ <span style={{ fontFamily: FONT, fontSize: 10, fontWeight: 400, letterSpacing: "0.08em", color: "rgba(255,255,255,0.25)", textTransform: "none", marginLeft: 6 }}>optional</span></SectionLabel>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 8 }}>
                    {faqs.map((faq, i) => (
                      <Card key={i}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                          <span style={{ fontFamily: FONT, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,0,0.45)" }}>Q{i + 1}</span>
                          {faqs.length > 1 && <SmallBtn danger onClick={() => removeFaq(i)}>Remove</SmallBtn>}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          <input placeholder="Question, e.g. Can I participate solo?" value={faq.question} onChange={setFaqField(i, "question")} style={{ ...fieldBase, fontSize: 13 }} {...focusHandlers} />
                          <textarea placeholder="Answer" value={faq.answer} onChange={setFaqField(i, "answer")} rows={2} style={{ ...fieldBase, resize: "vertical", fontSize: 13 }} {...focusHandlers} />
                        </div>
                      </Card>
                    ))}
                  </div>
                  <SmallBtn onClick={addFaq}>+ Add FAQ</SmallBtn>
                </>
              )}

              {/* ── CONTACT ── */}
              <SectionLabel>Contact & community</SectionLabel>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Input label="Email" placeholder="hello@hackthecore.dev" value={contact.email} onChange={e => setContact(c => ({ ...c, email: e.target.value }))} />
                <Input label="Twitter / X" placeholder="@hackthecore" value={contact.twitter} onChange={e => setContact(c => ({ ...c, twitter: e.target.value }))} />
                <Input label="Discord" placeholder="discord.gg/htc" value={contact.discord} onChange={e => setContact(c => ({ ...c, discord: e.target.value }))} />
                <Input label="WhatsApp" placeholder="Link sent on registration" value={contact.whatsapp} onChange={e => setContact(c => ({ ...c, whatsapp: e.target.value }))} />
              </div>

              {error && (
                <p style={{ fontFamily: FONT, fontSize: 13, color: "#ff6b6b", background: "rgba(255,100,100,0.08)", border: "1px solid rgba(255,100,100,0.2)", borderRadius: 8, padding: "12px 16px", marginTop: 24 }}>
                  {error}
                </p>
              )}

              <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 40, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                <motion.button
                  type="submit" disabled={submitting}
                  whileHover={{ scale: submitting ? 1 : 1.02 }} whileTap={{ scale: submitting ? 1 : 0.98 }}
                  style={{ background: submitting ? "rgba(255,255,0,0.5)" : "#FFFF00", color: "#0C0C0D", border: "none", borderRadius: 10, padding: "14px 36px", fontFamily: FONT, fontWeight: 900, fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", cursor: submitting ? "not-allowed" : "pointer" }}
                >
                  {submitting ? "Publishing…" : "Publish event →"}
                </motion.button>
                <button type="button" onClick={() => setStep("pick-type")} style={{ fontFamily: FONT, fontSize: 12, color: "rgba(255,255,255,0.3)", background: "none", border: "none", cursor: "pointer" }}>
                  ← Change event type
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
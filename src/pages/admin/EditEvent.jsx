import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const FONT = "Barlow, sans-serif";
const ease = [0.22, 1, 0.36, 1];
const API = "http://localhost:4000";

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${sessionStorage.getItem("htc_admin_token")}`,
});

/* ── shared field primitives ── */
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

/* empty row structures */
const emptyTimelineItem = () => ({ time: "", label: "" });
const emptyTrack         = () => ({ name: "", desc: "" });
const emptyPrize          = () => ({ place: "", label: "", amount: "", perks: [""] });

export default function EditEvent() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [eventType, setEventType] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  /* fields state */
  const [title, setTitle]   = useState("");
  const [banner, setBanner] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [venue, setVenue]   = useState("");
  const [city, setCity]     = useState("");
  const [date, setDate]     = useState("");
  const [time, setTime]     = useState("");
  const [capacity, setCapacity] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [timeline, setTimeline] = useState([emptyTimelineItem()]);
  const [contact, setContact] = useState({ email: "", twitter: "", discord: "", whatsapp: "" });

  /* hackathon-only fields */
  const [edition, setEdition] = useState("");
  const [theme, setTheme] = useState("");
  const [overview, setOverview] = useState("");
  const [tracks, setTracks] = useState([emptyTrack()]);
  const [prizes, setPrizes] = useState([emptyPrize()]);

  /* Fetch current event details */
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`${API}/api/events/${id}`);
        if (!res.ok) throw new Error("Event not found");
        const data = await res.json();
        
        setTitle(data.title || "");
        setBanner(data.banner || "");
        setThumbnail(data.thumbnail || "");
        setVenue(data.venue || "");
        setCity(data.city || "");
        setDate(data.date || "");
        setTime(data.time || "");
        setCapacity(data.capacity || "");
        setDeadline(data.registrationDeadline || "");
        setDescription(data.description || "");
        setTimeline(data.timeline && data.timeline.length > 0 ? data.timeline : [emptyTimelineItem()]);
        setContact(data.contact || { email: "", twitter: "", discord: "", whatsapp: "" });
        setEventType(data.eventType);
        
        if (data.eventType === "hackathon") {
          setEdition(data.edition || "");
          setTheme(data.problemStatement?.theme || "");
          setOverview(data.problemStatement?.overview || "");
          setTracks(data.problemStatement?.tracks && data.problemStatement?.tracks.length > 0 ? data.problemStatement?.tracks : [emptyTrack()]);
          setPrizes(data.prizes && data.prizes.length > 0 ? data.prizes.map(p => ({
            ...p,
            perks: p.perks && p.perks.length > 0 ? p.perks : [""]
          })) : [emptyPrize()]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingEvent(false);
      }
    };
    fetchEvent();
  }, [id]);

  /* timeline handlers */
  const addTimelineItem = () => setTimeline(t => [...t, emptyTimelineItem()]);
  const removeTimelineItem = (i) => setTimeline(t => t.filter((_, idx) => idx !== i));
  const setTimelineField = (i, key) => (e) => setTimeline(t => t.map((row, idx) => idx === i ? { ...row, [key]: e.target.value } : row));

  /* track handlers */
  const addTrack = () => setTracks(t => [...t, emptyTrack()]);
  const removeTrack = (i) => setTracks(t => t.filter((_, idx) => idx !== i));
  const setTrackField = (i, key) => (e) => setTracks(t => t.map((row, idx) => idx === i ? { ...row, [key]: e.target.value } : row));

  /* prize handlers */
  const addPrize = () => setPrizes(p => [...p, emptyPrize()]);
  const removePrize = (i) => setPrizes(p => p.filter((_, idx) => idx !== i));
  const setPrizeField = (i, key) => (e) => setPrizes(p => p.map((row, idx) => idx === i ? { ...row, [key]: e.target.value } : row));
  const addPerk = (i) => setPrizes(p => p.map((row, idx) => idx === i ? { ...row, perks: [...row.perks, ""] } : row));
  const setPerk = (i, j) => (e) => setPrizes(p => p.map((row, idx) => idx === i ? { ...row, perks: row.perks.map((perk, pj) => pj === j ? e.target.value : perk) } : row));
  const removePerk = (i, j) => setPrizes(p => p.map((row, idx) => idx === i ? { ...row, perks: row.perks.filter((_, pj) => pj !== j) } : row));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const payload = {
      eventType,
      title, banner, thumbnail, venue, city, date, time,
      capacity, registrationDeadline: deadline,
      description,
      timeline: timeline.filter(t => t.time && t.label),
      contact,
      ...(eventType === "hackathon" && {
        edition,
        problemStatement: {
          theme, overview,
          tracks: tracks.filter(t => t.name),
        },
        prizes: prizes
          .filter(p => p.label)
          .map(p => ({ ...p, perks: p.perks.filter(Boolean) })),
      }),
    };

    try {
      const res = await fetch(`${API}/api/events/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update event.");
      }
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingEvent) return (
    <div style={{ background: "#0C0C0D", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ fontFamily: FONT, color: "rgba(255,255,255,0.3)", fontSize: 14, letterSpacing: "0.2em", textTransform: "uppercase" }}>Loading event data…</p>
    </div>
  );

  return (
    <div style={{ background: "#0C0C0D", minHeight: "100vh", color: "#fff" }}>
      {/* Top bar */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, position: "sticky", top: 0, background: "#0C0C0D", zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: "1.1rem", textTransform: "uppercase", letterSpacing: "-0.02em" }}>HackTheCore</span>
          <span style={{ fontFamily: FONT, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,0,0.6)", background: "rgba(255,255,0,0.07)", border: "1px solid rgba(255,255,0,0.2)", borderRadius: 99, padding: "3px 10px" }}>Admin</span>
        </div>
        <button
          onClick={() => navigate("/admin/dashboard")}
          style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "7px 16px", cursor: "pointer" }}
        >
          ← Back to dashboard
        </button>
      </div>

      <div style={{ maxWidth: 880, margin: "0 auto", padding: "48px 40px 120px" }}>
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <h1 style={{ fontFamily: FONT, fontWeight: 900, fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", textTransform: "uppercase", letterSpacing: "-0.04em", margin: 0 }}>
              Edit {eventType}
            </h1>
          </div>
          <p style={{ fontFamily: FONT, fontSize: 13, color: "rgba(255,255,255,0.3)", marginBottom: 8 }}>
            Update event information in MongoDB.
          </p>

          {/* Basics */}
          <SectionLabel>Basics</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Input label="Event title" required placeholder="e.g. 48H Hackathon" value={title} onChange={e => setTitle(e.target.value)} />
            {eventType === "hackathon" && (
              <Input label="Edition / co-host tag" placeholder="e.g. HTC × BuildFast" value={edition} onChange={e => setEdition(e.target.value)} />
            )}
            <Input label="Banner image URL" required placeholder="https://..." value={banner} onChange={e => setBanner(e.target.value)} />
            {banner && (
              <div style={{ borderRadius: 12, overflow: "hidden", height: 160, border: "1px solid rgba(255,255,255,0.08)" }}>
                <img src={banner} alt="Banner preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display = "none"} />
              </div>
            )}
            <Input label="Thumbnail image URL (optional)" placeholder="https://... (for event cards)" value={thumbnail} onChange={e => setThumbnail(e.target.value)} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Input label="Venue" required placeholder="e.g. NSRCEL, IIM Bangalore" value={venue} onChange={e => setVenue(e.target.value)} />
              <Input label="City" required placeholder="e.g. Bengaluru" value={city} onChange={e => setCity(e.target.value)} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Input label="Date" required placeholder="e.g. Sat–Sun, Aug 2–3 2026" value={date} onChange={e => setDate(e.target.value)} />
              <Input label="Time" required placeholder="e.g. Starts 10:00 AM IST" value={time} onChange={e => setTime(e.target.value)} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Input label="Capacity" placeholder={eventType === "hackathon" ? "e.g. 300 hackers · 60 teams" : "e.g. 80 seats"} value={capacity} onChange={e => setCapacity(e.target.value)} />
              <Input label="Registration deadline" placeholder="e.g. Jul 25 2026" value={deadline} onChange={e => setDeadline(e.target.value)} />
            </div>
            <TextArea label="Description" required rows={4} placeholder="Use a blank line between paragraphs." value={description} onChange={e => setDescription(e.target.value)} />
          </div>

          {/* PROBLEM STATEMENT (hackathon only) */}
          {eventType === "hackathon" && (
            <>
              <SectionLabel>Problem statement</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 20 }}>
                <Input label="Theme" placeholder="e.g. Infra for the Next Billion" value={theme} onChange={e => setTheme(e.target.value)} />
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

          {/* TIMELINE (both) */}
          <SectionLabel>Schedule / timeline</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 8 }}>
            {timeline.map((item, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "140px 1fr 36px", gap: 10, alignItems: "center" }}>
                <input placeholder="Time, e.g. Sat 10:00 AM" value={item.time} onChange={setTimelineField(i, "time")} style={{ ...fieldBase, fontSize: 13 }} {...focusHandlers} />
                <input placeholder="What happens" value={item.label} onChange={setTimelineField(i, "label")} style={{ ...fieldBase, fontSize: 13 }} {...focusHandlers} />
                {timeline.length > 1 && (
                  <button type="button" onClick={() => removeTimelineItem(i)} style={{ background: "none", border: "1px solid rgba(255,120,120,0.25)", borderRadius: 8, color: "rgba(255,120,120,0.7)", height: 40, cursor: "pointer" }}>×</button>
                )}
              </div>
            ))}
          </div>
          <SmallBtn onClick={addTimelineItem}>+ Add timeline item</SmallBtn>

          {/* PRIZES (hackathon only) */}
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
                    <div style={{ marginTop: 8 }}>
                      <SmallBtn onClick={() => addPerk(i)}>+ Add perk</SmallBtn>
                    </div>
                  </Card>
                ))}
              </div>
              <SmallBtn onClick={addPrize}>+ Add prize</SmallBtn>
            </>
          )}

          {/* CONTACT (both) */}
          <SectionLabel>Contact & community</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Input label="Email" placeholder="hello@hackthecore.dev" value={contact.email} onChange={e => setContact(c => ({ ...c, email: e.target.value }))} />
            <Input label="Twitter / X" placeholder="@hackthecore" value={contact.twitter} onChange={e => setContact(c => ({ ...c, twitter: e.target.value }))} />
            <Input label="Discord" placeholder="discord.gg/htc" value={contact.discord} onChange={e => setContact(c => ({ ...c, discord: e.target.value }))} />
            <Input label="WhatsApp" placeholder="Link sent on registration" value={contact.whatsapp} onChange={e => setContact(c => ({ ...c, whatsapp: e.target.value }))} />
          </div>

          {/* Error message */}
          {error && (
            <p style={{ fontFamily: FONT, fontSize: 13, color: "#ff6b6b", background: "rgba(255,100,100,0.08)", border: "1px solid rgba(255,100,100,0.2)", borderRadius: 8, padding: "12px 16px", marginTop: 24 }}>
              {error}
            </p>
          )}

          {/* Submit buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 40, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: submitting ? 1 : 1.02 }}
              whileTap={{ scale: submitting ? 1 : 0.98 }}
              style={{ background: submitting ? "rgba(255,255,0,0.5)" : "#FFFF00", color: "#0C0C0D", border: "none", borderRadius: 10, padding: "14px 36px", fontFamily: FONT, fontWeight: 900, fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", cursor: submitting ? "not-allowed" : "pointer" }}
            >
              {submitting ? "Saving changes…" : "Save changes →"}
            </motion.button>
            <button type="button" onClick={() => navigate("/admin/dashboard")} style={{ fontFamily: FONT, fontSize: 12, color: "rgba(255,255,255,0.3)", background: "none", border: "none", cursor: "pointer" }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const ease = [0.22, 1, 0.36, 1];
const FONT = "Barlow, sans-serif";
const API  = `${import.meta.env.VITE_API_URL}`;

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${sessionStorage.getItem("htc_admin_token")}`,
});

// ── Primtive UI Components ─────────────────────────────────
const Pill = ({ children, color = "#FFFF00" }) => (
  <span style={{
    fontFamily: FONT, fontSize: 10, fontWeight: 700,
    letterSpacing: "0.14em", textTransform: "uppercase",
    color, border: `1px solid ${color}40`,
    background: `${color}08`, borderRadius: 99,
    padding: "3px 10px", display: "inline-block",
    whiteSpace: "nowrap"
  }}>
    {children}
  </span>
);

const StatCard = ({ label, value, color = "#FFFF00" }) => (
  <div style={{
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 16, padding: "20px 24px",
    display: "flex", flexDirection: "column", gap: 6,
    position: "relative", overflow: "hidden", flex: 1
  }}>
    <div style={{ position: "absolute", top: 0, left: 0, width: 4, height: "100%", background: color }} />
    <p style={{ fontFamily: FONT, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", margin: 0 }}>{label}</p>
    <h3 style={{ fontFamily: FONT, fontWeight: 900, fontSize: "2rem", color: "#fff", letterSpacing: "-0.02em", lineHeight: 1, margin: 0 }}>{value}</h3>
  </div>
);

// ── Shared Table Sub-Components ───────────────────────────
function HackathonTable({ data }) {
  const [expandedId, setExpandedId] = useState(null);
  if (!data.length) return (
    <p style={{ fontFamily: FONT, fontSize: 14, color: "rgba(255,255,255,0.25)", padding: "40px 0", textAlign: "center" }}>No hackathon teams registered yet.</p>
  );
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1.2fr 1fr 1fr 60px", gap: 16, padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.01)" }}>
        {["Team Name", "Track Preference", "Members count", "Date Registered", ""].map(h => (
          <span key={h} style={{ fontFamily: FONT, fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>{h}</span>
        ))}
      </div>
      {data.map((reg) => (
        <div key={reg._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div
            onClick={() => setExpandedId(expandedId === reg._id ? null : reg._id)}
            style={{ display: "grid", gridTemplateColumns: "1.8fr 1.2fr 1fr 1fr 60px", gap: 16, padding: "16px 20px", cursor: "pointer", transition: "background 0.15s", alignItems: "center" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <span style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: "#fff" }}>{reg.teamName}</span>
            <div><Pill color="#FFFF00">{reg.track}</Pill></div>
            <span style={{ fontFamily: FONT, fontSize: 14, color: "rgba(255,255,255,0.6)" }}>{reg.members.length} Hacker{reg.members.length !== 1 ? "s" : ""}</span>
            <span style={{ fontFamily: FONT, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{new Date(reg.submittedAt).toLocaleDateString("en-IN")}</span>
            <span style={{
              fontFamily: FONT, fontSize: 14, color: "rgba(255,255,0,0.6)",
              transform: expandedId === reg._id ? "rotate(90deg)" : "none",
              transition: "transform 0.2s", display: "inline-block", textAlign: "center"
            }}>→</span>
          </div>
          <AnimatePresence>
            {expandedId === reg._id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease }}
                style={{ overflow: "hidden", background: "rgba(255,255,0,0.01)", borderTop: "1px solid rgba(255,255,255,0.03)" }}
              >
                <div style={{ padding: "20px 24px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12, marginBottom: 18 }}>
                    {reg.members.map((m, i) => (
                      <div key={i} style={{ display: "flex", flexDirection: "column", gap: 8, padding: "14px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontFamily: FONT, fontSize: 9, fontWeight: 700, color: i === 0 ? "#FFFF00" : "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                            {i === 0 ? "★ Team Lead" : `Hacker ${i + 1}`}
                          </span>
                          <Pill color="rgba(255,255,255,0.45)">{m.role || "Developer"}</Pill>
                        </div>
                        <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: "#fff" }}>{m.name}</span>
                        <span style={{ fontFamily: FONT, fontSize: 12, color: "rgba(255,255,255,0.4)", wordBreak: "break-all" }}>{m.email}</span>
                        {m.github && (
                          <a href={`https://github.com/${m.github}`} target="_blank" rel="noreferrer" style={{ fontFamily: FONT, fontSize: 12, color: "#FFFF00", textDecoration: "none", marginTop: 4, display: "inline-flex", alignItems: "center", gap: 4 }}>
                            github.com/{m.github} ↗
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                  {reg.idea && (
                    <div style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 10, padding: 14 }}>
                      <p style={{ fontFamily: FONT, fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", margin: "0 0 6px 0" }}>Project Concept</p>
                      <p style={{ fontFamily: FONT, fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.6, margin: 0 }}>{reg.idea}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

function MeetupTable({ data }) {
  if (!data.length) return (
    <p style={{ fontFamily: FONT, fontSize: 14, color: "rgba(255,255,255,0.25)", padding: "40px 0", textAlign: "center" }}>No meetup RSVPs registered yet.</p>
  );
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1.8fr 1fr 1fr 1fr", gap: 16, padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.01)" }}>
        {["Name", "Email Address", "Phone", "Exp. Level", "Date RSVP'd"].map(h => (
          <span key={h} style={{ fontFamily: FONT, fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>{h}</span>
        ))}
      </div>
      {data.map((reg) => (
        <div
          key={reg._id}
          style={{ display: "grid", gridTemplateColumns: "1.8fr 1.8fr 1fr 1fr 1fr", gap: 16, padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)", alignItems: "center" }}
        >
          <span style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: "#fff" }}>{reg.name}</span>
          <span style={{ fontFamily: FONT, fontSize: 14, color: "rgba(255,255,255,0.6)", wordBreak: "break-all" }}>{reg.email}</span>
          <span style={{ fontFamily: FONT, fontSize: 14, color: "rgba(255,255,255,0.5)" }}>{reg.phone || "—"}</span>
          <div>
            <Pill color={reg.experience === "advanced" ? "#FFFF00" : reg.experience === "intermediate" ? "#00FFFF" : "#FF00FF"}>
              {reg.experience || "beginner"}
            </Pill>
          </div>
          <span style={{ fontFamily: FONT, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{new Date(reg.submittedAt).toLocaleDateString("en-IN")}</span>
        </div>
      ))}
    </div>
  );
}

// ── Main Dashboard Panel ──────────────────────────────────
export default function AdminDashboard() {
  const [events, setEvents]                 = useState([]);
  const [hackathons, setHackathons]         = useState([]);
  const [meetups, setMeetups]               = useState([]);
  const [bookings, setBookings]             = useState([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState("");
  const [portalTab, setPortalTab]           = useState("events"); // "events" or "bookings"

  /* Selection states for event specific dashboard */
  const [selectedEvent, setSelectedEvent]   = useState(null);
  const [activeTab, setActiveTab]           = useState("Overview"); // Sidebar tabs

  /* Mock data states (initialized/resets per event) */
  const [sponsors, setSponsors]             = useState([]);
  const [faqs, setFaqs]                     = useState([]);
  const [announcements, setAnnouncements]   = useState([]);
  const [submissions, setSubmissions]       = useState([]);
  const [judges, setJudges]                 = useState([]);
  const [problems, setProblems]             = useState([]);
  const [integrations, setIntegrations]     = useState({ discordWebhook: "", googleSheetSync: false });

  /* Form states */
  const [newSponsor, setNewSponsor]         = useState({ name: "", logo: "", site: "", tier: "Gold" });
  const [newFaq, setNewFaq]                 = useState({ q: "", a: "" });
  const [newAnnouncement, setNewAnnouncement] = useState({ title: "", content: "", channels: { email: true, discord: false } });
  const [newJudge, setNewJudge]             = useState({ name: "", email: "", org: "" });
  const [newProblem, setNewProblem]         = useState({ title: "", desc: "", link: "" });

  const navigate = useNavigate();

  const logout = () => {
    sessionStorage.removeItem("htc_admin_token");
    navigate("/admin/login", { replace: true });
  };

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [eRes, hRes, mRes, bRes] = await Promise.all([
        fetch(`${API}/api/events`),
        fetch(`${API}/api/admin/registrations/hackathon`, { headers: authHeaders() }),
        fetch(`${API}/api/admin/registrations/meetup`,    { headers: authHeaders() }),
        fetch(`${API}/api/partnerships/admin/list`,       { headers: authHeaders() }),
      ]);

      if (hRes.status === 401 || mRes.status === 401 || bRes.status === 401) {
        sessionStorage.removeItem("htc_admin_token");
        navigate("/admin/login", { replace: true });
        return;
      }

      const [eData, hData, mData, bData] = await Promise.all([
        eRes.json(),
        hRes.json(),
        mRes.json(),
        bRes.json(),
      ]);
      setEvents(eData);
      setHackathons(hData);
      setMeetups(mData);
      setBookings(bData);
    } catch {
      setError("Failed to sync records. Check server connection.");
    } finally {
      setLoading(false);
    }
  };

  const toggleCallDone = async (bookingId) => {
    try {
      const res = await fetch(`${API}/api/partnerships/admin/${bookingId}/toggle-call`, {
        method: "PATCH",
        headers: authHeaders(),
      });
      if (!res.ok) {
        throw new Error("Failed to update status.");
      }
      const updated = await res.json();
      setBookings(prev => prev.map(b => b._id === bookingId ? updated : b));
    } catch (err) {
      alert(err.message || "Failed to update call status.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* Load Mock Event-Specific details when selectedEvent changes */
  useEffect(() => {
    if (selectedEvent) {
      // Mock Event specific Sponsors
      setSponsors([
        { id: 1, name: "Google Cloud", logo: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?q=80&w=200&fit=crop", site: "cloud.google.com", tier: "Gold" },
        { id: 2, name: "GitHub", logo: "https://images.unsplash.com/photo-1618401471353-b98aedd07871?q=80&w=200&fit=crop", site: "github.com", tier: "Gold" },
        { id: 3, name: "Devfolio", logo: "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?q=80&w=200&fit=crop", site: "devfolio.co", tier: "Silver" },
      ]);

      // Mock Event specific FAQs
      setFaqs([
        { id: 1, q: "Who can participate?", a: "Students, working professionals, and beginners are all welcome to register!" },
        { id: 2, q: "What is the team size?", a: "For hackathons, teams can range from 1 to 4 members." },
      ]);

      // Mock Event specific Announcements
      setAnnouncements([
        { id: 1, title: "Registrations Opened!", content: "Get ready and lock in your tracks by registering today.", sentAt: new Date(Date.now() - 86400000).toLocaleString() },
        { id: 2, title: "Problem Statement Release Schedule", content: "Guidelines will be published on the portal 1 hour before hacking begins.", sentAt: new Date(Date.now() - 43200000).toLocaleString() },
      ]);

      // Mock Event specific Submissions
      setSubmissions([
        { id: 1, team: "Null Pointers", title: "EcoSync", desc: "AI powered carbon offset optimizer.", repo: "github.com/nullpointers/ecosync", demo: "youtube.com/watch?v=mock", score: 88, status: "Under Review" },
        { id: 2, team: "Core Hackers", title: "AgriFlow", desc: "IoT sensor grid diagnostics for precision crop irrigation.", repo: "github.com/corehackers/agriflow", demo: "agriflow.vercel.app", score: 92, status: "Approved" },
      ]);

      // Mock Event specific Judges
      setJudges([
        { id: 1, name: "Dr. Anirudh Sen", email: "anirudh@iimb.ac.in", org: "IIM Bangalore" },
        { id: 2, name: "Prerna Mehta", email: "prerna@github.com", org: "GitHub India" },
      ]);

      // Mock Event specific Problems
      setProblems([
        { id: 1, title: "Theme: Financial Inclusion", desc: "Build offline-first micro-credit protocols for rural farmers.", link: "https://drive.google.com/mock-statement-pdf" },
      ]);

      setIntegrations({ discordWebhook: "https://discord.com/api/webhooks/mock-webhook-id", googleSheetSync: true });
    }
  }, [selectedEvent]);

  const deleteEvent = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const res = await fetch(`${API}/api/events/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete event.");
      }
      setSelectedEvent(null);
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const getEventRegs = (ev) => {
    if (!ev) return [];
    return ev.eventType === "hackathon"
      ? hackathons.filter(h => h.eventId === ev._id)
      : meetups.filter(m => m.eventId === ev._id);
  };

  // Helper selectors
  const totalRegistrations = hackathons.length + meetups.length;
  const eventRegs = getEventRegs(selectedEvent);

  return (
    <div style={{ background: "#0C0C0D", minHeight: "100vh", color: "#fff", display: "flex", flexDirection: "column" }}>

      {/* ── Dynamic Layout Switch: Overall Dashboard vs Event Specific Dashboard ── */}
      {!selectedEvent ? (
        // ═══ SECTION A: PORTAL-WIDE OVERALL DASHBOARD ═══
        <>
          <header style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 40px", display: "flex", alignItems: "center", justifyHeight: "flex-end", justifyContent: "space-between", height: 64, position: "sticky", top: 0, background: "#0C0C0D", zIndex: 100 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: "1.1rem", textTransform: "uppercase", letterSpacing: "-0.02em", color: "#fff" }}>HackTheCore</span>
              <span style={{ fontFamily: FONT, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,0,0.6)", background: "rgba(255,255,0,0.07)", border: "1px solid rgba(255,255,0,0.2)", borderRadius: 99, padding: "3px 10px" }}>Admin Portal</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <button
                onClick={() => navigate("/admin/create-event")}
                style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#0C0C0D", background: "#FFFF00", border: "none", borderRadius: 8, padding: "8px 18px", cursor: "pointer" }}
              >
                + Create Event
              </button>
              <button onClick={fetchData} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 16px", cursor: "pointer" }}>
                ↻ Sync
              </button>
              <button onClick={logout} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#ff6b6b", background: "none", border: "1px solid rgba(255,100,100,0.25)", borderRadius: 8, padding: "8px 16px", cursor: "pointer" }}>
                Sign out
              </button>
            </div>
          </header>

          <main style={{ maxWidth: 1200, width: "100%", margin: "0 auto", padding: "48px 40px 100px", boxSizing: "border-box" }}>
            
            {/* Tab navigation */}
            <div style={{ display: "flex", gap: 24, borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: 36 }}>
              <button
                onClick={() => setPortalTab("events")}
                style={{
                  fontFamily: FONT, fontSize: 14, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                  background: "none", border: "none", borderBottom: portalTab === "events" ? "2px solid #FFFF00" : "2px solid transparent",
                  color: portalTab === "events" ? "#FFFF00" : "rgba(255,255,255,0.4)",
                  padding: "12px 4px", cursor: "pointer", transition: "all 0.2s"
                }}
              >
                Events Hub
              </button>
              <button
                onClick={() => setPortalTab("bookings")}
                style={{
                  fontFamily: FONT, fontSize: 14, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                  background: "none", border: "none", borderBottom: portalTab === "bookings" ? "2px solid #FFFF00" : "2px solid transparent",
                  color: portalTab === "bookings" ? "#FFFF00" : "rgba(255,255,255,0.4)",
                  padding: "12px 4px", cursor: "pointer", transition: "all 0.2s"
                }}
              >
                Partnership Bookings
              </button>
            </div>

            {portalTab === "events" ? (
              <>
                <div style={{ marginBottom: 44 }}>
                  <h1 style={{ fontFamily: FONT, fontWeight: 900, fontSize: "clamp(2rem, 5vw, 3.5rem)", textTransform: "uppercase", letterSpacing: "-0.04em", lineHeight: 0.9, color: "#fff", margin: "0 0 10px" }}>
                    Events Hub
                  </h1>
                  <p style={{ fontFamily: FONT, fontSize: 14, color: "rgba(255,255,255,0.35)", margin: 0 }}>
                    Select a listed program below to manage its specific timeline, submissions, certificates, and leaderboard.
                  </p>
                </div>

                <section style={{ display: "flex", gap: 16, marginBottom: 48 }}>
                  <StatCard label="Total Listed Events" value={events.length} color="#FFFF00" />
                  <StatCard label="Active Hackathons" value={events.filter(e => e.eventType === "hackathon").length} color="#FFFF00" />
                  <StatCard label="Programmed Meetups" value={events.filter(e => e.eventType === "meetup").length} color="#00FFFF" />
                  <StatCard label="Portal-wide Registrations" value={totalRegistrations} color="#FF00FF" />
                </section>

                {loading ? (
                  <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "80px 0", textAlign: "center" }}>
                    <span style={{ fontFamily: FONT, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)" }}>Loading events...</span>
                  </div>
                ) : (
                  <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "80px 2.5fr 1fr 1.5fr 1fr 1.2fr", gap: 16, padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.01)" }}>
                      {["", "Event Info", "Type", "Schedule", "Entries", "Actions"].map(h => (
                        <span key={h} style={{ fontFamily: FONT, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>{h}</span>
                      ))}
                    </div>
                    {!events.length ? (
                      <p style={{ fontFamily: FONT, fontSize: 14, color: "rgba(255,255,255,0.25)", padding: "60px 0", textAlign: "center" }}>No events stored. Get started by publishing one!</p>
                    ) : (
                      events.map(event => (
                        <div
                          key={event._id}
                          style={{ display: "grid", gridTemplateColumns: "80px 2.5fr 1fr 1.5fr 1fr 1.2fr", gap: 16, padding: "18px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)", alignItems: "center" }}
                        >
                          <div style={{ width: 64, height: 44, borderRadius: 6, overflow: "hidden", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                            <img src={event.thumbnail || event.banner} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                            <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: "#fff" }}>{event.title}</span>
                            {event.edition && <span style={{ fontFamily: FONT, fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{event.edition}</span>}
                          </div>
                          <div>
                            <Pill color={event.eventType === "hackathon" ? "#FFFF00" : "#00FFFF"}>
                              {event.eventType}
                            </Pill>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                            <span style={{ fontFamily: FONT, fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{event.date}</span>
                            <span style={{ fontFamily: FONT, fontSize: 11, color: "rgba(255,255,255,0.35)", textTransform: "uppercase" }}>{event.city}</span>
                          </div>
                          <div>
                            <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: "#FFFF00" }}>{getEventRegs(event).length}</span>
                            <span style={{ fontFamily: FONT, fontSize: 12, color: "rgba(255,255,255,0.35)", marginLeft: 4 }}>RSVPs</span>
                          </div>
                          <div>
                            <button
                              onClick={() => { setSelectedEvent(event); setActiveTab("Overview"); }}
                              style={{
                                fontFamily: FONT, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                                background: "#FFFF00", color: "#0C0C0D", border: "none",
                                borderRadius: 6, padding: "8px 16px", cursor: "pointer", width: "100%", textAlign: "center"
                              }}
                            >
                              Manage Console →
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </>
            ) : (
              // ═══ PARTNERSHIP BOOKINGS VIEW ═══
              <>
                <div style={{ marginBottom: 44 }}>
                  <h1 style={{ fontFamily: FONT, fontWeight: 900, fontSize: "clamp(2rem, 5vw, 3.5rem)", textTransform: "uppercase", letterSpacing: "-0.04em", lineHeight: 0.9, color: "#fff", margin: "0 0 10px" }}>
                    Bookings Hub
                  </h1>
                  <p style={{ fontFamily: FONT, fontSize: 14, color: "rgba(255,255,255,0.35)", margin: 0 }}>
                    Track all partnership submissions from the "Book a Call" contact form, inspect details, and mark off calls when they are completed.
                  </p>
                </div>

                <section style={{ display: "flex", gap: 16, marginBottom: 48 }}>
                  <StatCard label="Total Call Bookings" value={bookings.length} color="#FFFF00" />
                  <StatCard label="Completed Calls" value={bookings.filter(b => b.callDone).length} color="#4CAF50" />
                  <StatCard label="Pending Calls" value={bookings.filter(b => !b.callDone).length} color="#FF9800" />
                  <StatCard
                    label="Completion Rate"
                    value={bookings.length ? `${Math.round((bookings.filter(b => b.callDone).length / bookings.length) * 100)}%` : "0%"}
                    color="#00FFFF"
                  />
                </section>

                {loading ? (
                  <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "80px 0", textAlign: "center" }}>
                    <span style={{ fontFamily: FONT, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)" }}>Loading bookings...</span>
                  </div>
                ) : (
                  <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1.8fr 1.2fr 1fr 1fr 1fr", gap: 16, padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.01)" }}>
                      {["Name / Org", "Email / Phone", "Partnership Type", "Status", "Date Booked", "Actions"].map(h => (
                        <span key={h} style={{ fontFamily: FONT, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>{h}</span>
                      ))}
                    </div>
                    {!bookings.length ? (
                      <p style={{ fontFamily: FONT, fontSize: 14, color: "rgba(255,255,255,0.25)", padding: "60px 0", textAlign: "center" }}>No calls booked yet.</p>
                    ) : (
                      bookings.map(booking => (
                        <div
                          key={booking._id}
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1.5fr 1.8fr 1.2fr 1fr 1fr 1fr",
                            gap: 16,
                            padding: "18px 20px",
                            borderBottom: "1px solid rgba(255,255,255,0.05)",
                            alignItems: "center",
                            background: booking.callDone ? "rgba(76,175,80,0.01)" : "transparent"
                          }}
                        >
                          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                            <span style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: "#fff" }}>{booking.name}</span>
                            <span style={{ fontFamily: FONT, fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{booking.org || "—"}</span>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                            <span style={{ fontFamily: FONT, fontSize: 14, color: "rgba(255,255,255,0.7)", wordBreak: "break-all" }}>{booking.email}</span>
                            <span style={{ fontFamily: FONT, fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{booking.phone || "—"}</span>
                          </div>
                          <div>
                            <Pill color="#FFFF00">{booking.partnershipType}</Pill>
                          </div>
                          <div>
                            <span style={{
                              fontFamily: FONT, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                              color: booking.callDone ? "#4CAF50" : "#FF9800",
                              background: booking.callDone ? "rgba(76,175,80,0.1)" : "rgba(255,152,0,0.1)",
                              padding: "4px 8px", borderRadius: 4, border: `1px solid ${booking.callDone ? "rgba(76,175,80,0.2)" : "rgba(255,152,0,0.2)"}`
                            }}>
                              {booking.callDone ? "Completed" : "Pending"}
                            </span>
                          </div>
                          <div>
                            <span style={{ fontFamily: FONT, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                              {new Date(booking.submittedAt).toLocaleDateString("en-IN")}
                            </span>
                          </div>
                          <div>
                            <button
                              onClick={() => toggleCallDone(booking._id)}
                              style={{
                                fontFamily: FONT, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                                background: booking.callDone ? "rgba(76,175,80,0.12)" : "rgba(255,255,255,0.02)",
                                color: booking.callDone ? "#4CAF50" : "rgba(255,255,255,0.5)",
                                border: `1px solid ${booking.callDone ? "rgba(76,175,80,0.25)" : "rgba(255,255,255,0.15)"}`,
                                borderRadius: 6, padding: "8px 12px", cursor: "pointer", transition: "all 0.15s", width: "100%", textAlign: "center"
                              }}
                              onMouseEnter={e => {
                                e.currentTarget.style.background = booking.callDone ? "rgba(244,67,54,0.12)" : "rgba(76,175,80,0.2)";
                                e.currentTarget.style.color = booking.callDone ? "#F44336" : "#4CAF50";
                                e.currentTarget.style.borderColor = booking.callDone ? "rgba(244,67,54,0.3)" : "rgba(76,175,80,0.4)";
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.background = booking.callDone ? "rgba(76,175,80,0.12)" : "rgba(255,255,255,0.02)";
                                e.currentTarget.style.color = booking.callDone ? "#4CAF50" : "rgba(255,255,255,0.5)";
                                e.currentTarget.style.borderColor = booking.callDone ? "rgba(76,175,80,0.25)" : "rgba(255,255,255,0.15)";
                              }}
                            >
                              {booking.callDone ? "Mark Pending" : "Mark Done"}
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </>
            )}
          </main>
        </>
      ) : (
        // ═══ SECTION B: EVENT-SPECIFIC DEDICATED CONSOLE ═══
        <div style={{ display: "flex", flex: 1, minHeight: "100vh" }}>
          
          {/* LEFT CONSOLE SIDEBAR */}
          <aside style={{ width: 260, borderRight: "1px solid rgba(255,255,255,0.07)", background: "#080809", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh", overflowY: "auto" }}>
            
            {/* Header info */}
            <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <button
                onClick={() => { setSelectedEvent(null); fetchData(); }}
                style={{ fontFamily: FONT, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: 16, display: "flex", alignItems: "center", gap: 4 }}
              >
                ← Back to Portal
              </button>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6 }}>
                <Pill color={selectedEvent.eventType === "hackathon" ? "#FFFF00" : "#00FFFF"}>{selectedEvent.eventType}</Pill>
              </div>
              <h2 style={{ fontFamily: FONT, fontWeight: 900, fontSize: "1.3rem", textTransform: "uppercase", color: "#fff", margin: 0, letterSpacing: "-0.01em", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                {selectedEvent.title}
              </h2>
            </div>

            {/* Sidebar Navigation Items */}
            <nav style={{ padding: "20px 14px", display: "flex", flexDirection: "column", gap: 24, flex: 1 }}>
              
              {/* Group A: EVENT SETUP */}
              <div>
                <p style={{ fontFamily: FONT, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", paddingLeft: 10, marginBottom: 10 }}>Event Setup</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {["Overview", "Timeline", "Tracks", "Sponsors", "FAQ"].map(tab => (
                    <button
                      key={tab} onClick={() => setActiveTab(tab)}
                      style={{
                        fontFamily: FONT, fontSize: 13, fontWeight: activeTab === tab ? 700 : 500,
                        textAlign: "left", padding: "8px 12px", borderRadius: 8, border: "none", cursor: "pointer",
                        background: activeTab === tab ? "rgba(255,255,0,0.08)" : "transparent",
                        color: activeTab === tab ? "#FFFF00" : "rgba(255,255,255,0.6)",
                        transition: "all 0.15s"
                      }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Group B: PARTICIPANTS */}
              <div>
                <p style={{ fontFamily: FONT, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", paddingLeft: 10, marginBottom: 10 }}>Participants</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {["Registrations", "Problem Statements", "Submissions"].map(tab => {
                    const isHackOnly = ["Problem Statements", "Submissions"].includes(tab);
                    if (isHackOnly && selectedEvent.eventType !== "hackathon") return null;
                    return (
                      <button
                        key={tab} onClick={() => setActiveTab(tab)}
                        style={{
                          fontFamily: FONT, fontSize: 13, fontWeight: activeTab === tab ? 700 : 500,
                          textAlign: "left", padding: "8px 12px", borderRadius: 8, border: "none", cursor: "pointer",
                          background: activeTab === tab ? "rgba(255,255,0,0.08)" : "transparent",
                          color: activeTab === tab ? "#FFFF00" : "rgba(255,255,255,0.6)",
                          transition: "all 0.15s"
                        }}
                      >
                        {tab}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Group C: EVALUATION */}
              {selectedEvent.eventType === "hackathon" && (
                <div>
                  <p style={{ fontFamily: FONT, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", paddingLeft: 10, marginBottom: 10 }}>Evaluation</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {["Judging", "Judges"].map(tab => (
                      <button
                        key={tab} onClick={() => setActiveTab(tab)}
                        style={{
                          fontFamily: FONT, fontSize: 13, fontWeight: activeTab === tab ? 700 : 500,
                          textAlign: "left", padding: "8px 12px", borderRadius: 8, border: "none", cursor: "pointer",
                          background: activeTab === tab ? "rgba(255,255,0,0.08)" : "transparent",
                          color: activeTab === tab ? "#FFFF00" : "rgba(255,255,255,0.6)",
                          transition: "all 0.15s"
                        }}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Group D: OUTCOMES & COMMUNICATIONS */}
              <div>
                <p style={{ fontFamily: FONT, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", paddingLeft: 10, marginBottom: 10 }}>Outcomes & Comm</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {["Announcements", "Certificates", "Prizes"].map(tab => {
                    if (tab === "Prizes" && selectedEvent.eventType !== "hackathon") return null;
                    return (
                      <button
                        key={tab} onClick={() => setActiveTab(tab)}
                        style={{
                          fontFamily: FONT, fontSize: 13, fontWeight: activeTab === tab ? 700 : 500,
                          textAlign: "left", padding: "8px 12px", borderRadius: 8, border: "none", cursor: "pointer",
                          background: activeTab === tab ? "rgba(255,255,0,0.08)" : "transparent",
                          color: activeTab === tab ? "#FFFF00" : "rgba(255,255,255,0.6)",
                          transition: "all 0.15s"
                        }}
                      >
                        {tab}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Group E: INSIGHTS & UTILITIES */}
              <div>
                <p style={{ fontFamily: FONT, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", paddingLeft: 10, marginBottom: 10 }}>Console Tools</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {["Analytics", "Reports", "Integrations", "Settings"].map(tab => (
                    <button
                      key={tab} onClick={() => setActiveTab(tab)}
                      style={{
                        fontFamily: FONT, fontSize: 13, fontWeight: activeTab === tab ? 700 : 500,
                        textAlign: "left", padding: "8px 12px", borderRadius: 8, border: "none", cursor: "pointer",
                        background: activeTab === tab ? "rgba(255,255,0,0.08)" : "transparent",
                        color: activeTab === tab ? "#FFFF00" : "rgba(255,255,255,0.6)",
                        transition: "all 0.15s"
                      }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

            </nav>
            
            {/* User footer */}
            <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: FONT, fontSize: 12, color: "rgba(255,255,255,0.4)" }}>htc_admin</span>
              <button onClick={logout} style={{ fontFamily: FONT, fontSize: 11, color: "#ff6b6b", border: "none", background: "none", cursor: "pointer" }}>Sign Out</button>
            </div>
          </aside>

          {/* MAIN EVENT WORKSPACE */}
          <div style={{ flex: 1, padding: "40px 48px", overflowY: "auto", boxSizing: "border-box" }}>
            
            {/* Header section status */}
            <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", paddingBottom: 24, marginBottom: 36, display: "flex", justifyHeight: "flex-end", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h1 style={{ fontFamily: FONT, fontWeight: 900, fontSize: "2.2rem", textTransform: "uppercase", color: "#fff", margin: "0 0 6px 0", letterSpacing: "-0.03em" }}>
                  {activeTab}
                </h1>
                <p style={{ fontFamily: FONT, fontSize: 13, color: "rgba(255,255,255,0.4)", margin: 0 }}>
                  Event Dashboard / {selectedEvent.title} / {activeTab}
                </p>
              </div>
              
              {/* Event status pill */}
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#FFFF00", animation: "pulse 2s infinite" }} />
                <span style={{ fontFamily: FONT, fontSize: 12, color: "rgba(255,255,255,0.6)" }}>Registrations Active</span>
              </div>
            </div>

            {/* TAB CONTENT PANELS */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease }}
              >
                
                {/* 1. OVERVIEW PANEL */}
                {activeTab === "Overview" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                    
                    {/* Hero Banner preview card */}
                    <div style={{ position: "relative", height: 260, borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
                      <img src={selectedEvent.banner} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(12,12,13,0.95) 0%, rgba(12,12,13,0.3) 100%)" }} />
                      <div style={{ position: "absolute", bottom: 24, left: 28, right: 28, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                        <div>
                          <h2 style={{ fontFamily: FONT, fontWeight: 900, fontSize: "2rem", textTransform: "uppercase", color: "#fff", margin: "0 0 6px 0", letterSpacing: "-0.01em" }}>{selectedEvent.title}</h2>
                          <p style={{ fontFamily: FONT, fontSize: 14, color: "rgba(255,255,255,0.7)", margin: 0 }}>{selectedEvent.venue}, {selectedEvent.city}</p>
                        </div>
                        <button
                          onClick={() => navigate(`/admin/edit-event/${selectedEvent._id}`)}
                          style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", background: "#FFFF00", color: "#0C0C0D", border: "none", borderRadius: 8, padding: "10px 20px", cursor: "pointer" }}
                        >
                          Modify Setup Settings
                        </button>
                      </div>
                    </div>

                    {/* Stats metrics */}
                    <div style={{ display: "flex", gap: 16 }}>
                      <StatCard label="Registered Attendees/Teams" value={eventRegs.length} color="#FFFF00" />
                      {selectedEvent.eventType === "hackathon" && (
                        <StatCard label="Total Hacker Members" value={eventRegs.reduce((sum, r) => sum + r.members.length, 0)} color="#FFFF00" />
                      )}
                      <StatCard label="Event Capacity limit" value={selectedEvent.capacity || "Open"} color="#00FFFF" />
                      <OptionStatCard label="Entry Fee" value="Free" color="#FF00FF" />
                    </div>

                    {/* Content text */}
                    <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1.2fr", gap: 40 }}>
                      <div>
                        <h3 style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "#FFFF00", margin: "0 0 16px 0" }}>About the Program</h3>
                        <p style={{ fontFamily: FONT, fontSize: 16, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, whiteSpace: "pre-line" }}>{selectedEvent.description || "No description provided."}</p>
                      </div>

                      {/* Side details */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 24, padding: 24, background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14 }}>
                        <h4 style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#fff", margin: "0 0 8px 0" }}>Key Details</h4>
                        {[
                          { label: "Listed Date", value: selectedEvent.date },
                          { label: "Listed Time", value: selectedEvent.time },
                          { label: "Deadline Date", value: selectedEvent.registrationDeadline || "—" },
                          { label: "Contact Channel", value: selectedEvent.contact?.email || "—" }
                        ].map(d => (
                          <div key={d.label} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: 10 }}>
                            <span style={{ fontFamily: FONT, fontSize: 11, color: "rgba(255,255,255,0.35)", textTransform: "uppercase" }}>{d.label}</span>
                            <span style={{ fontFamily: FONT, fontSize: 14, color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>{d.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

                {/* 2. TIMELINE PANEL */}
                {activeTab === "Timeline" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                    
                    {/* Add Schedule Form */}
                    <div style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 24 }}>
                      <h3 style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#FFFF00", margin: "0 0 16px 0" }}>Schedule Settings</h3>
                      <p style={{ fontFamily: FONT, fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>Timeline items are stored directly inside the event configuration in MongoDB.</p>
                      
                      {/* Timeline flow */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 0, margin: "20px 0" }}>
                        {!selectedEvent.timeline || selectedEvent.timeline.length === 0 ? (
                          <p style={{ fontFamily: FONT, color: "rgba(255,255,255,0.3)" }}>No schedule programmed. Edit the event to add timeline milestones.</p>
                        ) : (
                          selectedEvent.timeline.map((item, i) => (
                            <div key={i} style={{ display: "flex", gap: 20, position: "relative", paddingBottom: 24 }}>
                              {i < selectedEvent.timeline.length - 1 && (
                                <div style={{ position: "absolute", left: 130, top: 18, bottom: 0, width: 1, background: "rgba(255,255,255,0.1)" }} />
                              )}
                              <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: "#FFFF00", width: 120 }}>{item.time}</span>
                              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", marginTop: 6, zIndex: 2 }} />
                              <span style={{ fontFamily: FONT, fontSize: 14, color: "rgba(255,255,255,0.7)" }}>{item.label}</span>
                            </div>
                          ))
                        )}
                      </div>
                      
                      <button
                        onClick={() => navigate(`/admin/edit-event/${selectedEvent._id}`)}
                        style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", background: "rgba(255,255,0,0.08)", color: "#FFFF00", border: "1px solid rgba(255,255,0,0.25)", borderRadius: 8, padding: "10px 20px", cursor: "pointer" }}
                      >
                        Edit Event Timeline & Milestones
                      </button>
                    </div>

                  </div>
                )}

                {/* 3. TRACKS PANEL */}
                {activeTab === "Tracks" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                    <div style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 24 }}>
                      <h3 style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#FFFF00", margin: "0 0 16px 0" }}>Category Tracks</h3>
                      {selectedEvent.eventType !== "hackathon" ? (
                        <p style={{ fontFamily: FONT, fontSize: 14, color: "rgba(255,255,255,0.3)" }}>Meetups do not support multiple competitive track structures.</p>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 20 }}>
                          {!selectedEvent.problemStatement?.tracks || selectedEvent.problemStatement.tracks.length === 0 ? (
                            <p style={{ fontFamily: FONT, color: "rgba(255,255,255,0.3)" }}>No tracks added yet.</p>
                          ) : (
                            selectedEvent.problemStatement.tracks.map((track, i) => (
                              <div key={i} style={{ padding: 18, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                                  <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: "#fff" }}>{track.name}</span>
                                  <Pill color="#FFFF00">Track {String(i + 1).padStart(2, "0")}</Pill>
                                </div>
                                <p style={{ fontFamily: FONT, fontSize: 13, color: "rgba(255,255,255,0.45)", margin: 0 }}>{track.desc || "No track description provided."}</p>
                              </div>
                            ))
                          )}
                          <div style={{ marginTop: 14 }}>
                            <button
                              onClick={() => navigate(`/admin/edit-event/${selectedEvent._id}`)}
                              style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", background: "rgba(255,255,0,0.08)", color: "#FFFF00", border: "1px solid rgba(255,255,0,0.25)", borderRadius: 8, padding: "10px 20px", cursor: "pointer" }}
                            >
                              Edit Categories & Tracks
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 4. SPONSORS PANEL */}
                {activeTab === "Sponsors" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                    
                    {/* Add Sponsor form */}
                    <div style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 24 }}>
                      <h3 style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#FFFF00", margin: "0 0 16px 0" }}>Add Event Sponsor</h3>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        if (!newSponsor.name) return;
                        setSponsors([...sponsors, { id: Date.now(), ...newSponsor }]);
                        setNewSponsor({ name: "", logo: "", site: "", tier: "Gold" });
                      }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                          <div>
                            <label style={{ display: "block", fontFamily: FONT, fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: 6 }}>Sponsor Name *</label>
                            <input type="text" required value={newSponsor.name} onChange={e => setNewSponsor({ ...newSponsor, name: e.target.value })} style={inputStyle} />
                          </div>
                          <div>
                            <label style={{ display: "block", fontFamily: FONT, fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: 6 }}>Website / URL</label>
                            <input type="text" value={newSponsor.site} onChange={e => setNewSponsor({ ...newSponsor, site: e.target.value })} style={inputStyle} />
                          </div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                          <div>
                            <label style={{ display: "block", fontFamily: FONT, fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: 6 }}>Logo Image URL</label>
                            <input type="text" placeholder="https://..." value={newSponsor.logo} onChange={e => setNewSponsor({ ...newSponsor, logo: e.target.value })} style={inputStyle} />
                          </div>
                          <div>
                            <label style={{ display: "block", fontFamily: FONT, fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: 6 }}>Sponsor Tier</label>
                            <select value={newSponsor.tier} onChange={e => setNewSponsor({ ...newSponsor, tier: e.target.value })} style={inputStyle}>
                              {["Title", "Gold", "Silver", "Partner"].map(t => <option key={t} value={t} style={{ background: "#111" }}>{t}</option>)}
                            </select>
                          </div>
                        </div>
                        <button type="submit" style={buttonStyle}>Add Sponsor logo</button>
                      </form>
                    </div>

                    {/* Sponsors list */}
                    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24 }}>
                      <h3 style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#fff", margin: "0 0 20px 0" }}>Active Partners</h3>
                      {!sponsors.length ? (
                        <p style={{ fontFamily: FONT, fontSize: 14, color: "rgba(255,255,255,0.25)" }}>No sponsors uploaded yet.</p>
                      ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
                          {sponsors.map(sp => (
                            <div key={sp.id} style={{ display: "flex", gap: 14, alignItems: "center", padding: 14, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12 }}>
                              <div style={{ width: 48, height: 48, borderRadius: 8, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                                <img src={sp.logo || "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=100&fit=crop"} alt="" style={{ width: "90%", height: "90%", objectFit: "contain" }} />
                              </div>
                              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                                <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: "#fff" }}>{sp.name}</span>
                                <span style={{ fontFamily: FONT, fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{sp.site}</span>
                                <div style={{ marginTop: 4 }}><Pill color="#FFFF00">{sp.tier}</Pill></div>
                              </div>
                              <button onClick={() => setSponsors(sponsors.filter(s => s.id !== sp.id))} style={{ background: "none", border: "none", color: "#ff6b6b", cursor: "pointer", fontSize: 18 }}>×</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                )}

                {/* 5. FAQ PANEL */}
                {activeTab === "FAQ" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                    
                    {/* Add FAQ form */}
                    <div style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 24 }}>
                      <h3 style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#FFFF00", margin: "0 0 16px 0" }}>Create New FAQ</h3>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        if (!newFaq.q || !newFaq.a) return;
                        setFaqs([...faqs, { id: Date.now(), ...newFaq }]);
                        setNewFaq({ q: "", a: "" });
                      }}>
                        <div style={{ marginBottom: 16 }}>
                          <label style={{ display: "block", fontFamily: FONT, fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: 6 }}>Question Text *</label>
                          <input type="text" required value={newFaq.q} onChange={e => setNewFaq({ ...newFaq, q: e.target.value })} style={inputStyle} />
                        </div>
                        <div style={{ marginBottom: 20 }}>
                          <label style={{ display: "block", fontFamily: FONT, fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: 6 }}>Answer details *</label>
                          <textarea required rows={3} value={newFaq.a} onChange={e => setNewFaq({ ...newFaq, a: e.target.value })} style={{ ...inputStyle, resize: "vertical" }} />
                        </div>
                        <button type="submit" style={buttonStyle}>Add FAQ entry</button>
                      </form>
                    </div>

                    {/* FAQ listing */}
                    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24 }}>
                      <h3 style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#fff", margin: "0 0 20px 0" }}>Program FAQ Accordion</h3>
                      {!faqs.length ? (
                        <p style={{ fontFamily: FONT, fontSize: 14, color: "rgba(255,255,255,0.25)" }}>No FAQs entered yet.</p>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                          {faqs.map(faq => (
                            <div key={faq.id} style={{ padding: 18, background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 12, display: "flex", gap: 16, justifyContent: "space-between" }}>
                              <div style={{ flex: 1 }}>
                                <p style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: "#fff", margin: "0 0 6px 0" }}>Q: {faq.q}</p>
                                <p style={{ fontFamily: FONT, fontSize: 13, color: "rgba(255,255,255,0.55)", margin: 0 }}>A: {faq.a}</p>
                              </div>
                              <button onClick={() => setFaqs(faqs.filter(f => f.id !== faq.id))} style={{ background: "none", border: "none", color: "#ff6b6b", cursor: "pointer", alignSelf: "flex-start", fontSize: 18 }}>×</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                )}

                {/* 6. REGISTRATIONS PANEL */}
                {activeTab === "Registrations" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                    
                    {/* Registrations List container */}
                    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>
                      {selectedEvent.eventType === "hackathon" ? (
                        <HackathonTable data={eventRegs} />
                      ) : (
                        <MeetupTable data={eventRegs} />
                      )}
                    </div>

                  </div>
                )}

                {/* 7. PROBLEM STATEMENTS PANEL */}
                {activeTab === "Problem Statements" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                    
                    {/* Add Statement form */}
                    <div style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 24 }}>
                      <h3 style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#FFFF00", margin: "0 0 16px 0" }}>Publish Problem Statement</h3>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        if (!newProblem.title) return;
                        setProblems([...problems, { id: Date.now(), ...newProblem }]);
                        setNewProblem({ title: "", desc: "", link: "" });
                      }}>
                        <div style={{ marginBottom: 16 }}>
                          <label style={{ display: "block", fontFamily: FONT, fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: 6 }}>Statement Name / Title *</label>
                          <input type="text" required value={newProblem.title} onChange={e => setNewProblem({ ...newProblem, title: e.target.value })} style={inputStyle} />
                        </div>
                        <div style={{ marginBottom: 16 }}>
                          <label style={{ display: "block", fontFamily: FONT, fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: 6 }}>Reference Document URL (Drive, Github, etc.)</label>
                          <input type="text" placeholder="https://..." value={newProblem.link} onChange={e => setNewProblem({ ...newProblem, link: e.target.value })} style={inputStyle} />
                        </div>
                        <div style={{ marginBottom: 20 }}>
                          <label style={{ display: "block", fontFamily: FONT, fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: 6 }}>Guidelines / Short Description</label>
                          <textarea rows={3} value={newProblem.desc} onChange={e => setNewProblem({ ...newProblem, desc: e.target.value })} style={{ ...inputStyle, resize: "vertical" }} />
                        </div>
                        <button type="submit" style={buttonStyle}>Publish Statement</button>
                      </form>
                    </div>

                    {/* Statement list */}
                    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24 }}>
                      <h3 style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#fff", margin: "0 0 20px 0" }}>Active Problem Prompts</h3>
                      {!problems.length ? (
                        <p style={{ fontFamily: FONT, fontSize: 14, color: "rgba(255,255,255,0.25)" }}>No statements uploaded yet.</p>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                          {problems.map(pr => (
                            <div key={pr.id} style={{ padding: 18, background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 12, display: "flex", gap: 16, justifyContent: "space-between" }}>
                              <div style={{ flex: 1 }}>
                                <p style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: "#fff", margin: "0 0 6px 0" }}>{pr.title}</p>
                                {pr.desc && <p style={{ fontFamily: FONT, fontSize: 13, color: "rgba(255,255,255,0.55)", margin: "0 0 8px 0" }}>{pr.desc}</p>}
                                {pr.link && (
                                  <a href={pr.link} target="_blank" rel="noreferrer" style={{ fontFamily: FONT, fontSize: 12, color: "#FFFF00", textDecoration: "none" }}>
                                    View Guidelines Link ↗
                                  </a>
                                )}
                              </div>
                              <button onClick={() => setProblems(problems.filter(p => p.id !== pr.id))} style={{ background: "none", border: "none", color: "#ff6b6b", cursor: "pointer", alignSelf: "flex-start", fontSize: 18 }}>×</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                )}

                {/* 8. SUBMISSIONS PANEL */}
                {activeTab === "Submissions" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                    
                    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.5fr 2.5fr 1fr 1fr", gap: 16, padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.01)" }}>
                        {["Team Name", "Project Title", "Concept", "Links", "Review Status"].map(h => (
                          <span key={h} style={{ fontFamily: FONT, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>{h}</span>
                        ))}
                      </div>

                      {!submissions.length ? (
                        <p style={{ fontFamily: FONT, fontSize: 14, color: "rgba(255,255,255,0.25)", padding: "40px 0", textAlign: "center" }}>No projects submitted yet.</p>
                      ) : (
                        submissions.map(sub => (
                          <div key={sub.id} style={{ display: "grid", gridTemplateColumns: "1.2fr 1.5fr 2.5fr 1fr 1fr", gap: 16, padding: "18px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)", alignItems: "center" }}>
                            <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: "#fff" }}>{sub.team}</span>
                            <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600, color: "#FFFF00" }}>{sub.title}</span>
                            <span style={{ fontFamily: FONT, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{sub.desc}</span>
                            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                              <a href={`https://${sub.repo}`} target="_blank" rel="noreferrer" style={{ fontFamily: FONT, fontSize: 12, color: "#00FFFF", textDecoration: "none" }}>Repo ↗</a>
                              <a href={`https://${sub.demo}`} target="_blank" rel="noreferrer" style={{ fontFamily: FONT, fontSize: 12, color: "#FF00FF", textDecoration: "none" }}>Demo ↗</a>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <Pill color={sub.status === "Approved" ? "#00FF00" : "#FFFF00"}>{sub.status}</Pill>
                              <select
                                value={sub.status}
                                onChange={(e) => setSubmissions(submissions.map(s => s.id === sub.id ? { ...s, status: e.target.value } : s))}
                                style={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, color: "#fff", fontSize: 11, cursor: "pointer", padding: "4px 8px" }}
                              >
                                {["Under Review", "Approved", "Rejected"].map(opt => <option key={opt} value={opt} style={{ background: "#111" }}>{opt}</option>)}
                              </select>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                  </div>
                )}

                {/* 9. JUDGING PANEL */}
                {activeTab === "Judging" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                    
                    {/* Leaderboard */}
                    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>
                      <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                        <h3 style={{ fontFamily: FONT, fontSize: 14, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.05em", color: "#fff", margin: 0 }}>Evaluation Leaderboard</h3>
                      </div>
                      
                      <div style={{ display: "grid", gridTemplateColumns: "80px 1.5fr 1.5fr 1fr 1fr", gap: 16, padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.01)" }}>
                        {["Rank", "Team Name", "Project", "Score (100)", "Actions"].map(h => (
                          <span key={h} style={{ fontFamily: FONT, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>{h}</span>
                        ))}
                      </div>

                      {[...submissions].sort((a,b) => b.score - a.score).map((sub, idx) => (
                        <div key={sub.id} style={{ display: "grid", gridTemplateColumns: "80px 1.5fr 1.5fr 1fr 1fr", gap: 16, padding: "18px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)", alignItems: "center" }}>
                          <span style={{ fontFamily: FONT, fontSize: 18, fontWeight: 900, color: idx === 0 ? "#FFFF00" : "rgba(255,255,255,0.45)" }}>
                            {idx === 0 ? "🏆 01" : String(idx + 1).padStart(2, "0")}
                          </span>
                          <span style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: "#fff" }}>{sub.team}</span>
                          <span style={{ fontFamily: FONT, fontSize: 14, color: "rgba(255,255,255,0.6)" }}>{sub.title}</span>
                          <div>
                            <input
                              type="number"
                              value={sub.score}
                              onChange={(e) => setSubmissions(submissions.map(s => s.id === sub.id ? { ...s, score: Number(e.target.value) } : s))}
                              style={{ width: 60, padding: 6, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, color: "#fff", textAlign: "center" }}
                            />
                          </div>
                          <span style={{ fontFamily: FONT, fontSize: 12, color: "rgba(255,255,255,0.35)" }}>Evaluated</span>
                        </div>
                      ))}
                    </div>

                  </div>
                )}

                {/* 10. JUDGES PANEL */}
                {activeTab === "Judges" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                    
                    {/* Add Judge form */}
                    <div style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 24 }}>
                      <h3 style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#FFFF00", margin: "0 0 16px 0" }}>Invite Judge</h3>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        if (!newJudge.name || !newJudge.email) return;
                        setJudges([...judges, { id: Date.now(), ...newJudge }]);
                        setNewJudge({ name: "", email: "", org: "" });
                      }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                          <div>
                            <label style={{ display: "block", fontFamily: FONT, fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: 6 }}>Judge Name *</label>
                            <input type="text" required value={newJudge.name} onChange={e => setNewJudge({ ...newJudge, name: e.target.value })} style={inputStyle} />
                          </div>
                          <div>
                            <label style={{ display: "block", fontFamily: FONT, fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: 6 }}>Email Address *</label>
                            <input type="email" required value={newJudge.email} onChange={e => setNewJudge({ ...newJudge, email: e.target.value })} style={inputStyle} />
                          </div>
                        </div>
                        <div style={{ marginBottom: 20 }}>
                          <label style={{ display: "block", fontFamily: FONT, fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: 6 }}>Affiliation / Company</label>
                          <input type="text" value={newJudge.org} onChange={e => setNewJudge({ ...newJudge, org: e.target.value })} style={inputStyle} />
                        </div>
                        <button type="submit" style={buttonStyle}>Send Portal Invitation</button>
                      </form>
                    </div>

                    {/* Judges list */}
                    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24 }}>
                      <h3 style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#fff", margin: "0 0 20px 0" }}>Jury Members</h3>
                      {!judges.length ? (
                        <p style={{ fontFamily: FONT, fontSize: 14, color: "rgba(255,255,255,0.25)" }}>No jury members assigned.</p>
                      ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
                          {judges.map(ju => (
                            <div key={ju.id} style={{ display: "flex", flexDirection: "column", gap: 6, padding: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, position: "relative" }}>
                              <button onClick={() => setJudges(judges.filter(j => j.id !== ju.id))} style={{ position: "absolute", top: 12, right: 12, background: "none", border: "none", color: "#ff6b6b", cursor: "pointer", fontSize: 18 }}>×</button>
                              <span style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: "#fff" }}>{ju.name}</span>
                              <span style={{ fontFamily: FONT, fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{ju.email}</span>
                              {ju.org && <span style={{ fontFamily: FONT, fontSize: 13, color: "#FFFF00", marginTop: 4 }}>{ju.org}</span>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                )}

                {/* 11. ANNOUNCEMENTS PANEL */}
                {activeTab === "Announcements" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                    
                    {/* Send announcement form */}
                    <div style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 24 }}>
                      <h3 style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#FFFF00", margin: "0 0 16px 0" }}>Broadcast Announcement</h3>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        if (!newAnnouncement.title || !newAnnouncement.content) return;
                        setAnnouncements([{ id: Date.now(), title: newAnnouncement.title, content: newAnnouncement.content, sentAt: new Date().toLocaleString() }, ...announcements]);
                        setNewAnnouncement({ title: "", content: "", channels: { email: true, discord: false } });
                      }}>
                        <div style={{ marginBottom: 16 }}>
                          <label style={{ display: "block", fontFamily: FONT, fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: 6 }}>Broadcast Title *</label>
                          <input type="text" required value={newAnnouncement.title} onChange={e => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })} style={inputStyle} />
                        </div>
                        <div style={{ marginBottom: 16 }}>
                          <label style={{ display: "block", fontFamily: FONT, fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: 6 }}>Message Body *</label>
                          <textarea required rows={4} value={newAnnouncement.content} onChange={e => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })} style={{ ...inputStyle, resize: "vertical" }} />
                        </div>
                        <div style={{ display: "flex", gap: 24, marginBottom: 20 }}>
                          <label style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: FONT, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
                            <input type="checkbox" checked={newAnnouncement.channels.email} onChange={e => setNewAnnouncement({ ...newAnnouncement, channels: { ...newAnnouncement.channels, email: e.target.checked } })} />
                            Email blast participants
                          </label>
                          <label style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: FONT, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
                            <input type="checkbox" checked={newAnnouncement.channels.discord} onChange={e => setNewAnnouncement({ ...newAnnouncement, channels: { ...newAnnouncement.channels, discord: e.target.checked } })} />
                            Discord integration channel
                          </label>
                        </div>
                        <button type="submit" style={buttonStyle}>Send Broadcast Alert</button>
                      </form>
                    </div>

                    {/* Announcement logs */}
                    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24 }}>
                      <h3 style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#fff", margin: "0 0 20px 0" }}>Broadcast History</h3>
                      {!announcements.length ? (
                        <p style={{ fontFamily: FONT, fontSize: 14, color: "rgba(255,255,255,0.25)" }}>No announcements sent yet.</p>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                          {announcements.map(ann => (
                            <div key={ann.id} style={{ padding: 18, background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 12 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                <span style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: "#fff" }}>{ann.title}</span>
                                <span style={{ fontFamily: FONT, fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{ann.sentAt}</span>
                              </div>
                              <p style={{ fontFamily: FONT, fontSize: 13, color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: 1.5 }}>{ann.content}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                )}

                {/* 12. CERTIFICATES PANEL */}
                {activeTab === "Certificates" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.8fr", gap: 40 }}>
                      
                      {/* Controls */}
                      <div style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
                        <h3 style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#FFFF00", margin: 0 }}>Certificate Designer</h3>
                        
                        <div>
                          <label style={{ display: "block", fontFamily: FONT, fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: 6 }}>Certificate Title</label>
                          <input type="text" defaultValue="Certificate of Participation" style={inputStyle} />
                        </div>
                        <div>
                          <label style={{ display: "block", fontFamily: FONT, fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: 6 }}>Signatory Name</label>
                          <input type="text" defaultValue="Aditya Jogdand, Director HTC" style={inputStyle} />
                        </div>
                        <div>
                          <label style={{ display: "block", fontFamily: FONT, fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: 6 }}>Design template</label>
                          <select style={inputStyle}>
                            <option style={{ background: "#111" }}>Dark Tech minimal</option>
                            <option style={{ background: "#111" }}>Modern Gold theme</option>
                          </select>
                        </div>
                        
                        <button style={buttonStyle}>Generate & Send Certificates</button>
                      </div>

                      {/* Preview */}
                      <div style={{ background: "#060607", border: "2px solid #FFFF00", borderRadius: 16, padding: 32, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", position: "relative", minHeight: 320, boxSizing: "border-box" }}>
                        <div style={{ position: "absolute", top: 12, right: 12 }}><Pill color="#FFFF00">PREVIEW</Pill></div>
                        <span style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#FFFF00", marginBottom: 20 }}>HackTheCore Credential</span>
                        
                        <h2 style={{ fontFamily: FONT, fontSize: "1.8rem", fontWeight: 900, textTransform: "uppercase", color: "#fff", margin: "0 0 8px 0" }}>Certificate of Participation</h2>
                        <p style={{ fontFamily: FONT, fontSize: 13, color: "rgba(255,255,255,0.4)", margin: "0 0 24px 0" }}>This credential is proudly presented to</p>
                        
                        <h1 style={{ fontFamily: FONT, fontSize: "2.2rem", fontWeight: 900, color: "#FFFF00", margin: "0 0 20px 0" }}>[ PARTICIPANT NAME ]</h1>
                        
                        <div style={{ width: 120, height: 1, background: "rgba(255,255,255,0.15)", marginBottom: 24 }} />
                        
                        <p style={{ fontFamily: FONT, fontSize: 12, color: "rgba(255,255,255,0.5)", margin: 0, maxWidth: 380 }}>For completing all required tracks and submissions during the active hackathon program of <strong>{selectedEvent.title}</strong>.</p>
                      </div>

                    </div>

                  </div>
                )}

                {/* 13. PRIZES PANEL */}
                {activeTab === "Prizes" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                    
                    <div style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 24 }}>
                      <h3 style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#FFFF00", margin: "0 0 16px 0" }}>Award Prizes Configuration</h3>
                      {selectedEvent.eventType !== "hackathon" ? (
                        <p style={{ fontFamily: FONT, fontSize: 14, color: "rgba(255,255,255,0.3)" }}>Meetups do not have structured awards or competitive prize layouts.</p>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                          {!selectedEvent.prizes || selectedEvent.prizes.length === 0 ? (
                            <p style={{ fontFamily: FONT, color: "rgba(255,255,255,0.3)" }}>No prizes added yet.</p>
                          ) : (
                            selectedEvent.prizes.map((prize, i) => (
                              <div key={i} style={{ padding: 18, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, display: "flex", justifyHeight: "center", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                  <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6 }}>
                                    <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: "#fff" }}>{prize.label}</span>
                                    <Pill color="#FFFF00">Place {prize.place}</Pill>
                                  </div>
                                  <p style={{ fontFamily: FONT, fontSize: 13, color: "rgba(255,255,255,0.45)", margin: 0 }}>Perks: {prize.perks.join(" · ")}</p>
                                </div>
                                <span style={{ fontFamily: FONT, fontSize: "1.6rem", fontWeight: 900, color: "#FFFF00" }}>{prize.amount || "—"}</span>
                              </div>
                            ))
                          )}
                          <div style={{ marginTop: 14 }}>
                            <button
                              onClick={() => navigate(`/admin/edit-event/${selectedEvent._id}`)}
                              style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", background: "rgba(255,255,0,0.08)", color: "#FFFF00", border: "1px solid rgba(255,255,0,0.25)", borderRadius: 8, padding: "10px 20px", cursor: "pointer" }}
                            >
                              Edit Prizes & Perks
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                )}

                {/* 14. ANALYTICS PANEL */}
                {activeTab === "Analytics" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                    
                    {/* Charts */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                      
                      {/* Reg status over time */}
                      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24 }}>
                        <h4 style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.4)", margin: "0 0 20px 0" }}>Registration Velocity</h4>
                        
                        <div style={{ display: "flex", gap: 16, alignItems: "flex-end", height: 180, paddingBottom: 10, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                          {[12, 18, 25, 45, 60, eventRegs.length].map((val, idx) => (
                            <div key={idx} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                              <span style={{ fontFamily: FONT, fontSize: 11, color: "#FFFF00" }}>{val}</span>
                              <div style={{ width: "100%", height: `${Math.min(100, (val / 70) * 100)}%`, background: "#FFFF00", borderRadius: "4px 4px 0 0" }} />
                              <span style={{ fontFamily: FONT, fontSize: 10, color: "rgba(255,255,255,0.3)" }}>Day {idx + 1}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Experience levels */}
                      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24 }}>
                        <h4 style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.4)", margin: "0 0 20px 0" }}>Skill Demographics</h4>
                        
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                          {[
                            { label: "Beginner", pct: 28, color: "#FF00FF" },
                            { label: "Intermediate", pct: 54, color: "#00FFFF" },
                            { label: "Advanced", pct: 18, color: "#FFFF00" }
                          ].map(bar => (
                            <div key={bar.label}>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                <span style={{ fontFamily: FONT, fontSize: 13, color: "#fff" }}>{bar.label}</span>
                                <span style={{ fontFamily: FONT, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{bar.pct}%</span>
                              </div>
                              <div style={{ height: 8, background: "rgba(255,255,255,0.05)", borderRadius: 99, overflow: "hidden" }}>
                                <div style={{ height: "100%", width: `${bar.pct}%`, background: bar.color }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                  </div>
                )}

                {/* 15. REPORTS PANEL */}
                {activeTab === "Reports" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                    
                    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24 }}>
                      <h3 style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#FFFF00", margin: "0 0 8px 0" }}>Export CSV Logs</h3>
                      <p style={{ fontFamily: FONT, fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 24 }}>Generate spreadsheet downloads containing all registration tables and leaderboards.</p>
                      
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 18, background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 12 }}>
                          <span style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: "#fff" }}>Complete Registrations Log</span>
                          <span style={{ fontFamily: FONT, fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 12 }}>Export fields: Name, Email, Phone, Timestamp, Tracks, Roles.</span>
                          <button onClick={() => alert("CSV Generation complete! Downloading 'registrations_log.csv'...")} style={buttonStyle}>Generate & Download CSV</button>
                        </div>

                        {selectedEvent.eventType === "hackathon" && (
                          <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 18, background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 12 }}>
                            <span style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: "#fff" }}>Project Submissions Leaderboard</span>
                            <span style={{ fontFamily: FONT, fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 12 }}>Export fields: Team Name, Project Title, Average Score, Repo Link.</span>
                            <button onClick={() => alert("CSV Generation complete! Downloading 'leaderboard_scores.csv'...")} style={buttonStyle}>Generate & Download CSV</button>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                )}

                {/* 16. INTEGRATIONS PANEL */}
                {activeTab === "Integrations" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                    
                    {/* Webhook */}
                    <div style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
                      <h3 style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#FFFF00", margin: 0 }}>Webhook Integration</h3>
                      <div>
                        <label style={{ display: "block", fontFamily: FONT, fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: 6 }}>Discord Webhook Channel URL</label>
                        <input
                          type="text"
                          value={integrations.discordWebhook}
                          onChange={e => setIntegrations({ ...integrations, discordWebhook: e.target.value })}
                          style={inputStyle}
                        />
                      </div>
                      <label style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: FONT, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
                        <input
                          type="checkbox"
                          checked={integrations.googleSheetSync}
                          onChange={e => setIntegrations({ ...integrations, googleSheetSync: e.target.checked })}
                        />
                        Enable Google Sheets Sync (exports each registration row in real-time)
                      </label>
                      
                      <div>
                        <button onClick={() => alert("Integration settings saved!")} style={buttonStyle}>Save Webhook configs</button>
                      </div>
                    </div>

                  </div>
                )}

                {/* 17. SETTINGS PANEL */}
                {activeTab === "Settings" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                    
                    {/* Danger zone */}
                    <div style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,100,100,0.15)", borderRadius: 16, padding: 24 }}>
                      <h3 style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#ff6b6b", margin: "0 0 8px 0" }}>Danger Zone</h3>
                      <p style={{ fontFamily: FONT, fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 20 }}>Permanently remove this event and delete all its linked registration documents from MongoDB.</p>
                      
                      <button
                        onClick={() => deleteEvent(selectedEvent._id, selectedEvent.title)}
                        style={{
                          fontFamily: FONT, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                          background: "rgba(255,100,100,0.08)", color: "#ff6b6b", border: "1px solid rgba(255,100,100,0.2)",
                          borderRadius: 8, padding: "12px 24px", cursor: "pointer", transition: "all 0.2s"
                        }}
                        onMouseEnter={e => { e.target.style.background = "#ff6b6b"; e.target.style.color = "#0C0C0D"; }}
                        onMouseLeave={e => { e.target.style.background = "rgba(255,100,100,0.08)"; e.target.style.color = "#ff6b6b"; }}
                      >
                        Delete "{selectedEvent.title}" Permanentally
                      </button>
                    </div>

                  </div>
                )}

              </motion.div>
            </AnimatePresence>

          </div>

        </div>
      )}

    </div>
  );
}

// ── Secondary Layout Primitive Components ─────────────────
const OptionStatCard = ({ label, value, color }) => (
  <div style={{
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 16, padding: "20px 24px",
    display: "flex", flexDirection: "column", gap: 6,
    position: "relative", overflow: "hidden", flex: 1
  }}>
    <div style={{ position: "absolute", top: 0, left: 0, width: 4, height: "100%", background: color }} />
    <p style={{ fontFamily: FONT, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", margin: 0 }}>{label}</p>
    <h3 style={{ fontFamily: FONT, fontWeight: 900, fontSize: "2rem", color: "#fff", letterSpacing: "-0.02em", lineHeight: 1, margin: 0 }}>{value}</h3>
  </div>
);

// ── Shared Inline Styles ──────────────────────────────────
const inputStyle = {
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

const buttonStyle = {
  fontFamily: FONT,
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  background: "#FFFF00",
  color: "#0C0C0D",
  border: "none",
  borderRadius: 8,
  padding: "10px 20px",
  cursor: "pointer",
  transition: "transform 0.15s",
};
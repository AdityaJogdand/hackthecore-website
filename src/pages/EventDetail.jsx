import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, Users, ExternalLink, ChevronLeft } from "lucide-react";
import Footer from "../components/Footer";

const API_BASE = `${import.meta.env.VITE_API_URL}/api`;
const ease = [0.22, 1, 0.36, 1];

// Normalize a social/URL value to a full URL
const toHref = (val, platform) => {
  if (!val) return "";
  val = val.trim();
  if (/^https?:\/\//i.test(val)) return val;
  // Handle @handle for Twitter
  if (platform === "twitter") {
    const handle = val.startsWith("@") ? val.slice(1) : val;
    return `https://twitter.com/${handle}`;
  }
  // Bare domain or path — prepend https://
  return `https://${val}`;
};

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/events/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Event not found");
        return r.json();
      })
      .then(setEvent)
      .catch(() => setError("Could not load event."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-neutral-400 text-sm tracking-widest uppercase">Loading…</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <p className="text-neutral-500">{error || "Event not found."}</p>
        <button onClick={() => navigate("/events")} className="text-sm font-bold underline">
          Back to Events
        </button>
      </div>
    );
  }

  const isHackathon = event.eventType === "hackathon";

  // Check if registration deadline has passed
  const isDeadlinePassed = (() => {
    if (!event.registrationDeadline) return false;
    const d = new Date(event.registrationDeadline);
    return !isNaN(d) && d < new Date();
  })();

  return (
    <div className="min-h-screen bg-white">

      {/* ── Banner ── */}
      <div className="relative w-full h-[55vh] overflow-hidden">
        <img
          src={event.banner}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-16 pb-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <button
              onClick={() => navigate("/events")}
              className="flex items-center gap-1.5 text-white/60 hover:text-white text-sm font-medium mb-4 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" /> Back to Events
            </button>
            <div className="flex items-center gap-3 mb-3">
              <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                isHackathon ? "bg-yellow-400 text-black" : "bg-cyan-400 text-black"
              }`}>
                {event.eventType}
              </span>
              {event.edition && (
                <span className="text-white/50 text-sm">{event.edition}</span>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight leading-none">
              {event.title}
            </h1>
          </motion.div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-6xl mx-auto px-6 md:px-16 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Left — details */}
          <div className="lg:col-span-2 flex flex-col gap-10">

            {/* Quick meta */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease, delay: 0.1 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
              {[
                { icon: Calendar, label: "Date", value: event.date },
                { icon: Clock,    label: "Time", value: event.time },
                { icon: MapPin,   label: "Venue", value: event.venue },
                { icon: Users,    label: "Capacity", value: event.capacity || "Open" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-neutral-50 rounded-2xl p-4 border border-black/5">
                  <Icon className="h-4 w-4 text-neutral-400 mb-2" />
                  <p className="text-xs text-neutral-400 uppercase tracking-wider font-bold">{label}</p>
                  <p className="text-sm font-bold text-black mt-0.5">{value}</p>
                </div>
              ))}
            </motion.div>

            {/* Description */}
            {event.description && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease, delay: 0.15 }}
              >
                <h2 className="text-lg font-black uppercase tracking-tight text-black mb-3"><span className="text-yellow-400">About</span></h2>
                <p className="text-neutral-600 leading-relaxed whitespace-pre-line">{event.description}</p>
              </motion.div>
            )}

            {/* Tracks (hackathon only) */}
            {isHackathon && event.problemStatement?.tracks?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease, delay: 0.2 }}
              >
                <h2 className="text-lg font-black uppercase tracking-tight text-black mb-3"><span className="text-yellow-400">Tracks</span></h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {event.problemStatement.tracks.map((track, i) => (
                    <div key={i} className="border border-black/10 rounded-xl p-4">
                      <p className="font-bold text-black text-sm">{track.name}</p>
                      {track.desc && <p className="text-neutral-500 text-sm mt-1">{track.desc}</p>}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Prizes (hackathon only) */}
            {isHackathon && event.prizes?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease, delay: 0.25 }}
              >
                <h2 className="text-lg font-black uppercase tracking-tight text-black mb-3"><span className="text-yellow-400">Prizes</span></h2>
                <div className="flex flex-col gap-3">
                  {event.prizes.map((prize, i) => (
                    <div key={i} className="flex items-center gap-4 border border-black/10 rounded-xl px-5 py-4">
                      <span className="text-2xl font-black text-black w-8">{prize.place}</span>
                      <div>
                        <p className="font-bold text-black">{prize.label}</p>
                        {prize.amount && <p className="text-sm text-neutral-500">{prize.amount}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Timeline */}
            {event.timeline?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease, delay: 0.3 }}
              >
                <h2 className="text-lg font-black uppercase tracking-tight text-black mb-3"><span className="text-yellow-400">Timeline</span></h2>
                <div className="relative flex flex-col gap-0">
                  {event.timeline.map((item, i) => (
                    <div key={i} className="flex gap-4 relative">
                      <div className="flex flex-col items-center">
                        <div className="h-3 w-3 rounded-full bg-black mt-1 shrink-0" />
                        {i < event.timeline.length - 1 && (
                          <div className="w-px flex-1 bg-black/10 mt-1" />
                        )}
                      </div>
                      <div className="pb-6">
                        <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">{item.time}</p>
                        <p className="text-sm font-bold text-black mt-0.5">{item.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Judges (hackathon only) */}
            {isHackathon && event.judges?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease, delay: 0.35 }}
              >
                <h2 className="text-lg font-black uppercase tracking-tight text-black mb-3"><span className="text-yellow-400">Judges</span></h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {event.judges.map((judge, i) => (
                    <div key={i} className="border border-black/10 rounded-xl p-4 flex flex-col items-center text-center gap-2">
                      {judge.photo ? (
                        <img src={judge.photo} alt={judge.name} className="h-14 w-14 rounded-full object-cover" />
                      ) : (
                        <div className="h-14 w-14 rounded-full bg-black flex items-center justify-center text-white font-black text-lg">
                          {judge.name[0]}
                        </div>
                      )}
                      <p className="font-bold text-black text-sm">{judge.name}</p>
                      {judge.title && <p className="text-xs text-neutral-500">{judge.title}</p>}
                      {judge.company && <p className="text-xs text-neutral-400">{judge.company}</p>}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* FAQs */}
            {event.faqs?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease, delay: 0.4 }}
              >
                <h2 className="text-lg font-black uppercase tracking-tight text-black mb-3"><span className="text-yellow-400">FAQs</span></h2>
                <div className="flex flex-col gap-3">
                  {event.faqs.map((faq, i) => (
                    <div key={i} className="border border-black/10 rounded-xl p-5">
                      <p className="font-bold text-black text-sm">{faq.question}</p>
                      <p className="text-neutral-500 text-sm mt-1.5">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right — sticky sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease, delay: 0.2 }}
              className="sticky top-24 flex flex-col gap-5"
            >
              {/* Register CTA */}
              <div className="border border-black/10 rounded-2xl p-6 flex flex-col gap-4">
                {event.registrationDeadline && (
                  <p className={`text-xs font-bold uppercase tracking-wider ${isDeadlinePassed ? "text-red-500" : "text-neutral-500"}`}>
                    {isDeadlinePassed ? "Registration Closed" : `Deadline: ${event.registrationDeadline}`}
                  </p>
                )}
                {isDeadlinePassed ? (
                  <div className="w-full rounded-full bg-red-600 text-white font-black py-4 text-center text-sm uppercase tracking-wider">
                    Registration Closed
                  </div>
                ) : event.registrationLink?.trim() ? (
                  <a
                    href={/^https?:\/\//i.test(event.registrationLink.trim()) ? event.registrationLink.trim() : `https://${event.registrationLink.trim()}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full rounded-full bg-black text-white font-black py-4 text-center text-sm uppercase tracking-wider hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
                  >
                    Register Now <ExternalLink className="h-4 w-4" />
                  </a>
                ) : (
                  <div className="w-full rounded-full bg-neutral-100 text-neutral-400 font-black py-4 text-center text-sm uppercase tracking-wider">
                    Registration Opening Soon
                  </div>
                )}
                <p className="text-xs text-neutral-400 text-center">
                  {event.city} · {event.date}
                </p>
              </div>

              {/* Sponsors */}
              {event.sponsors?.length > 0 && (
                <div className="border border-black/10 rounded-2xl p-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4">Sponsors</p>
                  <div className="flex flex-wrap gap-3">
                    {event.sponsors.map((sponsor, i) => (
                      <div key={i} className="flex items-center gap-2">
                        {sponsor.logo && (
                          <img src={sponsor.logo} alt={sponsor.name} className="h-7 w-7 object-contain rounded" />
                        )}
                        <span className="text-sm font-bold text-black">{sponsor.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact */}
              {event.contact && Object.values(event.contact).some(Boolean) && (
                <div className="border border-black/10 rounded-2xl p-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4">Contact</p>
                  <div className="flex flex-col gap-2">
                    {event.contact.email && (
                      <a href={`mailto:${event.contact.email}`} className="text-sm text-black hover:underline">{event.contact.email}</a>
                    )}
                    {event.contact.discord && (
                      <a href={toHref(event.contact.discord)} target="_blank" rel="noreferrer" className="text-sm text-black hover:underline">Discord</a>
                    )}
                    {event.contact.whatsapp && (
                      <a href={toHref(event.contact.whatsapp)} target="_blank" rel="noreferrer" className="text-sm text-black hover:underline">WhatsApp</a>
                    )}
                    {event.contact.twitter && (
                      <a href={toHref(event.contact.twitter, "twitter")} target="_blank" rel="noreferrer" className="text-sm text-black hover:underline">Twitter / X</a>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

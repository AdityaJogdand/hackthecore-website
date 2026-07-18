import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import gsap from "gsap";
import Footer from "../components/Footer";

const SECTIONS = [
  {
    title: "1. Eligibility and Participation",
    items: [
      "You represent and warrant that all information submitted during registration is true, accurate, current, and complete.",
      "Participation in the Event is voluntary.",
      "The Organizer reserves the absolute right to verify eligibility criteria at any stage and to disqualify any Participant who provides false or misleading information, violates Event rules or applicable laws, or engages in misconduct or unethical behavior.",
      "The Organizer's decision regarding eligibility and participation shall be final and binding.",
    ],
  },
  {
    title: "2. Collection of Personal Data",
    body: "We may collect and process the following categories of personal data:",
    groups: [
      {
        label: "Identification Information",
        list: ["Full name", "Email address", "Phone number", "Institutional or organizational affiliation", "Profile photograph (if uploaded)"],
      },
      {
        label: "Technical Information",
        list: ["Device information", "IP address", "Log files", "Application usage analytics", "Operating system and app version details"],
      },
      {
        label: "Event-Related Data",
        list: ["Project submissions", "Code repositories", "Presentation materials", "Demo videos", "Photographs or recordings taken during the Event"],
      },
    ],
  },
  {
    title: "3. Legal Basis for Processing",
    body: "Personal data shall be processed on one or more of the following lawful bases: your explicit consent; performance of contractual obligations relating to Event participation; compliance with legal obligations; legitimate interests of the Organizer, including event administration and promotional activities. Where required under applicable law (including the Digital Personal Data Protection Act, 2023 (India), GDPR, or other relevant regulations), consent shall be obtained prior to processing.",
  },
  {
    title: "4. Purpose of Data Processing",
    body: "Personal data shall be collected and processed for the following purposes:",
    list: [
      "Event registration and identity verification",
      "Communication regarding Event updates",
      "Evaluation and judging of submissions",
      "Prize distribution and result announcements",
      "Publication of Event outcomes",
      "Promotional, marketing, and publicity activities related to the Event",
      "Compliance monitoring and enforcement of Event rules",
      "Improvement of Application performance and user experience",
    ],
  },
  {
    title: "5. Consent for Publicity and Media Use",
    items: [
      "By participating in the Event, you grant the Organizer the irrevocable right to use your name, photograph, institution name, project details, and audio-visual recordings for promotional, marketing, publicity, and reporting purposes in any media format worldwide without additional compensation.",
      "Such use shall be non-exclusive, royalty-free, and perpetual unless otherwise prohibited by applicable law.",
    ],
  },
  {
    title: "6. Intellectual Property Rights",
    items: [
      "Participants represent and warrant that all submissions are original or properly licensed.",
      "Unless otherwise specified, ownership of the project remains with the Participant.",
      "Participants grant the Organizer a non-exclusive, royalty-free, worldwide, sublicensable license to use, reproduce, publish, display, distribute, and promote submitted materials for Event-related evaluation, documentation, and promotional purposes.",
      "The Organizer shall not claim ownership of Participant intellectual property except as expressly provided herein.",
    ],
  },
  {
    title: "7. Code of Conduct",
    body: "Participants agree to maintain professionalism and integrity. The following conduct is strictly prohibited:",
    list: [
      "Plagiarism or misrepresentation of work",
      "Use of unauthorized materials or tools",
      "Harassment, discrimination, or abusive conduct",
      "Disruptive behavior affecting Event operations",
    ],
    footer: "Violation may result in immediate disqualification and potential reporting to relevant authorities.",
  },
  {
    title: "8. Confidentiality",
    body: "Participants agree not to disclose or misuse any confidential, proprietary, or sensitive information shared during the Event. This obligation shall survive termination of participation.",
  },
  {
    title: "9. Use of Technology and Third-Party Resources",
    body: "Participants shall use only legally acquired software, APIs, and data sources. Any violation of intellectual property or licensing laws shall result in immediate disqualification and potential legal action.",
  },
  {
    title: "10. Data Sharing and Disclosure",
    body: "We do not sell personal data. Personal data may be shared with:",
    list: [
      "Sponsors and judging panels (for evaluation purposes)",
      "Technology service providers (hosting, analytics, communication services)",
      "Legal or regulatory authorities when required by law",
      "Professional advisors under confidentiality obligations",
    ],
    footer: "Cross-border transfers, where applicable, shall be conducted in accordance with applicable data protection laws.",
  },
  {
    title: "11. Data Retention",
    body: "Personal data shall be retained only for as long as necessary to fulfill the purposes outlined in this Policy, unless a longer retention period is required by law. Data may thereafter be anonymized or securely deleted.",
  },
  {
    title: "12. Data Security",
    body: "The Organizer implements reasonable technical and organizational safeguards to protect personal data against unauthorized access, alteration, disclosure, or destruction. However, no electronic transmission or storage system can be guaranteed to be completely secure.",
  },
  {
    title: "13. Participant Rights",
    body: "Subject to applicable law, Participants may have the right to:",
    list: [
      "Access their personal data",
      "Request correction of inaccurate data",
      "Withdraw consent (where processing is based on consent)",
      "Request erasure or restriction of processing",
      "Lodge a complaint with a regulatory authority",
    ],
    footer: "Requests may be submitted to the contact details provided below.",
  },
  {
    title: "14. Liability Disclaimer",
    items: [
      "Participation in the Event is at your sole risk.",
      "The Organizer, sponsors, affiliates, employees, and partners shall not be liable for any direct, indirect, incidental, consequential, or special damages arising out of or in connection with participation in the Event, including but not limited to physical injury, property damage, data loss, or system compromise.",
      "The Organizer reserves the right to modify, suspend, postpone, or cancel the Event at its sole discretion due to unforeseen circumstances, force majeure events, or operational reasons.",
    ],
  },
  {
    title: "15. Amendments",
    body: "The Organizer reserves the right to amend this Policy at any time. Updated versions shall be posted within the Application and shall become effective upon publication.",
  },
  {
    title: "16. Governing Law and Jurisdiction",
    body: "This Policy shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or relating to this Policy shall be subject to the exclusive jurisdiction of the courts located in Mumbai, Maharashtra.",
  },
];

export default function PrivacyPolicy() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(heroRef.current?.children, {
        opacity: 0,
        y: 30,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
      });
      gsap.from(contentRef.current?.children, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.04,
        ease: "power2.out",
        delay: 0.3,
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-black pt-28 pb-16 px-6 md:px-16">
        <div ref={heroRef} className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-white/40 hover:text-white text-sm font-medium mb-8 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </button>

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-400 mb-4">
            Legal
          </p>
          <h1
            style={{ fontFamily: "'Sansplomb', sans-serif" }}
            className="text-5xl md:text-7xl font-bold text-white leading-none tracking-tight mb-6"
          >
            Privacy Policy<span className="text-yellow-400">.</span>
          </h1>
          <p className="text-white/50 text-sm leading-relaxed max-w-2xl">
            This Privacy Policy and Participation Terms governs the collection, use, disclosure, and
            processing of personal data in connection with the mobile application{" "}
            <span className="text-white font-semibold">Hackthecore</span> operated by{" "}
            <span className="text-white font-semibold">UniteCloud Services LLP</span>, incorporated
            under the laws of India, having its registered office at Juinagar. By accessing,
            registering for, or participating in Events through the Application, you acknowledge
            that you have read, understood, and agreed to be legally bound by this Policy.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 md:px-16 py-16">
        <div ref={contentRef} className="flex flex-col gap-10">
          {SECTIONS.map((sec, i) => (
            <div key={i} className="border-b border-black/8 pb-10 last:border-b-0">
              <h2 className="text-lg font-black uppercase tracking-tight text-black mb-4">
                <span className="text-yellow-400">{sec.title.split(".")[0]}.</span>
                {sec.title.slice(sec.title.indexOf(".") + 1)}
              </h2>

              {sec.body && (
                <p className="text-neutral-600 text-sm leading-relaxed mb-4">{sec.body}</p>
              )}

              {/* Numbered items (sec.items) */}
              {sec.items && (
                <ul className="flex flex-col gap-3">
                  {sec.items.map((item, j) => (
                    <li key={j} className="flex gap-3 text-sm text-neutral-600 leading-relaxed">
                      <span className="shrink-0 mt-0.5 h-5 w-5 rounded-full bg-yellow-400/20 text-black font-black text-[10px] flex items-center justify-center">
                        {j + 1}
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              {/* Bullet list (sec.list) */}
              {sec.list && (
                <ul className="flex flex-col gap-2 mt-2">
                  {sec.list.map((item, j) => (
                    <li key={j} className="flex gap-2.5 text-sm text-neutral-600 leading-relaxed">
                      <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-yellow-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              {/* Sub-groups (sec.groups) */}
              {sec.groups && (
                <div className="flex flex-col gap-6 mt-2">
                  {sec.groups.map((group, j) => (
                    <div key={j}>
                      <p className="text-xs font-black uppercase tracking-wider text-black mb-2">
                        {group.label}
                      </p>
                      <ul className="flex flex-col gap-1.5">
                        {group.list.map((item, k) => (
                          <li key={k} className="flex gap-2.5 text-sm text-neutral-600 leading-relaxed">
                            <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-yellow-400" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {sec.footer && (
                <p className="text-neutral-500 text-sm leading-relaxed mt-4 italic">{sec.footer}</p>
              )}
            </div>
          ))}
        </div>

        {/* Contact nudge */}
        <div className="mt-12 rounded-2xl bg-black p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-yellow-400 mb-1">Questions about this policy?</p>
            <p className="text-white/70 text-sm">Reach out to our team directly.</p>
          </div>
          <a
            href="mailto:connect@hackthecore.in"
            className="shrink-0 px-6 py-3 rounded-full bg-yellow-400 text-black font-black text-sm uppercase tracking-wider hover:bg-yellow-300 transition-colors"
          >
            connect@hackthecore.in
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}

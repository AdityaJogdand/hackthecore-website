import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import gsap from "gsap";
import Footer from "../components/Footer";

const SECTIONS = [
  {
    title: "1. Eligibility & Participation",
    items: [
      "I confirm that all information provided by me in the registration form is true, accurate, current, and complete.",
      "I am participating in the Event voluntarily and agree to comply with all Event rules, guidelines, timelines, and instructions communicated by the organizers.",
      "The organizers reserve the right to verify my eligibility and request supporting information or documents, where necessary.",
      "The organizers may reject, suspend, or disqualify any participant or team that provides false, misleading, or incomplete information; violates these terms or any Event rules; engages in unethical, unlawful, or disruptive conduct; or attempts to gain an unfair advantage.",
      "Participants below the legally permitted age of independent consent must obtain permission from a parent or legal guardian, where required by applicable law.",
      "Registration does not automatically guarantee final selection or participation in the Event unless confirmed by the organizers.",
    ],
  },
  {
    title: "2. Code of Conduct",
    items: [
      "I will maintain integrity, respect, professionalism, and ethical conduct throughout the Event.",
      "I will not engage in harassment, bullying, intimidation, or threatening behavior; discrimination based on race, gender, religion, nationality, disability, age, sexual orientation, or any other protected characteristic; abusive, offensive, disruptive, or inappropriate behavior; plagiarism, cheating, fraud, or misrepresentation; sabotaging another participant's work, systems, or resources; or any unlawful or unethical activity.",
      "I agree to treat fellow participants, mentors, judges, organizers, sponsors, volunteers, and partners with respect.",
      "The organizers reserve the right to remove any participant whose conduct may affect the safety, fairness, reputation, or smooth functioning of the Event.",
    ],
  },
  {
    title: "3. Intellectual Property (IP) Rights",
    items: [
      "All code, designs, prototypes, presentations, documentation, concepts, and other materials submitted during the Hackathon must be original work created by the participant or team, or use third-party materials only where proper authorization, licensing, and attribution have been obtained.",
      "Participants must not submit any material that infringes the intellectual property, privacy, confidentiality, or other legal rights of any third party.",
      "Unless otherwise specifically communicated in writing by the organizers, ownership of the original project and intellectual property created by participants will remain with the respective participants or teams.",
      "Participants grant the organizers a non-exclusive, worldwide, royalty-free license to use, reproduce, display, publish, demonstrate, and promote submitted project materials for Event evaluation and judging; Event promotion and publicity; internal presentations and reports; social media and website content; and future Hackathon-related promotional activities.",
      "Participants are responsible for resolving ownership rights among their own team members.",
      "Participants must properly disclose and credit all open-source software, APIs, datasets, AI tools, third-party libraries, frameworks, images, and other external resources used in their projects.",
      "Participation in the Event does not transfer ownership of any pre-existing intellectual property belonging to the participant, organizer, sponsor, or any third party.",
    ],
  },
  {
    title: "4. Use of AI Tools and Third-Party Technology",
    items: [
      "Participants may use AI tools, open-source software, APIs, datasets, libraries, and other technologies only where permitted under the Event rules.",
      "Participants are responsible for ensuring that their use of such technologies complies with applicable license terms; copyright requirements; data protection laws; API terms of use; and intellectual property laws.",
      "Where required by the organizers, participants must clearly disclose the use of generative AI or other automated tools in their submissions.",
      "The organizers may disqualify any project that relies on unauthorized, illegally obtained, malicious, or improperly licensed technology or data.",
    ],
  },
  {
    title: "5. Data Privacy & Consent",
    subsections: [
      {
        heading: "5.1 Personal Data We May Collect",
        body: "For the purpose of organizing and managing the Event, the organizers may collect personal information including:",
        list: [
          "Full name",
          "Email address and phone number",
          "Age or date of birth, where required",
          "Institution, college, university, or company details",
          "Educational and professional information",
          "Team and project information",
          "Identity or eligibility verification information, where necessary",
          "Photographs, videos, and audio recordings captured during the Event",
          "Technical information submitted through the Event platform",
          "Any other information voluntarily provided during registration or participation",
        ],
      },
      {
        heading: "5.2 Purpose of Data Collection",
        body: "Personal data may be collected and processed for the following purposes:",
        list: [
          "Participant registration and eligibility verification",
          "Event administration and coordination",
          "Communication of schedules, announcements, and updates",
          "Team formation and participant management",
          "Judging and evaluation",
          "Prize and certificate distribution",
          "Security and fraud prevention",
          "Responding to participant queries",
          "Post-event communication and feedback",
          "Event analysis and reporting",
          "Compliance with applicable legal and regulatory requirements",
        ],
      },
      {
        heading: "5.3 Consent to Processing",
        body: "By registering for the Event, I consent to the collection, storage, use, and processing of my personal information for legitimate Event-related purposes. I understand that my personal information will be handled in accordance with applicable data protection and privacy laws and the organizer's privacy practices.",
      },
      {
        heading: "5.4 Photography, Video & Media Consent",
        body: "I understand that photographs, video recordings, audio recordings, interviews, and screenshots may be captured during the Event. I consent to the use of my name, photograph, video or audio recording, institution or organization name, team name, project title and description, and Event participation details for Event-related communication, publicity, websites, social media, press releases, reports, presentations, and promotional materials. Where required by applicable law, separate consent may be obtained for specific marketing or promotional activities.",
      },
      {
        heading: "5.5 Data Sharing",
        body: "Personal information may be shared, only where necessary, with:",
        list: [
          "Authorized Event organizers and staff",
          "Technology and Event platform service providers",
          "Judges and mentors",
          "Sponsors and partners, where necessary for Event administration",
          "Prize and certificate fulfillment partners",
          "Government or legal authorities where required by law",
        ],
        footer: "The organizers will not sell participants' personal information to third parties.",
      },
      {
        heading: "5.6 Data Retention",
        body: "Personal information will be retained only for as long as reasonably necessary to:",
        list: [
          "Complete the Event and related activities",
          "Fulfil legal, accounting, reporting, and administrative requirements",
          "Resolve disputes or complaints",
          "Maintain legitimate Event records",
        ],
        footer: "Data that is no longer required will be deleted, anonymized, or securely disposed of in accordance with applicable requirements.",
      },
      {
        heading: "5.7 Data Security",
        body: "The organizers will take reasonable administrative, organizational, and technical measures to protect personal information against unauthorized access, loss, misuse, alteration, disclosure, or destruction. However, no digital platform or electronic transmission method can guarantee absolute security.",
      },
      {
        heading: "5.8 Participant Privacy Rights",
        body: "Subject to applicable law, participants may request:",
        list: [
          "Access to their personal information",
          "Correction of inaccurate or incomplete information",
          "Deletion of personal information, where legally permitted",
          "Withdrawal of consent for optional processing activities",
          "Information about how their personal data is being used",
        ],
        footer: "Requests may be submitted to: connect@hackthecore.in. Withdrawal of consent will not affect any processing lawfully carried out before the withdrawal.",
      },
    ],
  },
  {
    title: "6. Confidentiality",
    items: [
      "I agree not to disclose, copy, distribute, publish, misuse, or commercially exploit any confidential or proprietary information shared during the Event.",
      "Confidential information may include business information; technical information; product plans; source code; customer information; security information; trade secrets; and any information clearly identified as confidential.",
      "I will use confidential information only for the purpose for which it was provided.",
      "This obligation does not apply to information that is already publicly available through lawful means; was independently developed without using confidential information; or must be disclosed under applicable law or a valid legal order.",
    ],
  },
  {
    title: "7. Use of Technology, Systems & Resources",
    items: [
      "I am responsible for using only legally obtained and properly licensed software, hardware, APIs, datasets, tools, and other resources.",
      "I will not attempt unauthorized access to any system, network, account, or data; introduce malware, ransomware, viruses, or harmful code; conduct unauthorized security testing or scanning; steal, manipulate, or misuse data; disrupt Event infrastructure; or use Event resources for illegal purposes.",
      "Any violation of cybersecurity, intellectual property, licensing, privacy, or other applicable laws may result in immediate disqualification and further action where necessary.",
    ],
  },
  {
    title: "8. Submission Requirements",
    items: [
      "All submissions must be made within the deadline and through the process communicated by the organizers.",
      "Participants are responsible for ensuring that their submissions are functional to the extent represented; do not contain malicious code; do not infringe third-party rights; comply with Event themes and rules; and accurately represent the work completed by the participant or team.",
      "Late, incomplete, inaccessible, misleading, or non-compliant submissions may be rejected.",
      "The organizers are not responsible for submissions lost due to internet failure, technical errors, device issues, or other circumstances outside their reasonable control.",
    ],
  },
  {
    title: "9. Team Responsibility",
    items: [
      "Each participant is responsible for their own conduct and contribution to the team.",
      "Team members are responsible for deciding among themselves: project ownership; division of responsibilities; prize distribution; and future use or commercialization of the project.",
      "The organizers will not be responsible for internal disputes between team members unless otherwise required by law.",
    ],
  },
  {
    title: "10. Judging & Evaluation",
    items: [
      "Projects may be evaluated based on criteria communicated by the organizers, which may include innovation; technical implementation; relevance to the problem statement; impact and scalability; user experience; presentation quality; and overall feasibility.",
      "I agree to respect the decisions of the judging panel.",
      "Judging decisions will be final and binding, subject to applicable law and the official Event rules.",
      "The organizers may disqualify a submission if plagiarism, fraud, misrepresentation, rule violations, or intellectual property infringement is identified before or after judging.",
    ],
  },
  {
    title: "11. Prizes & Awards",
    items: [
      "Prizes, awards, certificates, or other benefits, if any, will be distributed according to the criteria communicated by the organizers.",
      "Participants may be required to complete identity, eligibility, tax, or banking verification before receiving a prize.",
      "Any applicable taxes, duties, or charges related to a prize will be handled according to applicable law and the official Event rules.",
      "The organizers reserve the right to substitute a prize with another prize of reasonably equivalent value where necessary.",
      "A participant or team may lose eligibility for a prize if a violation of these terms is discovered.",
    ],
  },
  {
    title: "12. Health, Safety & Personal Responsibility",
    items: [
      "Participants are responsible for taking reasonable care of their own health, safety, belongings, devices, and personal property during the Event.",
      "Participants must comply with venue safety requirements and instructions provided by Event staff.",
      "Participants must immediately report any safety concern, emergency, harassment, or serious misconduct to the organizers.",
    ],
  },
  {
    title: "13. Liability Disclaimer",
    items: [
      "I acknowledge that I am participating in the Event voluntarily and at my own risk.",
      "To the extent permitted by applicable law, the organizers, sponsors, partners, judges, mentors, employees, and volunteers will not be responsible for loss or damage to personal belongings or devices; loss of data; technical failures; internet or platform disruptions; indirect or consequential losses; or other losses arising from participation in the Event that are outside their reasonable control.",
      "Nothing in these terms excludes any liability that cannot legally be excluded under applicable law.",
    ],
  },
  {
    title: "14. Event Modification, Postponement & Cancellation",
    items: [
      "The organizers reserve the right to modify Event dates or timings; venue or delivery format; problem statements; rules and evaluation criteria; judging arrangements; or other Event-related requirements.",
      "The Event may be postponed, suspended, or cancelled due to unforeseen circumstances, safety concerns, technical issues, force majeure events, or other circumstances beyond the organizers' reasonable control.",
      "Participants will be informed of material changes through the registered contact details or official Event communication channels.",
    ],
  },
  {
    title: "15. Disqualification",
    body: "The organizers may disqualify any participant or team for:",
    list: [
      "Providing false information",
      "Plagiarism or intellectual property infringement",
      "Harassment or discrimination",
      "Cheating or unfair practices",
      "Misuse of confidential information",
      "Unauthorized access to systems or data",
      "Use of malicious software or prohibited technology",
      "Violation of Event rules",
      "Conduct that may harm participants, organizers, sponsors, partners, or the reputation of the Event",
    ],
  },
  {
    title: "16. Governing Law & Dispute Resolution",
    body: "These terms will be governed by the laws of India. Any dispute relating to the Event should first be raised with the organizers for good-faith resolution. If the matter cannot be resolved, it will be subject to the exclusive jurisdiction of the courts located in Mumbai, Maharashtra, unless otherwise required by applicable law.",
  },
  {
    title: "17. Changes to These Terms",
    body: "The organizers may update these terms when reasonably necessary due to changes in:",
    list: [
      "Event requirements",
      "Applicable laws or regulations",
      "Technology or security requirements",
      "Operational circumstances",
    ],
    footer: "Material changes will be communicated to participants where reasonably possible.",
  },
  {
    title: "18. Participant Declaration & Acceptance",
    body: "By selecting the acceptance checkbox and submitting the registration form, I confirm that:",
    checklist: [
      "I have read and understood the Hackathon Participation Terms, Privacy Policy & Consent.",
      "I confirm that the information provided by me is accurate and complete.",
      "I agree to follow the Event rules and Code of Conduct.",
      "I understand and accept the Intellectual Property and submission terms.",
      "I consent to the collection and processing of my personal data for Event administration and related purposes.",
      "I acknowledge the Event photography, video, and media terms described above.",
      "I understand that violations of these terms may result in disqualification.",
    ],
  },
];

function SectionBlock({ sec }) {
  const numLabel = sec.title.split(".")[0];
  const rest = sec.title.slice(sec.title.indexOf(".") + 1);

  return (
    <div className="border-b border-black/8 pb-10 last:border-b-0">
      <h2 className="text-lg font-black uppercase tracking-tight text-black mb-4">
        <span className="text-yellow-400">{numLabel}.</span>
        {rest}
      </h2>

      {sec.body && (
        <p className="text-neutral-600 text-sm leading-relaxed mb-4">{sec.body}</p>
      )}

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

      {sec.checklist && (
        <ul className="flex flex-col gap-3 mt-2">
          {sec.checklist.map((item, j) => (
            <li key={j} className="flex gap-3 text-sm text-neutral-600 leading-relaxed">
              <span className="shrink-0 mt-0.5 h-4 w-4 rounded border-2 border-black/20" />
              {item}
            </li>
          ))}
        </ul>
      )}

      {sec.footer && (
        <p className="text-neutral-500 text-sm leading-relaxed mt-4 italic">{sec.footer}</p>
      )}

      {/* Subsections (Section 5) */}
      {sec.subsections && (
        <div className="flex flex-col gap-7 mt-2">
          {sec.subsections.map((sub, j) => (
            <div key={j}>
              <h3 className="text-sm font-black uppercase tracking-wider text-black mb-2">
                {sub.heading}
              </h3>
              {sub.body && (
                <p className="text-neutral-600 text-sm leading-relaxed mb-3">{sub.body}</p>
              )}
              {sub.list && (
                <ul className="flex flex-col gap-2">
                  {sub.list.map((item, k) => (
                    <li key={k} className="flex gap-2.5 text-sm text-neutral-600 leading-relaxed">
                      <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-yellow-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              {sub.footer && (
                <p className="text-neutral-500 text-sm leading-relaxed mt-3 italic">{sub.footer}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function HackTerms() {
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
        <div ref={heroRef} className="max-w-5xl mx-auto">
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
            Participant Terms<span className="text-yellow-400">.</span>
          </h1>
          <p className="text-white/50 text-sm leading-relaxed max-w-2xl">
            Hackathon Participation Terms, Privacy Policy & Consent — operated by{" "}
            <span className="text-white font-semibold">UniteCloud Services LLP</span>. By
            registering for and participating in any Hackthecore Event, you acknowledge that you
            have read, understood, and agreed to the following terms and conditions.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 md:px-16 py-16">
        <div ref={contentRef} className="flex flex-col gap-10">
          {SECTIONS.map((sec, i) => (
            <SectionBlock key={i} sec={sec} />
          ))}
        </div>

        {/* Contact */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-black p-7 flex flex-col gap-2">
            <p className="text-xs font-bold uppercase tracking-wider text-yellow-400 mb-1">Event Queries</p>
            <p className="text-white font-bold">Hackthecore</p>
            <a href="mailto:connect@hackthecore.in" className="text-white/60 text-sm hover:text-white transition-colors">
              connect@hackthecore.in
            </a>
          </div>
          <div className="rounded-2xl border border-black/10 p-7 flex flex-col gap-2">
            <p className="text-xs font-bold uppercase tracking-wider text-yellow-500 mb-1">Privacy Requests</p>
            <p className="text-black font-bold">Grievance Contact</p>
            <a href="mailto:connect@hackthecore.in" className="text-neutral-500 text-sm hover:text-black transition-colors">
              connect@hackthecore.in
            </a>
            <p className="text-neutral-400 text-xs mt-1">Juinagar, Navi Mumbai, Maharashtra</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

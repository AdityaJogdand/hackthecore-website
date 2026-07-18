import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Plus, Minus } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const FAQS = [
  {
    q: "What does Hackthecore do?",
    a: "We organize hackathons, workshops, community events, technical sessions, networking opportunities, and industry collaborations while building a long-term developer ecosystem.",
  },
  {
    q: "How can I join the Hackthecore community?",
    a: "Simply create an account on our platform and join our community channels. You'll receive updates about events, learning opportunities, internships, and exclusive programs.",
  },
  {
    q: "Do I need to be a student to join Hackthecore?",
    a: "No. Hackthecore welcomes students, recent graduates, professionals, and anyone passionate about technology and innovation.",
  },
  {
    q: "Is joining Hackthecore free?",
    a: "Yes. Most community resources and membership are completely free. Some premium programs or special events may have separate registration requirements.",
  },
  {
    q: "What kind of events does Hackthecore organize?",
    a: "Hackthecore hosts hackathons, workshops, webinars, meetups, networking sessions, technical talks, and other community-driven initiatives throughout the year.",
  },
  {
    q: "What makes Hackthecore different?",
    a: "We focus on building long-term value rather than one-time events. Our goal is to help developers continuously learn, showcase their skills, connect with companies, and grow throughout their journey.",
  },
  {
    q: "How can companies collaborate with Hackthecore?",
    a: "Companies can partner with us through sponsorships, hiring initiatives, workshops, developer engagement programs, product showcases, and community collaborations.",
  },
  {
    q: "Can I become a Campus Ambassador?",
    a: "Yes, we're always looking for passionate students to represent Hackthecore at their colleges. Simply mail us at connect@hackthecore.in, and our team will get in touch with you with the next steps.",
  },
  {
    q: "How do I volunteer with Hackthecore?",
    a: "Whenever we're organizing initiatives, we open volunteer applications. Follow our social channels or join our community to stay updated.",
  },
  {
    q: "Does Hackthecore offer internships or jobs?",
    a: "While we don't directly guarantee placements, we collaborate with companies and help connect talented developers with internships and hiring opportunities.",
  },
  {
    q: "Can I organize an event with Hackthecore?",
    a: "Absolutely. We're always open to collaborating with colleges, startups, communities, and organizations to create impactful technology events and initiatives.",
  },
  {
    q: "Is Hackthecore a company?",
    a: "Hackthecore is a technology ecosystem focused on empowering developers through learning, innovation, collaboration, and industry connections. It brings together students, professionals, startups, and companies under one community.",
  },
  {
    q: "How do I contact the team?",
    a: "You can reach us through our Contact page or email us directly at connect@hackthecore.in. Whether it's a partnership, collaboration, media inquiry, or community question, we'd love to hear from you.",
  },
];

function FAQItem({ faq, index }) {
  const [open, setOpen] = useState(false);
  const bodyRef = useRef(null);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    if (open) {
      gsap.fromTo(el, { height: 0, opacity: 0 }, { height: "auto", opacity: 1, duration: 0.35, ease: "power2.out" });
    } else {
      gsap.to(el, { height: 0, opacity: 0, duration: 0.28, ease: "power2.in" });
    }
  }, [open]);

  return (
    <div
      className="border-b border-black/10 last:border-b-0"
      style={{ animationDelay: `${index * 0.04}s` }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-6 py-5 text-left group"
      >
        <span className="text-base md:text-lg font-bold text-white leading-snug group-hover:text-yellow-400 transition-colors duration-200">
          {faq.q}
        </span>
        <span className="shrink-0 h-7 w-7 rounded-full border border-white/15 flex items-center justify-center transition-colors duration-200 group-hover:border-yellow-400 group-hover:bg-yellow-400/10">
          {open
            ? <Minus className="h-3.5 w-3.5 text-white" />
            : <Plus className="h-3.5 w-3.5 text-white" />}
        </span>
      </button>

      <div ref={bodyRef} style={{ overflow: "hidden", height: 0, opacity: 0 }}>
        <p className="text-white/50 text-sm md:text-base leading-relaxed pb-5 pr-10">
          {faq.a}
        </p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 85%",
          once: true,
        },
      });

      gsap.from(listRef.current?.children, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.05,
        ease: "power2.out",
        scrollTrigger: {
          trigger: listRef.current,
          start: "top 85%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-white py-24 md:py-32"
    >
      <div className="w-full px-6 md:px-16">
        <div className="bg-black rounded-[40px] px-8 md:px-16 py-14 md:py-20">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div ref={headingRef} className="mb-14">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/30 mb-3">
                Got questions?
              </p>
              <h2
                style={{ fontFamily: "'Sansplomb', sans-serif" }}
                className="text-5xl md:text-7xl font-bold text-white leading-none tracking-tight"
              >
                Frequently Asked Questions<span className="text-yellow-400">.</span>
              </h2>
            </div>

            {/* Accordion */}
            <div ref={listRef} className="divide-y divide-white/10 border-t border-white/10">
              {FAQS.map((faq, i) => (
                <FAQItem key={i} faq={faq} index={i} />
              ))}
            </div>

            {/* Footer nudge */}
            <p className="mt-10 text-sm text-white/30">
              Still have questions?{" "}
              <a
                href="mailto:connect@hackthecore.in"
                className="font-bold text-white underline hover:text-yellow-400 transition-colors"
              >
                connect@hackthecore.in
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

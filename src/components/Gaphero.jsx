import React, { useEffect, useRef, useState } from 'react';

export default function GapHero() {
  const sectionRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [rippleKey, setRippleKey] = useState(0);
  const [shakeKey, setShakeKey] = useState(0);
  const hasRippled = useRef(false);

  useEffect(() => {
    function checkWidth() {
      setIsMobile(window.innerWidth <= 640);
    }
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    function onScroll() {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height - vh;
      const scrolled = -rect.top;
      const raw = total > 0 ? scrolled / total : 0;
      const clamped = Math.min(1, Math.max(0, raw));
      setProgress(clamped);

      // Fire the ripple + vibration exactly once, the moment the words fully meet.
      if (clamped >= 1 && !hasRippled.current) {
        hasRippled.current = true;
        setRippleKey((k) => k + 1);
        setShakeKey((k) => k + 1);
      } else if (clamped < 1 && hasRippled.current) {
        // allow it to re-trigger if the user scrolls back up and forward again
        hasRippled.current = false;
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600&family=Montserrat:wght@700;800;900&display=swap';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const ease = reducedMotion ? 1 : progress;
  const scale = 0.94 + ease * 0.06;
  const merged = progress === 1;

  // Diagonal tilt while in motion: each word leans into its direction of travel,
  // and settles back to perfectly upright (0deg) once fully merged or reduced-motion.
  const leftSkew = reducedMotion ? 0 : (1 - ease) * -10;
  const rightSkew = reducedMotion ? 0 : (1 - ease) * 10;
  const leftRotate = reducedMotion ? 0 : (1 - ease) * -6;
  const rightRotate = reducedMotion ? 0 : (1 - ease) * 6;

  const leftTransform = reducedMotion
    ? 'translateX(0) skewX(0deg) rotate(0deg)'
    : `translateX(${(1 - ease) * -110}vw) skewX(${leftSkew}deg) rotate(${leftRotate}deg)`;
  const rightTransform = reducedMotion
    ? 'translateX(0) skewX(0deg) rotate(0deg)'
    : `translateX(${(1 - ease) * 110}vw) skewX(${rightSkew}deg) rotate(${rightRotate}deg)`;
  const mobileLeftTransform = reducedMotion
    ? 'translateX(0) skewX(0deg) rotate(0deg)'
    : `translateX(${(1 - ease) * -130}vw) skewX(${leftSkew}deg) rotate(${leftRotate}deg)`;
  const mobileRightTransform = reducedMotion
    ? 'translateX(0) skewX(0deg) rotate(0deg)'
    : `translateX(${(1 - ease) * 130}vw) skewX(${rightSkew}deg) rotate(${rightRotate}deg)`;

  return (
    <div
      ref={sectionRef}
      className={`relative h-[130vh] ${merged ? 'bg-[#FEF636]' : 'bg-[#0B0C0A]'}`}
    >
      <style>{`
        @keyframes ripple-expand {
          0% { width: 0px; height: 0px; opacity: 0.6; border-width: 3px; }
          70% { opacity: 0.35; }
          100% { width: 900px; height: 900px; opacity: 0; border-width: 1px; }
        }
        .ripple-ring {
          animation: ripple-expand 900ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes word-bounce {
          0% { transform: scale(1); }
          30% { transform: scale(1.08); }
          55% { transform: scale(0.97); }
          75% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }
        .word-bounce {
          animation: word-bounce 500ms cubic-bezier(0.34, 1.56, 0.64, 1) 1;
        }
        @keyframes section-vibrate {
          0% { transform: translate(0, 0); }
          10% { transform: translate(-6px, 2px); }
          20% { transform: translate(5px, -3px); }
          30% { transform: translate(-4px, 3px); }
          40% { transform: translate(6px, -2px); }
          50% { transform: translate(-5px, 1px); }
          60% { transform: translate(4px, -2px); }
          70% { transform: translate(-3px, 2px); }
          80% { transform: translate(2px, -1px); }
          90% { transform: translate(-1px, 1px); }
          100% { transform: translate(0, 0); }
        }
        .section-vibrate {
          animation: section-vibrate 420ms cubic-bezier(0.36, 0.07, 0.19, 0.97) 1;
        }
      `}</style>

      <div
        key={shakeKey}
        className={`sticky top-0 h-screen flex flex-col overflow-hidden ${
          merged && !reducedMotion ? 'section-vibrate' : ''
        }`}
      >
        <div className="relative flex-1 flex flex-col justify-center items-center overflow-hidden min-h-0">
          {/* Ripple ring — mounts fresh each time rippleKey changes, plays once, then is gone */}
          {rippleKey > 0 && (
            <span
              key={rippleKey}
              className="ripple-ring pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-solid border-black"
            />
          )}

          {isMobile ? (
            <div
              className="flex flex-col items-center w-full gap-1.5 transition-transform duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}
            >
              <div
                className="overflow-hidden transition-transform duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ transform: mobileLeftTransform }}
              >
                <div
                  key={merged ? `bounce-l-${rippleKey}` : 'still-l'}
                  className={`font-black uppercase leading-[0.95] tracking-[-0.02em] whitespace-nowrap text-[clamp(3rem,14vw,5rem)] ${
                    merged ? 'text-black word-bounce' : 'text-[#ECE6D8]'
                  }`}
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  LETS
                </div>
              </div>

              <div
                className="overflow-hidden transition-transform duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ transform: mobileRightTransform }}
              >
                <div
                  key={merged ? `bounce-r-${rippleKey}` : 'still-r'}
                  className={`font-black uppercase leading-[0.95] tracking-[-0.02em] whitespace-nowrap text-[clamp(3rem,14vw,5rem)] ${
                    merged ? 'text-black word-bounce' : 'text-[#FEF636]'
                  }`}
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  BUILD
                </div>
              </div>
            </div>
          ) : (
            /*
              Desktop layout: outer div is the scale + centering anchor.
              Inner flex row holds both words with gap — translateX on each
              word moves them relative to their natural flex position, so
              centering is always preserved regardless of progress.
            */
            <div
              className="flex items-center justify-center w-full transition-transform duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}
            >
              {/* This inner row is the true layout container — centered as a unit, no offset */}
              <div className="flex flex-row items-center gap-10">
                <div
                  className="transition-transform duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{ transform: leftTransform }}
                >
                  <div
                    key={merged ? `bounce-l-${rippleKey}` : 'still-l'}
                    className={`font-black uppercase leading-[0.9] tracking-[-0.03em] whitespace-nowrap text-[clamp(4rem,10vw,9rem)] ${
                      merged ? 'text-black word-bounce' : 'text-white'
                    }`}
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    LET'S
                  </div>
                </div>

                <div
                  className="transition-transform duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{ transform: rightTransform }}
                >
                  <div
                    key={merged ? `bounce-r-${rippleKey}` : 'still-r'}
                    className={`font-black uppercase leading-[0.9] tracking-[-0.03em] whitespace-nowrap text-[clamp(4rem,10vw,9rem)] ${
                      merged ? 'text-black word-bounce' : 'text-[#F6FB37]'
                    }`}
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    BUILD
                  </div>
                </div>
              </div>
            </div>
          )}

          {merged && (
            <p
              className={`mt-6 sm:mt-8 text-center text-[11px] sm:text-sm tracking-[0.35em] uppercase text-black/70 ${
                reducedMotion ? '' : 'word-bounce'
              }`}
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
            >
              {'{ Where Innovation meets Execution }'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
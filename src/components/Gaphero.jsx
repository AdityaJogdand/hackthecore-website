import React, { useEffect, useRef, useState } from 'react';

export default function GapHero() {
  const sectionRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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
      setProgress(Math.min(1, Math.max(0, raw)));
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

  // Desktop: words fly in from far off-screen and settle with a 10px gap
  // The gap is handled by the flex `gap` property — no margin hacks needed.
  const leftTransform = reducedMotion
    ? 'translateX(0)'
    : `translateX(${(1 - ease) * -110}vw)`;
  const rightTransform = reducedMotion
    ? 'translateX(0)'
    : `translateX(${(1 - ease) * 110}vw)`;

  // Mobile: same axis, larger travel distance
  const mobileLeftTransform = reducedMotion
    ? 'translateX(0)'
    : `translateX(${(1 - ease) * -130}vw)`;
  const mobileRightTransform = reducedMotion
    ? 'translateX(0)'
    : `translateX(${(1 - ease) * 130}vw)`;

  return (
    <div
      ref={sectionRef}
      style={{ height: '130vh', position: 'relative', background: progress === 1 ? '#FEF636' : '#0B0C0A' }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <header style={{ padding: '7vh 6vw 3vh', flex: '0 0 auto' }} />

        <div
          style={{
            flex: '1 1 auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            padding: '0',
            minHeight: 0,
          }}
        >
          {isMobile ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                gap: '6px',
                transform: `scale(${scale})`,
                transformOrigin: 'center center',
                transition: reducedMotion ? 'none' : 'transform 450ms cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              <div
                style={{
                  overflow: 'hidden',
                  transform: mobileLeftTransform,
                  transition: reducedMotion ? 'none' : 'transform 450ms cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              >
                <div
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 900,
                    fontSize: 'clamp(3rem, 14vw, 5rem)',
                    color: progress === 1 ? '#000' : '#ECE6D8',
                    lineHeight: 0.95,
                    letterSpacing: '-0.02em',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                  }}
                >
                  LETS
                </div>
              </div>

              <div
                style={{
                  overflow: 'hidden',
                  transform: mobileRightTransform,
                  transition: reducedMotion ? 'none' : 'transform 450ms cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              >
                <div
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 900,
                    fontSize: 'clamp(3rem, 14vw, 5rem)',
                    color: progress === 1 ? '#000' : '#FEF636',
                    lineHeight: 0.95,
                    letterSpacing: '-0.02em',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                  }}
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
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                transform: `scale(${scale})`,
                transformOrigin: 'center center',
                transition: reducedMotion ? 'none' : 'transform 450ms cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              {/* This inner row is the true layout container — centered as a unit */}
              <div
  style={{
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '40px',
    transform: 'translateX(45px)', // move right
  }}
>
                <div
                  style={{
                    transform: leftTransform,
                    transition: reducedMotion ? 'none' : 'transform 450ms cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 900,
                      fontSize: 'clamp(4rem, 10vw, 9rem)',
                      color: progress === 1 ? '#000' : '#ffffff',
                      lineHeight: 0.9,
                      letterSpacing: '-0.03em',
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    LET'S
                  </div>
                </div>

                <div
                  style={{
                    transform: rightTransform,
                    transition: reducedMotion ? 'none' : 'transform 450ms cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 900,
                      fontSize: 'clamp(4rem, 10vw, 9rem)',
                      color: progress === 1 ? '#000' : '#F6FB37',
                      lineHeight: 0.9,
                      letterSpacing: '-0.03em',
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    BUILD
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import React, { useEffect, useRef, useState } from 'react';

// Swap these for real photography — one frame per "world" you're bridging.
const IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=900&q=80',
    label: 'Applied Research Lab',
  },
  {
    src: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=900&q=80',
    label: 'Manufacturing Floor',
  },
  {
    src: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=900&q=80',
    label: 'University Archive',
  },
];

const IMAGE_INTERVAL_MS = 1400;

export default function GapHero() {
  const sectionRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [imgIndex, setImgIndex] = useState(0);
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
    if (reducedMotion) return;
    const id = setInterval(() => {
      setImgIndex((i) => (i + 1) % IMAGES.length);
    }, IMAGE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [reducedMotion]);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600&family=Montserrat:wght@700;800&display=swap';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const ease = reducedMotion ? 1 : progress;
  const scale = 0.94 + ease * 0.16;
  const imageZoom = 0.9 + ease * 0.3;

  const leftTransform = reducedMotion
    ? 'none'
    : `translateX(calc(${(1 - ease) * -100}% - ${(1 - ease) * 60}vw))`;
  const rightTransform = reducedMotion
    ? 'none'
    : `translateX(calc(${(1 - ease) * 100}% + ${(1 - ease) * 60}vw))`;

  const mobileLeftTransform = reducedMotion
    ? 'none'
    : `translateX(${(1 - ease) * -120}vw)`;
  const mobileRightTransform = reducedMotion
    ? 'none'
    : `translateX(${(1 - ease) * 120}vw)`;

  const gapPx = 20;
  const overlapMargin = `calc(${gapPx / 2}px - (clamp(150px, 16vw, 280px) / 2))`;

  const imageBlock = (
    <div
      style={{
        flex: '0 0 auto',
        width: 'clamp(150px, 16vw, 280px)',
        position: 'relative',
        zIndex: 0,
        transform: `scale(${imageZoom})`,
        transition: reducedMotion ? 'none' : 'transform 450ms cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      <div
        style={{
          width: '100%',
          aspectRatio: '3 / 4',
          borderRadius: 4,
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
          border: '1px solid rgba(236,230,216,0.15)',
        }}
      >
        <img
          key={imgIndex}
          src={IMAGES[imgIndex].src}
          alt={IMAGES[imgIndex].label}
          className="gap-img"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            inset: 0,
          }}
        />
      </div>
      <div
        style={{
          marginTop: 12,
          textAlign: 'center',
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.7rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: '#B5652A',
        }}
      >
        {IMAGES[imgIndex].label}
      </div>
    </div>
  );

  return (
    <div
      ref={sectionRef}
      style={{ height: '300vh', position: 'relative', background: '#0B0C0A' }}
    >
      <style>{`
        @keyframes gapImgFade { from { opacity: 0; } to { opacity: 1; } }
        .gap-img { animation: gapImgFade 900ms ease; }
      `}</style>

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
        {/* Header now lives inside the sticky container, so it stays pinned
            in place for the whole scroll duration instead of scrolling
            away before the "WE CLOSE THAT GAP" animation begins. */}
        <header
          style={{
            padding: '7vh 6vw 3vh',
            textAlign: 'left',
            flex: '0 0 auto',
          }}
        >
          <h1
            style={{
              margin: 0,
              marginTop: '20px',
              fontFamily: "'Anton', sans-serif",
              color: '#ECE6D8',
              fontSize: 'clamp(1.3rem, 4.4vw, 3.6rem)',
              lineHeight: 1.05,
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              textAlign: 'center',
            }}
          >
            THE GAP BETWEEN INDUSTRY{' '}
            <span style={{ color: '#eec20f' }}>& ACADEMIA</span>
          </h1>
        </header>

        <div
          style={{
            flex: '1 1 auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            padding: '0 6vw',
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
                transform: `scale(${scale})`,
                transformOrigin: 'center center',
                transition: reducedMotion ? 'none' : 'transform 450ms cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              <div style={{ marginBottom: '4vh' }}>{imageBlock}</div>

              <div
                style={{
                  width: '100%',
                  textAlign: 'center',
                  overflow: 'hidden',
                  transform: mobileLeftTransform,
                  transition: reducedMotion ? 'none' : 'transform 450ms cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              >
                <div
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 800,
                    fontSize: 'clamp(2.2rem, 11vw, 3.2rem)',
                    color: '#ECE6D8',
                    lineHeight: 0.95,
                    letterSpacing: '-0.01em',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                  }}
                >
                  WE CLOSE
                </div>
              </div>

              <div
                style={{
                  width: '100%',
                  textAlign: 'center',
                  overflow: 'hidden',
                  marginTop: 4,
                  transform: mobileRightTransform,
                  transition: reducedMotion ? 'none' : 'transform 450ms cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              >
                <div
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 800,
                    fontSize: 'clamp(2.2rem, 11vw, 3.2rem)',
                    color: '#ECE6D8',
                    lineHeight: 0.95,
                    letterSpacing: '-0.01em',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                  }}
                >
                  THAT GAP
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                maxWidth: 1600,
                transform: `scale(${scale})`,
                transformOrigin: 'center center',
                transition: reducedMotion ? 'none' : 'transform 450ms cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              {/* flex: 0 0 auto lets the box size to the text instead of a fixed
                  width that was narrower than the rendered text at large font sizes. */}
              <div
                style={{
                  flex: '0 0 auto',
                  textAlign: 'right',
                  transform: leftTransform,
                  transition: reducedMotion ? 'none' : 'transform 450ms cubic-bezier(0.22, 1, 0.36, 1)',
                  position: 'relative',
                  zIndex: 1,
                  marginRight: overlapMargin,
                }}
              >
                <div
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 800,
                    fontSize: 'clamp(2.3rem, 6.2vw, 5.5rem)',
                    color: '#ECE6D8',
                    lineHeight: 0.9,
                    letterSpacing: '-0.01em',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                  }}
                >
                  WE CLOSE
                </div>
              </div>

              {imageBlock}

              <div
                style={{
                  flex: '0 0 auto',
                  textAlign: 'left',
                  transform: rightTransform,
                  transition: reducedMotion ? 'none' : 'transform 450ms cubic-bezier(0.22, 1, 0.36, 1)',
                  position: 'relative',
                  zIndex: 1,
                  marginLeft: overlapMargin,
                }}
              >
                <div
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 800,
                    fontSize: 'clamp(2.3rem, 6.2vw, 5.5rem)',
                    color: '#ECE6D8',
                    lineHeight: 0.9,
                    letterSpacing: '-0.01em',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                  }}
                >
                  THAT GAP
                </div>
              </div>
            </div>
          )}

          <p
            style={{
              marginTop: '4vh',
              maxWidth: 640,
              textAlign: 'center',
              fontFamily: "'Inter', sans-serif",
              fontSize: '1.05rem',
              lineHeight: 1.6,
              color: '#B8B2A2',
            }}
          >
            Every great engineer starts somewhere. Hack The Core exists to give ambitious students the platform, mentorship, competition, and industry exposure they need to become exceptional developers.
          </p>
        </div>
      </div>
    </div>
  );
}
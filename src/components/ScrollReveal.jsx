import { useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './ScrollReveal.css';

gsap.registerPlugin(ScrollTrigger);

const ScrollReveal = ({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = '',
  textClassName = '',
  rotationEnd = 'bottom bottom',
  wordAnimationEnd = 'bottom center',  // brought back closer — was 'bottom top+=10%'
  highlightWords = [],                 // phrases to style differently, e.g. ["thriving ecosystem"]
  highlightClassName = 'word-highlight'
}) => {
  const containerRef = useRef(null);

  // Longest phrases first so multi-word matches win over shorter overlapping ones
  const sortedHighlights = useMemo(
    () => [...highlightWords].filter(Boolean).sort((a, b) => b.length - a.length),
    [highlightWords]
  );

  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    if (!text) return [];

    let segments = [text];
    if (sortedHighlights.length) {
      const escaped = sortedHighlights.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
      const pattern = new RegExp(`(${escaped.join('|')})`, 'g');
      segments = text.split(pattern);
    }

    let key = 0;
    return segments.flatMap((segment) => {
      if (!segment) return [];

      if (sortedHighlights.includes(segment)) {
        key += 1;
        return (
          <span className={`word ${highlightClassName}`} key={`h-${key}`}>
            {segment}
          </span>
        );
      }

      return segment.split(/(\s+)/).map((word) => {
        if (word === '' || word.match(/^\s+$/)) return word;
        key += 1;
        return (
          <span className="word" key={key}>
            {word}
          </span>
        );
      });
    });
  }, [children, sortedHighlights, highlightClassName]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;

    const ctx = gsap.context(() => {
      // Animation 1: container rotation
      gsap.fromTo(
        el,
        { transformOrigin: '0% 50%', rotate: baseRotation },
        {
          ease: 'none',
          rotate: 0,
          scrollTrigger: {
            trigger: el,
            scroller,
            start: 'top bottom',
            end: rotationEnd,
            scrub: true
          }
        }
      );

      const wordElements = el.querySelectorAll('.word');

      // Animation 2: word opacity
      gsap.fromTo(
        wordElements,
        { opacity: baseOpacity, willChange: 'opacity' },
        {
          ease: 'none',
          opacity: 1,
          stagger: 0.15,
          scrollTrigger: {
            trigger: el,
            scroller,
            start: 'top bottom-=10%',
            end: wordAnimationEnd,
            scrub: 1.5
          }
        }
      );

      // Animation 3: blur opacity (conditional)
      if (enableBlur) {
        gsap.fromTo(
          wordElements,
          { opacity: baseOpacity, willChange: 'opacity' },
          {
            ease: 'none',
            opacity: 1,
            stagger: 0.08,
            scrollTrigger: {
              trigger: el,
              scroller,
              start: 'top bottom-=10%',
              end: wordAnimationEnd,
              scrub: 0.6
            }
          }
        );
      }
    }, el);

    return () => ctx.revert();
  }, [scrollContainerRef, enableBlur, baseRotation, baseOpacity, rotationEnd, wordAnimationEnd, blurStrength]);

  return (
    <h2 ref={containerRef} className={`scroll-reveal ${containerClassName}`}>
      <p className={`scroll-reveal-text ${textClassName}`}>{splitText}</p>
    </h2>
  );
};

export default ScrollReveal;
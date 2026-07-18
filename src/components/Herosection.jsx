import React, { useEffect, useRef } from 'react'
import blob from '../assets/websiteback.png'
import { gsap } from 'gsap'
import { useNavigate } from 'react-router-dom'

const Herosection = () => {
  const navigate = useNavigate()
  const buildRef = useRef(null)
  const nextRef = useRef(null)
  const containerRef = useRef(null)
  const eyebrowRef = useRef(null)
  const scrollRef = useRef(null)
  const ctaRef = useRef(null)
  const statsRef = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })

    tl.fromTo(
      eyebrowRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.6 }
    )

    tl.fromTo(
      buildRef.current,
      { y: 80, opacity: 0, skewX: -6 },
      { y: 0, opacity: 1, skewX: 0, duration: 1 },
      '-=0.2'
    )

    tl.fromTo(
      nextRef.current,
      { y: 100, opacity: 0, skewX: -6 },
      { y: 0, opacity: 1, skewX: 0, duration: 1 },
      '-=0.65'
    )

    tl.fromTo(
      ctaRef.current?.children,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 },
      '-=0.4'
    )

    tl.fromTo(
      statsRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.6 },
      '-=0.3'
    )

    tl.fromTo(
      scrollRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.6 },
      '-=0.2'
    )

    gsap.to(scrollRef.current?.querySelector('.tick'), {
      y: 6,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 1.5,
    })
  }, [])

  const handleBtnEnter = (e) => {
    gsap.to(e.currentTarget, { scale: 1.03, duration: 0.3, ease: 'power2.out' })
  }
  const handleBtnLeave = (e) => {
    gsap.to(e.currentTarget, { scale: 1, duration: 0.3, ease: 'power2.out' })
  }

  return (
    <>
    <style>{`@media (max-width: 767px) { .hero-section { background-size: 300% !important; background-position: 35% calc(50% + 40px) !important; } }`}</style>
    <section
      className="relative min-h-screen bg-center bg-no-repeat flex items-center justify-center overflow-hidden px-4 py-24 sm:px-6 sm:py-20 hero-section"
      style={{ backgroundImage: `url(${blob})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#F5F914', marginTop: '-1rem' }}
    >

      <div
        ref={containerRef}
        className="flex flex-col items-center text-center leading-none z-10 w-full max-w-5xl mt-20"
      >
        <div ref={eyebrowRef} className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="w-4 sm:w-6 h-px bg-black opacity-40" />
          <span className="text-[10px] sm:text-xs font-medium tracking-[0.2em] sm:tracking-[0.25em] uppercase text-black opacity-50">
            We make it real
          </span>
          <div className="w-4 sm:w-6 h-px bg-black opacity-40" />
        </div>

        <div
          ref={buildRef}
          className="font-druk uppercase tracking-tight text-black"
          style={{ fontSize: 'clamp(1.75rem, 7vw, 7rem)', lineHeight: 0.9, fontWeight: 700 }}
        >
          BUILD WHAT'S
        </div>

        <div
          ref={nextRef}
          className="font-druk uppercase tracking-tight text-black"
          style={{ fontSize: 'clamp(3rem, 15vw, 15rem)', lineHeight: 0.85, fontWeight: 700 }}
        >
          NEXT
        </div>

        {/* CTA buttons */}
        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 mt-8 sm:mt-10 w-full sm:w-auto px-2 sm:px-0"
        >
          <button
            onMouseEnter={handleBtnEnter}
            onMouseLeave={handleBtnLeave}
            onClick={() => navigate('/community')}
            className="w-full sm:w-auto px-6 py-3 sm:px-9 sm:py-3.5 rounded-full bg-black text-white text-[11px] sm:text-xs font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase transition-colors duration-300 hover:bg-white hover:text-black border-2 border-black"
          >
            Join Community
          </button>

          <button
            onClick={() => navigate('/events')}
            onMouseEnter={handleBtnEnter}
            onMouseLeave={handleBtnLeave}
            className="w-full sm:w-auto px-6 py-3 sm:px-9 sm:py-3.5 rounded-full bg-transparent text-black text-[11px] sm:text-xs font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase transition-colors duration-300 hover:bg-black hover:text-white border-2 border-black"
          >
            Explore Event
          </button>
        </div>

        {/* Stats */}
        <div
          ref={statsRef}
          className="flex items-center justify-center flex-wrap gap-x-5 gap-y-4 sm:gap-x-10 md:gap-x-14 mt-10 sm:mt-12 px-2"
        >
          {[
            { value: '150+', label: 'Projects Shipped' },
            { value: '40+', label: 'Clients Worldwide' },
            { value: '8', label: 'Years Building' },
          ].map((stat, i) => (
            <React.Fragment key={stat.label}>
              {i !== 0 && <div className="hidden xs:block w-px h-7 sm:h-8 bg-black opacity-20" />}
              <div className="flex flex-col items-center min-w-[80px]">
                <span className="font-druk text-black text-lg sm:text-xl md:text-2xl font-bold">
                  {stat.value}
                </span>
                <span className="text-[8px] sm:text-[10px] tracking-[0.15em] sm:tracking-[0.2em] uppercase text-black opacity-50 mt-1 whitespace-nowrap">
                  {stat.label}
                </span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

    </section>
    </>
  )
}

export default Herosection
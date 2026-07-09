/**
 * SmoothScrollProvider.jsx
 * ------------------------------------------------------------------
 * Mount this ONCE at the root of your app (e.g. in App.jsx, wrapping
 * your <Router>/<Routes>), not inside individual page components.
 *
 * Also exposes the Lenis instance via context (useLenis()) so other
 * components — like ScrollToTop — can control scroll position. This
 * matters because Lenis overrides native scrolling, so plain
 * window.scrollTo(0, 0) on route change won't reliably work; you have
 * to tell Lenis itself to scroll to top.
 *
 * Usage in App.jsx:
 *   import SmoothScrollProvider from "./components/SmoothScrollProvider";
 *
 *   function App() {
 *     return (
 *       <SmoothScrollProvider>
 *         <BrowserRouter>
 *           <Routes>
 *             <Route path="/" element={<Home />} />
 *             <Route path="/about" element={<About />} />
 *           </Routes>
 *         </BrowserRouter>
 *       </SmoothScrollProvider>
 *     );
 *   }
 * ------------------------------------------------------------------
 */

import { createContext, useContext, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

const LenisContext = createContext(null);

export function useLenis() {
  return useContext(LenisContext);
}

export default function SmoothScrollProvider({ children }) {
  const lenisRef = useRef(null);
  const [, forceRender] = useState(0);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;
    // Trigger a re-render so consumers get a non-null lenis on first paint
    forceRender((n) => n + 1);

    lenis.on("scroll", ScrollTrigger.update);

    const tickerCallback = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // This only tears down when the whole app unmounts (i.e. basically never),
    // not on every route change.
    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <LenisContext.Provider value={lenisRef.current}>
      {children}
    </LenisContext.Provider>
  );
}
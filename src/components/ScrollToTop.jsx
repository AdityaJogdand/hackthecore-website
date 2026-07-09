/**
 * ScrollToTop.jsx
 * ------------------------------------------------------------------
 * Renders nothing — it just watches the current route and snaps scroll
 * back to the top of the page whenever the pathname changes. Must be
 * rendered INSIDE both <BrowserRouter> (needs useLocation) and
 * <SmoothScrollProvider> (needs useLenis).
 *
 * Usage in App.jsx:
 *   <SmoothScrollProvider>
 *     <BrowserRouter>
 *       <ScrollToTop />
 *       <Routes>...</Routes>
 *     </BrowserRouter>
 *   </SmoothScrollProvider>
 * ------------------------------------------------------------------
 */

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLenis } from "./SmoothScrollProvider";

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const lenis = useLenis();

  useEffect(() => {
    if (lenis) {
      // immediate: true = instant jump, no smooth animation, matching
      // normal browser behavior when you navigate to a new page.
      lenis.scrollTo(0, { immediate: true });
    } else {
      // Fallback in case Lenis hasn't initialized yet on the very first render
      window.scrollTo(0, 0);
    }
  }, [pathname, lenis]);

  return null;
}
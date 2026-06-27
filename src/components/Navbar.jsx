import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import htcLogo from "../assets/htc.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const navItems = ["Home", "About", "Events", "Merch"];
  const routeMap = {
    Events: "/events",
    Courses: "/courses",
    Merch: "/merchstore",
  };

  // On white hero: ink text when transparent, white pill when scrolled
  const textColor = scrolled ? "#ffffff" : "#0C0C0D";
  const hoverColor = "#FFFF00";

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{ fontFamily: "Barlow, sans-serif" }}
    >
      <motion.div
        initial={false}
        animate={{
          marginLeft:      scrolled && isDesktop ? "2.5rem" : "0rem",
          marginRight:     scrolled && isDesktop ? "2.5rem" : "0rem",
          marginTop:       scrolled && isDesktop ? "0.65rem" : "0rem",
          borderRadius:    scrolled && isDesktop ? "9999px" : "0px",
          backgroundColor: scrolled ? "#0C0C0D" : "transparent",
          boxShadow: scrolled
            ? "0 4px 32px rgba(0,0,0,0.18)"
            : "0 0px 0px rgba(0,0,0,0)",
        }}
        transition={{ duration: 0.38, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        {/* Bottom border only when transparent (white hero) */}
        {!scrolled && (
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 1,
              background: "rgba(0,0,0,0.08)",
              pointerEvents: "none",
            }}
          />
        )}

        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-2 md:py-3">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src={htcLogo}
              alt="HackTheCore Logo"
              className={`w-auto object-contain transition-all duration-300 ${scrolled ? "h-11" : "h-14"}`}
              style={{
                filter: scrolled ? "none" : "invert(1)",
              }}
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-8">
            {navItems.map((item) =>
              routeMap[item] ? (
                <Link key={item} to={routeMap[item]}>
                  <motion.span
                    whileHover={{ y: -2, color: hoverColor }}
                    animate={{ color: textColor }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="text-[1rem] font-semibold tracking-tight cursor-pointer uppercase"
                    style={{ letterSpacing: "0.06em", fontSize: "0.82rem" }}
                  >
                    {item}
                  </motion.span>
                </Link>
              ) : (
                <motion.a
                  key={item}
                  href={item === "Home" ? "/" : `#${item.toLowerCase()}`}
                  whileHover={{ y: -2, color: hoverColor }}
                  animate={{ color: textColor }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="uppercase font-semibold"
                  style={{ letterSpacing: "0.06em", fontSize: "0.82rem" }}
                >
                  {item}
                </motion.a>
              )
            )}
          </nav>

          {/* Desktop Contact Button */}
          <motion.a
            href="#contact"
            animate={{
              borderColor: scrolled ? "#FFFF00" : "#0C0C0D",
            }}
            whileTap={{ scale: 0.97 }}
            className="hidden lg:block relative overflow-hidden px-5 py-2 border text-[0.78rem] font-bold uppercase group"
            style={{
              letterSpacing: "0.14em",
              borderRadius: "0px",
            }}
          >
            {/* Fill on hover */}
            <span
              className="absolute inset-0 origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-out"
              style={{ background: scrolled ? "#FFFF00" : "#0C0C0D" }}
            />
            <motion.span
              animate={{
                color: scrolled ? "#ffffff" : "#0C0C0D",
              }}
              className="relative z-10 transition-colors duration-200"
              style={{
                // on hover: flip
              }}
            >
              <span
                className="relative z-10"
                style={{
                  // Tailwind group-hover doesn't work well with motion.span, so we handle via CSS
                }}
              >
                Contact Us
              </span>
            </motion.span>

            {/* Hover text color swap via CSS */}
            <style>{`
              .contact-btn-text {
                color: ${scrolled ? "#ffffff" : "#0C0C0D"};
                transition: color 0.15s;
              }
              .group:hover .contact-btn-text {
                color: ${scrolled ? "#0C0C0D" : "#ffffff"};
              }
            `}</style>
          </motion.a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{ color: scrolled ? "#ffffff" : "#0C0C0D" }}
            className="lg:hidden p-2 z-50"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="lg:hidden absolute top-full left-0 right-0 backdrop-blur-xl border-t"
            style={{
              background: "#0C0C0D",
              borderColor: "rgba(255,255,255,0.08)",
            }}
          >
            <div className="flex flex-col items-center py-8 gap-6">
              {navItems.map((item) =>
                routeMap[item] ? (
                  <Link
                    key={item}
                    to={routeMap[item]}
                    onClick={() => setIsOpen(false)}
                    className="text-white font-semibold uppercase transition-colors hover:text-[#FFFF00]"
                    style={{ fontSize: "0.85rem", letterSpacing: "0.14em" }}
                  >
                    {item}
                  </Link>
                ) : (
                  <a
                    key={item}
                    href={item === "Home" ? "/" : `#${item.toLowerCase()}`}
                    onClick={() => setIsOpen(false)}
                    className="text-white font-semibold uppercase transition-colors hover:text-[#FFFF00]"
                    style={{ fontSize: "0.85rem", letterSpacing: "0.14em" }}
                  >
                    {item}
                  </a>
                )
              )}

              <a
                href="#contact"
                onClick={() => setIsOpen(false)}
                className="relative overflow-hidden px-6 py-3 border border-[#FFFF00] group mt-2 uppercase font-bold"
                style={{ fontSize: "0.75rem", letterSpacing: "0.18em" }}
              >
                <span className="absolute inset-0 bg-[#FFFF00] origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-out" />
                <span className="relative z-10 text-white group-hover:text-black transition-colors duration-150">
                  Contact Us
                </span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
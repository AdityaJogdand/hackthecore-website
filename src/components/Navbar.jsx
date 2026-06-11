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
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const navItems = ["Home", "About", "Events", "Hackathon"];

  const routeMap = {
    Events: "/events",
    Courses: "/courses",
    Hackathon: "/hackathon",
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{ fontFamily: "Barlow, sans-serif" }}
    >
      <motion.div
        initial={false}
        animate={{
          marginLeft: scrolled && isDesktop ? "3rem" : "0rem",
          marginRight: scrolled && isDesktop ? "3rem" : "0rem",
          marginTop: scrolled && isDesktop ? "0.75rem" : "0rem",
          borderRadius: scrolled && isDesktop ? "9999px" : "0px",
          backgroundColor: scrolled
            ? isDesktop
              ? "#ffffff"
              : "#1c1f1e"
            : "transparent",
          boxShadow: scrolled
            ? "0 4px 24px rgba(0,0,0,0.10)"
            : "0 0px 0px rgba(0,0,0,0)",
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-2 md:py-3">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src={htcLogo}
              alt="HackTheCore Logo"
              className={`w-auto object-contain transition-all duration-300 ${
                scrolled ? "h-12" : "h-16"
              }`}
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-8">
            {navItems.map((item) =>
              routeMap[item] ? (
                <Link key={item} to={routeMap[item]}>
                  <motion.span
                    whileHover={{
                      y: -2,
                      color: "#F4DD0E",
                    }}
                    transition={{
                      duration: 0.2,
                      ease: "easeOut",
                    }}
                    animate={{
                      color: scrolled ? "#111111" : "#ffffff",
                    }}
                    className="text-[1.05rem] font-medium tracking-tight cursor-pointer"
                  >
                    {item}
                  </motion.span>
                </Link>
              ) : (
                <motion.a
                  key={item}
                  href={item === "Home" ? "/" : `#${item.toLowerCase()}`}
                  whileHover={{
                    y: -2,
                    color: "#F4DD0E",
                  }}
                  transition={{
                    duration: 0.2,
                    ease: "easeOut",
                  }}
                  animate={{
                    color: scrolled ? "#111111" : "#ffffff",
                  }}
                  className="text-[1.05rem] font-medium tracking-tight"
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
              borderColor: scrolled ? "#111111" : "#F4DD0E",
            }}
            whileTap={{
              scale: 0.98,
            }}
            className="hidden lg:block relative overflow-hidden px-5 py-2 border text-[0.95rem] font-medium group"
            style={{
              borderRadius: scrolled ? "9999px" : "0px",
            }}
          >
            <span
              className={`absolute inset-0 origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-out ${
                scrolled ? "bg-black" : "bg-[#F4DD0E]"
              }`}
            />

            <span
              className={`relative z-10 transition-colors duration-200 ${
                scrolled
                  ? "text-black group-hover:text-white"
                  : "text-white group-hover:text-black"
              }`}
            >
              Contact Us
            </span>
          </motion.a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{ color: "#ffffff" }}
            className="lg:hidden p-2 z-50"
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -10,
            }}
            transition={{
              duration: 0.25,
              ease: "easeInOut",
            }}
            className="lg:hidden absolute top-full left-0 right-0 bg-[#1c1f1e]/95 backdrop-blur-xl border-t border-white/10"
          >
            <div className="flex flex-col items-center py-8 gap-6">
              {navItems.map((item) =>
                routeMap[item] ? (
                  <Link
                    key={item}
                    to={routeMap[item]}
                    onClick={() => setIsOpen(false)}
                    className="text-white text-lg font-medium transition-colors hover:text-[#F4DD0E]"
                  >
                    {item}
                  </Link>
                ) : (
                  <a
                    key={item}
                    href={item === "Home" ? "/" : `#${item.toLowerCase()}`}
                    onClick={() => setIsOpen(false)}
                    className="text-white text-lg font-medium transition-colors hover:text-[#F4DD0E]"
                  >
                    {item}
                  </a>
                )
              )}

              <a
                href="#contact"
                onClick={() => setIsOpen(false)}
                className="relative overflow-hidden px-6 py-3 border border-[#F4DD0E] group mt-2"
              >
                <span className="absolute inset-0 bg-[#F4DD0E] origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-out" />

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
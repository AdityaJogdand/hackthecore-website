import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, User as UserIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import htcLogo from "../assets/htc.png";
import { useAuth } from "../context/AuthContext";


const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const dropdownRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = ["Home", "About", "Events", "Merch"];
  const routeMap = {
    Events: "/events",
    About: "/aboutpage",
    Courses: "/courses",
    Merch: "/merchstore",
  };

  const textColor = scrolled ? "#ffffff" : "#0C0C0D";
  const hoverColor = "#FFFF00";

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{ fontFamily: "Barlow, sans-serif" }}
    >
      <motion.div
        initial={false}
        animate={{
          marginLeft: scrolled && isDesktop ? "2.5rem" : "0rem",
          marginRight: scrolled && isDesktop ? "2.5rem" : "0rem",
          marginTop: scrolled && isDesktop ? "0.65rem" : "0rem",
          borderRadius: scrolled && isDesktop ? "9999px" : "0px",
          backgroundColor: scrolled ? "#0C0C0D" : "#ffffff",
          boxShadow: scrolled
            ? "0 4px 32px rgba(0,0,0,0.18)"
            : "0 1px 0px rgba(0,0,0,0.08)",
        }}
        transition={{ duration: 0.38, ease: "easeInOut" }}
        style={{ overflow: "visible" }}
      >
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-2 md:py-3">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/">
              <img
                src={htcLogo}
                alt="HackTheCore Logo"
                className={`w-auto object-contain transition-all duration-300 ${scrolled ? "h-11" : "h-14"}`}
              />
            </Link>
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

          {/* Desktop Right Area */}
          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center justify-center w-10 h-10 rounded-full border-2 overflow-hidden transition-all duration-200 cursor-pointer focus:outline-none"
                  style={{ borderColor: scrolled ? "#FFFF00" : "#0C0C0D" }}
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white bg-neutral-800">
                      {getInitials(user.name)}
                    </div>
                  )}
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", zIndex: 100 }}
                      className="w-56 bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl py-2 text-white"
                    >
                      <div className="px-4 py-2 border-b border-neutral-800">
                        <p className="text-sm font-semibold truncate text-white">{user.name}</p>
                        <p className="text-xs text-neutral-400 truncate mt-0.5">{user.email}</p>
                      </div>
                      <Link
                        to="/courses"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
                      >
                        <UserIcon size={16} />
                        My Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-neutral-800 hover:text-red-300 transition-colors cursor-pointer text-left"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-[0.78rem] font-bold uppercase transition-all duration-200"
                  style={{ color: textColor, letterSpacing: "0.12em" }}
                >
                  Sign In
                </Link>
                <motion.a
                  href="#contact"
                  animate={{ borderColor: scrolled ? "#FFFF00" : "#0C0C0D" }}
                  whileTap={{ scale: 0.97 }}
                  className="relative overflow-hidden px-5 py-2 border text-[0.78rem] font-bold uppercase group"
                  style={{ letterSpacing: "0.14em", borderRadius: "0px" }}
                >
                  <span
                    className="absolute inset-0 origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-out"
                    style={{ background: scrolled ? "#FFFF00" : "#0C0C0D" }}
                  />
                  <span className="relative z-10 contact-btn-text">Contact Us</span>
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
              </div>
            )}
          </div>

          {/* Mobile Menu & Avatar Button */}
          <div className="lg:hidden flex items-center gap-3">
            {isAuthenticated && user && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center justify-center w-8 h-8 rounded-full border overflow-hidden cursor-pointer"
                  style={{ borderColor: scrolled ? "#FFFF00" : "#0C0C0D" }}
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-white bg-neutral-800">
                      {getInitials(user.name)}
                    </div>
                  )}
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", zIndex: 100 }}
                      className="w-48 bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl py-2 text-white"
                    >
                      <div className="px-4 py-2 border-b border-neutral-800">
                        <p className="text-xs font-semibold truncate text-white">{user.name}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-4 py-2 text-xs text-red-400 hover:bg-neutral-800 hover:text-red-300 transition-colors cursor-pointer text-left"
                      >
                        <LogOut size={14} />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              style={{ color: scrolled ? "#ffffff" : "#0C0C0D" }}
              className="p-2 z-50"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
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
            style={{ background: "#0C0C0D", borderColor: "rgba(255,255,255,0.08)" }}
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

              {!isAuthenticated && (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="text-white font-semibold uppercase transition-colors hover:text-[#FFFF00]"
                    style={{ fontSize: "0.85rem", letterSpacing: "0.14em" }}
                  >
                    Sign In
                  </Link>

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
                </>
              )}
            </div>
          </motion.div>
        )
        }
      </AnimatePresence >
    </header >
  );
};

export default Navbar;
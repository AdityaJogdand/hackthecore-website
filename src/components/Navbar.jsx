import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, User as UserIcon, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import black from "../assets/hackthecorelogo.png";
import white from "../assets/white.png";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const itemRefs = useRef([]);
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!scrolled) {
      setHovered(false);
      setActiveIndex(null);
    }
  }, [scrolled]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close the mobile menu automatically if the viewport grows back to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems = [
    { label: "Home", to: "/" },
    { label: "About", to: "/aboutpage" },
    { label: "Events", to: "/events" },
    { label: "Showcase", to: "/showcase" },
  ];

  const smoothEase = "cubic-bezier(0.22, 1, 0.36, 1)";
  const transition = `all 650ms ${smoothEase}`;

  const moveIndicator = (index) => {
    const el = itemRefs.current[index];
    const menu = menuRef.current;
    if (!el || !menu) return;
    const elRect = el.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();
    setIndicator({
      left: elRect.left - menuRect.left,
      width: elRect.width,
      opacity: 1,
    });
    setActiveIndex(index);
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate("/login");
  };

  // Shared avatar button — used in both pre-scroll and collapsed states
  const AvatarButton = ({ size = 44, ringColor }) => (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen((prev) => !prev)}
        className="flex items-center justify-center rounded-full border-2 overflow-hidden cursor-pointer focus:outline-none"
        style={{ width: size, height: size, borderColor: ringColor }}
      >
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white bg-neutral-800">
            {getInitials(user?.name)}
          </div>
        )}
      </button>

      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            style={{ position: "absolute", right: 0, top: "calc(100% + 10px)", zIndex: 100 }}
            className="w-56 bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl py-2 text-white"
          >
            <div className="px-4 py-2 border-b border-neutral-800">
              <p className="text-sm font-semibold truncate text-white">{user?.name}</p>
              <p className="text-xs text-neutral-400 truncate mt-0.5">{user?.email}</p>
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
  );

  return (
    <header className="fixed inset-0 z-50 pointer-events-none" style={{ fontFamily: "Barlow, sans-serif" }}>
      {/* ============ DESKTOP NAVBAR (md and up) ============ */}

      {/* Logo — pinned to the far top-left corner */}
      <div
        className="hidden md:block absolute top-3 left-8 pointer-events-auto"
        style={{
          opacity: scrolled ? 0 : 1,
          transform: scrolled ? "translate(0, -16px)" : "translate(0, 0)",
          pointerEvents: scrolled ? "none" : "auto",
          transition,
        }}
      >
        <Link to="/" className="flex items-center h-16">
          <img src={black} alt="HackTheCore Logo" className="h-9   w-auto object-contain" />
        </Link>
      </div>

      {/* Nav items — centered as their own group, same height as logo so text sits on the same vertical center */}
      <div
        className="hidden md:flex absolute top-3 left-1/2 items-center h-16 gap-16 pointer-events-auto"
        style={{
          transform: scrolled ? "translate(-50%, -16px)" : "translate(-50%, 0)",
          opacity: scrolled ? 0 : 1,
          pointerEvents: scrolled ? "none" : "auto",
          transition,
        }}
      >
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className="text-base font-semibold uppercase text-neutral-700"
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Avatar / Sign In — pinned to the far top-right corner, stays fixed with no scroll animation */}
      <div className="hidden md:flex absolute top-3 right-8 items-center h-16 pointer-events-auto">
        {isAuthenticated && user ? (
          <AvatarButton size={44} ringColor="#0C0C0D" />
        ) : (
          <Link
            to="/login"
            className="px-7 py-3 rounded-full bg-[#0C0C0D] text-white text-xs font-black uppercase tracking-[0.15em] transition-colors duration-300 hover:bg-neutral-700"
          >
            Sign In
          </Link>
        )}
      </div>

      {/* Collapsed pill + avatar — top-center to top-left */}
      <div
        className="hidden md:flex absolute items-center gap-3 pointer-events-none"
        style={{
          top: 16,
          left: scrolled ? 16 : "50%",
          transform: scrolled ? "translate(0, 0)" : "translate(-50%, 0)",
          opacity: scrolled ? 1 : 0,
          transition,
        }}
      >
        <div
          className="relative overflow-hidden rounded-full pointer-events-auto"
          style={{
            height: 64,
            width: hovered ? 510 : 64,
            background: "#0C0C0D",
            pointerEvents: scrolled ? "auto" : "none",
            transition: `width 450ms ${smoothEase}`,
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => {
            setHovered(false);
            setIndicator((prev) => ({ ...prev, opacity: 0 }));
          }}
        >
          <Link
            to="/"
            className="absolute flex items-center justify-center"
            style={{
              top: "50%",
              left: hovered ? 22 : "50%",
              transform: hovered ? "translate(0, -50%)" : "translate(-50%, -50%)",
              opacity: hovered ? 0 : 1,
              pointerEvents: hovered ? "none" : "auto",
              transition: `left 400ms ${smoothEase}, transform 400ms ${smoothEase}, opacity 250ms ${smoothEase}`,
              zIndex: hovered ? 1 : 2,
            }}
          >
            <img src={white} alt="HackTheCore Logo" className="h-8 w-auto object-contain" />
          </Link>

          <div
            ref={menuRef}
            className="relative flex h-full items-center gap-6 whitespace-nowrap px-6"
            style={{
              opacity: hovered ? 1 : 0,
              pointerEvents: hovered ? "auto" : "none",
              transition: `opacity 300ms ${smoothEase} ${hovered ? "150ms" : "0ms"}`,
              zIndex: hovered ? 2 : 1,
            }}
            onMouseLeave={() => setIndicator((prev) => ({ ...prev, opacity: 0 }))}
          >
            <div
              className="absolute rounded-full bg-[#FFFF00]"
              style={{
                top: "50%",
                left: indicator.left,
                width: indicator.width,
                height: 38,
                transform: "translateY(-50%)",
                opacity: indicator.opacity,
                transition: `left 350ms ${smoothEase}, width 350ms ${smoothEase}, opacity 200ms ${smoothEase}`,
                zIndex: 0,
              }}
            />
            {navItems.map((item, i) => (
              <Link
                key={item.label}
                to={item.to}
                ref={(el) => (itemRefs.current[i] = el)}
                onMouseEnter={() => moveIndicator(i)}
                className="relative px-5 py-2.5 text-sm font-bold uppercase transition-colors duration-200"
                style={{ zIndex: 1, color: activeIndex === i ? "#000" : "#d4d4d4" }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ============ MOBILE NAVBAR (below md) ============ */}

      {/* Mobile top bar — logo left, hamburger/close button right, always visible */}
      <div className="flex md:hidden absolute top-0 left-0 right-0 items-center justify-between px-5 py-3 pointer-events-auto bg-[#F7F8FA]/95 backdrop-blur-sm border-b border-neutral-200">
        <Link to="/" className="flex items-center h-10" onClick={() => setMobileMenuOpen(false)}>
          <img src={black} alt="HackTheCore Logo" className="h-9 w-auto object-contain" />
        </Link>

        <button
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-neutral-900 text-neutral-900"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="md:hidden absolute top-16 left-3 right-3 bg-white border border-neutral-200 rounded-2xl shadow-xl py-3 pointer-events-auto overflow-hidden"
          >
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-5 py-3 text-sm font-bold uppercase text-neutral-800 hover:bg-neutral-100 transition-colors"
              >
                {item.label}
              </Link>
            ))}

            <div className="border-t border-neutral-200 mt-2 pt-3 px-5 pb-1">
              {isAuthenticated && user ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-neutral-900 flex-shrink-0">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white bg-neutral-800">
                          {getInitials(user?.name)}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate text-neutral-900">{user?.name}</p>
                      <Link
                        to="/courses"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-xs text-neutral-500 hover:text-neutral-800 truncate block"
                      >
                        My Profile
                      </Link>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    aria-label="Sign out"
                    className="flex items-center justify-center w-9 h-9 rounded-full text-red-500 hover:bg-red-50 flex-shrink-0"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center w-full py-3 rounded-full text-[11px] font-black uppercase tracking-[0.15em] text-white bg-[#0C0C0D]"
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
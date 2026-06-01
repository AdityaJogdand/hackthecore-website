import React from "react";
import htcLogo from "../assets/htc.png";

const Navbar = () => {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{ fontFamily: "Barlow, sans-serif" }}
    >
      <div className="max-w-[1400px] mx-auto flex items-center h-20 px-8">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src={htcLogo}
            alt="HackTheCore Logo"
            className="h-14 w-auto object-contain"
          />

          <span
            className="text-black text-[1.9rem] uppercase leading-none"
            style={{
              fontFamily: "'Anton', sans-serif",
              letterSpacing: "0.05em",
            }}
          >
            HackTheCore
          </span>
        </div>

        {/* Contact Button */}
        <button
          className="ml-auto h-11 px-10 border-2 border-black text-black font-bold text-base whitespace-nowrap transition-all duration-300 hover:scale-[1.03]"
          style={{
            clipPath: "polygon(0 0, 100% 0, 85% 100%, 0 100%)",
            background: "transparent",
          }}
        >
          Contact Us
        </button>
      </div>
    </header>
  );
};

export default Navbar;
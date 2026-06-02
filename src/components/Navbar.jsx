import React from "react";
import htcLogo from "../assets/htc.png";

const Navbar = () => {
  const navItems = [
    "Home",
    "About",
    "Events",
    "Showcase",
    "Blog",
    "Contact",
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{ fontFamily: "Barlow, sans-serif" }}
    >
      <div className="flex items-center justify-between px-10 pt-4">
        {/* Logo */}
        <div className="flex items-center -mt-2">
          <img
            src={htcLogo}
            alt="HackTheCore Logo"
            className="h-20 w-auto object-contain"
          />
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-10 -mt-1">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="
                text-[1.1rem]
                font-medium
                text-[#F4DD0E]
                tracking-tight
                transition-all
                duration-300
                hover:opacity-60
              "
            >
              {item}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
"use client";

import { useState, useEffect } from "react";

export default function FloatingNav() {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const sections = ["home", "projects", "worked-for"];

    const handleScroll = () => {
      const sectionPositions = sections
        .map((id) => {
          const element = document.getElementById(id);
          if (!element) return null;
          const rect = element.getBoundingClientRect();
          return {
            id,
            top: rect.top + window.scrollY,
            bottom: rect.bottom + window.scrollY,
          };
        })
        .filter(Boolean);

      const currentScroll = window.scrollY + 200;

      for (let i = sectionPositions.length - 1; i >= 0; i--) {
        const section = sectionPositions[i];
        if (section && currentScroll >= section.top) {
          setActiveSection(section.id);
          return;
        }
      }

      setActiveSection("home");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navItems = [
    { id: "home", label: "About Me" },
    { id: "projects", label: "Projects" },
    { id: "worked-for", label: "Worked For" },
  ];

  return (
    <nav className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden md:block">
      <div className="flex flex-col gap-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className={`group relative transition-all duration-300 ${
              activeSection === item.id
                ? "text-purple-400"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
            aria-label={item.label}
          >
            <div
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeSection === item.id
                  ? "bg-purple-400 scale-125"
                  : "bg-zinc-600 group-hover:bg-zinc-400"
              }`}
            />
            <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 whitespace-nowrap text-sm font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/90 border border-zinc-800 px-3 py-1 rounded-md">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}

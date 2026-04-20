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
      <div className="flex flex-col gap-5">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className="group relative flex items-center justify-end"
            aria-label={item.label}
          >
            <span
              className="absolute right-5 whitespace-nowrap text-xs font-mono tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-2 py-1"
              style={{
                color: "var(--text-muted)",
                background: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              {item.label}
            </span>
            <div
              className="transition-all duration-300"
              style={{
                width: activeSection === item.id ? "20px" : "8px",
                height: "2px",
                background:
                  activeSection === item.id
                    ? "var(--accent)"
                    : "var(--border)",
              }}
            />
          </button>
        ))}
      </div>
    </nav>
  );
}

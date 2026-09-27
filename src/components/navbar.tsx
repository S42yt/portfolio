"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

const NAV_ITEMS = [
  { id: "home", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "worked-for", label: "Worked For" },
];

export default function FloatingNav() {
  const [activeSection, setActiveSection] = useState(NAV_ITEMS[0].id);
  const [indicator, setIndicator] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (mostVisible) setActiveSection(mostVisible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );

    NAV_ITEMS.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const measure = () => {
      const activeItem = listRef.current?.querySelector<HTMLElement>(
        '[data-active="true"]',
      );

      if (activeItem) {
        setIndicator({
          left: activeItem.offsetLeft,
          top: activeItem.offsetTop,
          width: activeItem.offsetWidth,
          height: activeItem.offsetHeight,
        });
      }
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeSection]);

  return (
    <nav
      aria-label="Section navigation"
      className="fixed inset-x-0 bottom-5 z-50 flex justify-center px-4 md:bottom-auto md:top-5"
    >
      <ul
        ref={listRef}
        data-glitch
        className="glass nav-bar relative flex items-center gap-1 rounded-[var(--radius-md)] p-1.5"
      >
        <span
          aria-hidden="true"
          className="nav-indicator"
          style={{
            width: `${indicator.width}px`,
            height: `${indicator.height}px`,
            transform: `translate(${indicator.left}px, ${indicator.top}px)`,
            opacity: indicator.width ? 1 : 0,
          }}
        />

        {NAV_ITEMS.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className="nav-link"
              data-active={activeSection === id}
              aria-current={activeSection === id ? "true" : undefined}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

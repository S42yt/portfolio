"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";

export default function HeroSection() {
  return (
    <div className="mb-16">
      <p
        className="text-xs tracking-[0.3em] uppercase font-mono mb-6"
        style={{ color: "var(--text-faint)" }}
      >
        Minecraft Server · German · Archived
      </p>

      <div className="flex items-end gap-4 mb-8 flex-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/icons/cutecraft-icon.png"
          alt="CuteCraft Logo"
          className="w-16 h-16 shrink-0 mb-1"
          onError={(e) => {
            e.currentTarget.src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23F3A5BE'/%3E%3Ctext x='32' y='40' font-family='monospace' font-size='18' fill='white' text-anchor='middle'%3ECC%3C/text%3E%3C/svg%3E";
          }}
        />
        <h1
          className="font-display font-black leading-[0.85] tracking-tight"
          style={{ fontSize: "clamp(4rem, 14vw, 10rem)", color: "var(--text)" }}
        >
          CuteCraft.
        </h1>
      </div>

      <div className="section-rule mb-8" />

      <p
        className="text-base md:text-lg leading-[1.75] font-mono font-light max-w-2xl mb-8"
        style={{ color: "var(--text-muted)" }}
      >
        A premium German Minecraft CityBuild network. I worked on the website,
        UI/UX design, and custom item designs.
      </p>

      <a
        href="https://cutecraft.net"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-mono transition-opacity duration-200 hover:opacity-60"
        style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}
      >
        <FontAwesomeIcon icon={faGlobe} className="w-4 h-4" />
        Visit Website ↗
      </a>
    </div>
  );
}

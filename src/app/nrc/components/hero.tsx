"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocket } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

export default function HeroSection() {
  return (
    <div className="mb-16">
      <p className="eyebrow mb-6">Minecraft Client · TypeScript · Kotlin</p>

      <h1
        className="font-display font-black leading-[0.85] tracking-tight mb-4 flex items-end gap-4 flex-wrap"
        style={{ fontSize: "clamp(4rem, 14vw, 10rem)", color: "var(--text)" }}
      >
        NoRisk
        <Image
          src="/icons/nrc.png"
          alt="NoRisk Client Logo"
          width={72}
          height={72}
          className="mb-2 shrink-0"
          onError={(e) => {
            e.currentTarget.src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='72' height='72' viewBox='0 0 72 72'%3E%3Crect width='72' height='72' fill='%2342D1CD'/%3E%3Ctext x='36' y='42' font-family='monospace' font-size='16' fill='white' text-anchor='middle'%3ENRC%3C/text%3E%3C/svg%3E";
          }}
        />
        Client.
      </h1>

      <div className="section-rule mb-8" />

      <p className="prose-body text-base md:text-lg max-w-2xl mb-8">
        A modern, feature-rich Minecraft client designed with performance and
        community in mind. Transparent development, server owner controls, and
        continuously improving features.
      </p>

      <div className="flex flex-wrap gap-3">
        <a
          href="https://norisk.gg"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          <FontAwesomeIcon icon={faRocket} className="w-4 h-4" />
          Download
        </a>
        <a
          href="https://docs.norisk.gg"
          target="_blank"
          rel="noopener noreferrer"
          className="btn"
        >
          Documentation ↗
        </a>
      </div>
    </div>
  );
}

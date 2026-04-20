"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

export default function Footer() {
  return (
    <footer className="relative z-10 py-8 px-6" id="footer">
      <div className="max-w-5xl mx-auto">
        <div
          className="mb-8"
          style={{ borderTop: "1px solid var(--border-subtle)" }}
        />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <span
            className="text-xs font-mono tracking-wide"
            style={{ color: "var(--text-faint)" }}
          >
            Musa Bostanci · 2025 -2026 Copyright © All rights reserved.
          </span>
          <div className="flex items-center gap-8">
            <a
              href="https://discord.gg/wtbcaw8AsT"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition-opacity duration-200 hover:opacity-60"
              style={{ color: "var(--text-muted)" }}
            >
              <FontAwesomeIcon icon={faDiscord} className="w-4 h-4" />
              <span className="text-sm font-mono">Discord</span>
            </a>

            <Link
              href="/contact"
              className="flex items-center gap-2 transition-opacity duration-200 hover:opacity-60"
              style={{ color: "var(--text-muted)" }}
            >
              <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4" />
              <span className="text-sm font-mono">Contact</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

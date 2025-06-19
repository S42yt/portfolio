"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

export default function Footer() {
  return (
    <footer className="relative z-10 py-8 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-center">
          <a
            href="https://discord.gg/PEaPfgB5uT"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-zinc-400 hover:text-blue-400 transition-colors duration-300 group"
          >
            <FontAwesomeIcon
              icon={faDiscord}
              className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
            />
            <span className="text-sm">Discord Server</span>
          </a>

          <div className="hidden sm:block w-px h-4 bg-zinc-800"></div>

          <Link
            href="/contact"
            className="flex items-center gap-2 text-zinc-400 hover:text-green-400 transition-colors duration-300 group"
          >
            <FontAwesomeIcon
              icon={faEnvelope}
              className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
            />
            <span className="text-sm">Contact</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}

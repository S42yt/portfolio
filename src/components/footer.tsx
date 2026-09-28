import Link from "next/link";
import Icon from "@/components/icon";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

export default function Footer() {
  return (
    <footer className="relative z-10 px-6 pt-8 pb-28 md:pb-10" id="footer">
      <div className="footer-inner max-w-5xl mx-auto" data-glitch>
        <div
          className="mb-6"
          style={{ borderTop: "1px solid var(--border)" }}
        />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            Musa Bostanci · 2025–2026 Copyright © All rights reserved.
          </span>
          <div className="flex items-center gap-2">
            <a
              href="https://discord.gg/wtbcaw8AsT"
              target="_blank"
              rel="noopener noreferrer"
              className="link-muted flex min-h-11 items-center gap-2 px-3 text-sm"
            >
              <Icon icon={faDiscord} className="h-4 w-4" />
              Discord
            </a>

            <Link
              href="/contact"
              className="link-muted flex min-h-11 items-center gap-2 px-3 text-sm"
            >
              <Icon icon={faEnvelope} className="h-4 w-4" />
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

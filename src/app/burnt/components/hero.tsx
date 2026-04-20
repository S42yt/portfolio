import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";

export default function HeroSection() {
  return (
    <div className="mb-16">
      <p
        className="text-xs tracking-[0.3em] uppercase font-mono mb-6"
        style={{ color: "var(--text-faint)" }}
      >
        Bio Page Platform · Web
      </p>

      <h1
        className="font-display font-black leading-[0.85] tracking-tight mb-8"
        style={{ fontSize: "clamp(4rem, 14vw, 10rem)", color: "var(--text)" }}
      >
        Burnt.net.
      </h1>

      <div className="section-rule mb-8" />

      <p
        className="text-base md:text-lg leading-[1.75] font-mono font-light max-w-2xl mb-8"
        style={{ color: "var(--text-muted)" }}
      >
        Create beautiful online profiles with deep Discord integration for
        gamers and streamers. One link — all your platforms.
      </p>

      <div className="flex flex-wrap gap-3">
        <a
          href="https://burnt.rip"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-mono transition-opacity duration-200 hover:opacity-80"
          style={{ background: "var(--accent)", color: "oklch(95% 0.006 285)" }}
        >
          <FontAwesomeIcon icon={faGlobe} className="w-4 h-4" />
          Visit Burnt.rip
        </a>
      </div>
    </div>
  );
}

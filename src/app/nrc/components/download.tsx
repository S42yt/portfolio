import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

export default function DownloadSection() {
  return (
    <div className="mb-16">
      <h2
        className="font-display font-black leading-none mb-4"
        style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", color: "var(--text)" }}
      >
        Get Started
      </h2>
      <div className="section-rule mb-6" />

      <p
        className="text-sm font-mono font-light mb-6"
        style={{ color: "var(--text-muted)" }}
      >
        Free to download · Regular updates · Community driven
      </p>

      <a
        href="https://norisk.gg"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-mono transition-opacity duration-200 hover:opacity-80"
        style={{ background: "var(--accent)", color: "oklch(95% 0.006 285)" }}
      >
        <FontAwesomeIcon icon={faDownload} className="w-4 h-4" />
        norisk.gg
      </a>
    </div>
  );
}

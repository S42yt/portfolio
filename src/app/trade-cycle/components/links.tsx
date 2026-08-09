import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

export default function ProjectLinksSection() {
  return (
    <div className="mb-16">
      <h2
        className="font-display font-black leading-none mb-4"
        style={{
          fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)",
          color: "var(--text)",
        }}
      >
        Project Links
      </h2>
      <div className="section-rule mb-6" />

      <a
        href="https://github.com/S42yt/TradeCycle"
        target="_blank"
        rel="noopener noreferrer"
        className="btn"
      >
        <FontAwesomeIcon icon={faGithub} className="w-4 h-4" />
        GitHub Repository
        <span style={{ color: "var(--text-faint)" }}>↗</span>
      </a>
    </div>
  );
}

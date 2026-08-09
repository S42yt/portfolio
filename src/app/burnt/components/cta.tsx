import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";

export default function CTASection() {
  return (
    <div className="mb-16">
      <h2
        className="font-display font-black leading-none mb-4"
        style={{
          fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)",
          color: "var(--text)",
        }}
      >
        Create Your Profile
      </h2>
      <div className="section-rule mb-6" />

      <p
        className="text-sm mb-6 max-w-md"
        style={{ color: "var(--text-muted)" }}
      >
        Join thousands of gamers and streamers who have already created their
        beautiful bio pages with Burnt.rip.
      </p>

      <a
        href="https://burnt.rip"
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-primary"
      >
        <FontAwesomeIcon icon={faGlobe} className="w-4 h-4" />
        Get Started
      </a>
    </div>
  );
}

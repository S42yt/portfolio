import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface Platform {
  name: string;
  icon: IconDefinition;
  color: string;
}

interface PlatformsSectionProps {
  platforms: Platform[];
}

export default function PlatformsSection({ platforms }: PlatformsSectionProps) {
  return (
    <div className="mb-16">
      <h2
        className="font-display font-black leading-none mb-4"
        style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", color: "var(--text)" }}
      >
        Supported Platforms
      </h2>
      <div className="section-rule mb-6" />

      <div className="flex flex-wrap gap-6">
        {platforms.map((platform, index) => (
          <div key={index} className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={platform.icon}
              className={`w-4 h-4 ${platform.color}`}
            />
            <span className="text-sm font-mono" style={{ color: "var(--text-muted)" }}>
              {platform.name}
            </span>
          </div>
        ))}
        <span className="text-sm font-mono" style={{ color: "var(--text-faint)" }}>
          + more
        </span>
      </div>
    </div>
  );
}

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faGithub } from "@fortawesome/free-brands-svg-icons";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";

const links = [
  { label: "Website", sub: "cutecraft.net", href: "https://shop.cutecraft.net", icon: faGlobe },
  { label: "Discord", sub: "Join the community", href: "https://discord.gg/cutecraft", icon: faDiscord },
  { label: "GitHub", sub: "Open source projects", href: "https://github.com/CuteCraft-Network", icon: faGithub },
];

export default function CommunityLinksSection() {
  return (
    <div className="mb-16">
      <h2
        className="font-display font-black leading-none mb-4"
        style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", color: "var(--text)" }}
      >
        Community
      </h2>
      <div className="section-rule mb-6" />

      <div className="space-y-0">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between py-4 transition-opacity duration-200 hover:opacity-60"
            style={{ borderBottom: "1px solid var(--border-subtle)" }}
          >
            <div className="flex items-center gap-3">
              <FontAwesomeIcon
                icon={link.icon}
                className="w-4 h-4"
                style={{ color: "var(--text-faint)" }}
              />
              <div>
                <span
                  className="text-sm font-mono font-medium"
                  style={{ color: "var(--text)" }}
                >
                  {link.label}
                </span>
                <span
                  className="text-xs font-mono ml-3"
                  style={{ color: "var(--text-faint)" }}
                >
                  {link.sub}
                </span>
              </div>
            </div>
            <span style={{ color: "var(--text-faint)" }}>↗</span>
          </a>
        ))}
      </div>
    </div>
  );
}

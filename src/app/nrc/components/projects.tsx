import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faBook } from "@fortawesome/free-solid-svg-icons";

const projects = [
  {
    title: "NoRisk Client Server API",
    description:
      "Enables server owners to interact with the NoRisk Client. Works with Velocity, BungeeCord, Paper, Spigot, and Fabric.",
    features: [
      "Show custom toasts and notifications",
      "Block or allow specific modules",
      "Create server-specific experiences",
    ],
    links: [
      { label: "GitHub", href: "https://github.com/NoRiskClient/nrc-server-api", icon: faGithub },
      { label: "Docs", href: "https://docs.norisk.gg", icon: faBook },
    ],
  },
  {
    title: "NoRisk Client Server Mappings",
    description:
      "Allows server owners to customize their server's appearance and behavior in the client without writing any code.",
    features: [
      "Set HD icons & backgrounds",
      "Define server gamemodes & socials",
      "Disable modules without coding",
    ],
    links: [
      { label: "GitHub", href: "https://github.com/NoRiskClient/nrc-server-mappings", icon: faGithub },
      { label: "Docs", href: "https://github.com/NoRiskClient/nrc-server-mappings/tree/main/docs", icon: faBook },
    ],
  },
];

export default function ProjectsSection() {
  return (
    <div className="mb-16">
      <h2
        className="font-display font-black leading-none mb-4"
        style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", color: "var(--text)" }}
      >
        Related Projects
      </h2>
      <div className="section-rule mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div
            key={project.title}
            className="p-5"
            style={{ border: "1px solid var(--border)" }}
          >
            <h3
              className="text-sm font-mono font-medium mb-3"
              style={{ color: "var(--text)" }}
            >
              {project.title}
            </h3>
            <p
              className="text-xs font-mono font-light leading-relaxed mb-4"
              style={{ color: "var(--text-muted)" }}
            >
              {project.description}
            </p>
            <ul className="space-y-1 mb-5">
              {project.features.map((f) => (
                <li
                  key={f}
                  className="text-xs font-mono"
                  style={{ color: "var(--text-faint)" }}
                >
                  · {f}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3">
              {project.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono transition-opacity duration-200 hover:opacity-60"
                  style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}
                >
                  <FontAwesomeIcon icon={link.icon} className="w-3 h-3" />
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

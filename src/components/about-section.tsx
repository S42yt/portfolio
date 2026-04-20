import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faGithub } from "@fortawesome/free-brands-svg-icons";

interface Skill {
  name: string;
  icon: string;
}

interface AboutSectionProps {
  skills: Skill[];
}

export default function AboutSection({ skills }: AboutSectionProps) {
  return (
    <section id="about" className="py-20">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-16">
          <h2
            className="font-display font-black leading-none mb-4"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", color: "var(--text)" }}
          >
            Currently Working On
          </h2>
          <div className="section-rule mb-6" />
          <p className="font-mono font-light" style={{ color: "var(--text-muted)" }}>
            Currently working on{" "}
            <a
              href="https://norisk.gg"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity duration-200 hover:opacity-70"
              style={{ color: "var(--accent)" }}
            >
              NoRisk Client
            </a>
          </p>
        </div>

        <div className="mb-16">
          <h2
            className="font-display font-black leading-none mb-4"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", color: "var(--text)" }}
          >
            Get In Touch
          </h2>
          <div className="section-rule mb-6" />
          <div className="flex flex-wrap gap-6">
            <a
              href="https://discord.com/users/787306646417571860"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-mono transition-opacity duration-200 hover:opacity-60"
              style={{ color: "var(--text-muted)" }}
            >
              <FontAwesomeIcon icon={faDiscord} className="w-4 h-4" />
              Discord
            </a>
            <a
              href="https://github.com/S42yt"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-mono transition-opacity duration-200 hover:opacity-60"
              style={{ color: "var(--text-muted)" }}
            >
              <FontAwesomeIcon icon={faGithub} className="w-4 h-4" />
              GitHub
            </a>
          </div>
        </div>

        <div className="mb-16">
          <h2
            className="font-display font-black leading-none mb-4"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", color: "var(--text)" }}
          >
            Stack
          </h2>
          <div className="section-rule mb-6" />
          <div className="flex flex-wrap gap-x-7 gap-y-4">
            {skills.map((skill) => (
              <div key={skill.name} className="flex items-center gap-2 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={skill.icon}
                  alt={skill.name}
                  className="w-4 h-4 object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-200"
                />
                <span
                  className="text-sm font-mono transition-colors duration-200"
                  style={{ color: "var(--text-muted)" }}
                >
                  {skill.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

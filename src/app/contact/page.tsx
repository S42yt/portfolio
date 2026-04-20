import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faGithub } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import BackHome from "@/components/back-home";

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 md:px-12 py-24">
      <p
        className="text-xs tracking-[0.3em] uppercase font-mono mb-6"
        style={{ color: "var(--text-faint)" }}
      >
        Contact
      </p>

      <h1
        className="font-display font-black leading-[0.85] tracking-tight mb-8"
        style={{ fontSize: "clamp(4rem, 12vw, 8rem)", color: "var(--text)" }}
      >
        Get In Touch.
      </h1>

      <div className="section-rule mb-8" />

      <div className="space-y-0">
        <a
          href="https://discord.com/users/787306646417571860"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between py-5 transition-opacity duration-200 hover:opacity-60"
          style={{ borderBottom: "1px solid var(--border-subtle)" }}
        >
          <div className="flex items-center gap-3">
            <FontAwesomeIcon
              icon={faDiscord}
              className="w-4 h-4"
              style={{ color: "var(--text-faint)" }}
            />
            <span className="text-sm font-mono" style={{ color: "var(--text)" }}>
              Discord
            </span>
          </div>
          <span style={{ color: "var(--text-faint)" }}>↗</span>
        </a>

        <a
          href="https://github.com/S42yt"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between py-5 transition-opacity duration-200 hover:opacity-60"
          style={{ borderBottom: "1px solid var(--border-subtle)" }}
        >
          <div className="flex items-center gap-3">
            <FontAwesomeIcon
              icon={faGithub}
              className="w-4 h-4"
              style={{ color: "var(--text-faint)" }}
            />
            <span className="text-sm font-mono" style={{ color: "var(--text)" }}>
              GitHub
            </span>
          </div>
          <span style={{ color: "var(--text-faint)" }}>↗</span>
        </a>

        <a
          href="mailto:songoku42@outlook.de?subject=Hello%20from%20your%20portfolio&body=Hi%20there,%0D%0A%0D%0AI%20found%20your%20portfolio%20and%20wanted%20to%20get%20in%20touch!"
          className="flex items-center justify-between py-5 transition-opacity duration-200 hover:opacity-60"
          style={{ borderBottom: "1px solid var(--border-subtle)" }}
        >
          <div className="flex items-center gap-3">
            <FontAwesomeIcon
              icon={faEnvelope}
              className="w-4 h-4"
              style={{ color: "var(--text-faint)" }}
            />
            <span className="text-sm font-mono" style={{ color: "var(--text)" }}>
              Email
            </span>
          </div>
          <span style={{ color: "var(--text-faint)" }}>↗</span>
        </a>
      </div>

      <BackHome />
    </div>
  );
}

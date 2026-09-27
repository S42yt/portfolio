import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faGithub } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import BackHome from "@/components/back-home";
import AeroWindow from "@/components/aero-window";

const CONTACT_LINKS = [
  {
    label: "Discord",
    icon: faDiscord,
    href: "https://discord.com/users/787306646417571860",
    external: true,
  },
  {
    label: "GitHub",
    icon: faGithub,
    href: "https://github.com/S42yt",
    external: true,
  },
  {
    label: "Email",
    icon: faEnvelope,
    href: "mailto:songoku42@outlook.de?subject=Hello%20from%20your%20portfolio&body=Hi%20there,%0D%0A%0D%0AI%20found%20your%20portfolio%20and%20wanted%20to%20get%20in%20touch!",
    external: false,
  },
];

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 md:px-12 py-24">
      <AeroWindow title="Contact - S42">
        <p className="eyebrow mb-6">Contact</p>

        <h1
          className="font-display font-black leading-[0.85] tracking-tight mb-8"
          style={{ fontSize: "clamp(4rem, 12vw, 8rem)", color: "var(--text)" }}
        >
          Get In Touch.
        </h1>

        <div className="section-rule mb-8" />

        <ul className="panel overflow-hidden">
          {CONTACT_LINKS.map((link, index) => (
            <li
              key={link.label}
              style={{
                borderTop: index === 0 ? undefined : "1px solid var(--border)",
              }}
            >
              <a
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="row-link flex min-h-14 items-center justify-between px-5 py-4"
              >
                <span className="flex items-center gap-3">
                  <FontAwesomeIcon
                    icon={link.icon}
                    className="w-4 h-4"
                    style={{ color: "var(--text-tertiary)" }}
                  />
                  <span className="text-sm" style={{ color: "var(--text)" }}>
                    {link.label}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="row-arrow"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>

        <BackHome />
      </AeroWindow>
    </div>
  );
}

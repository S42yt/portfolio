import Image from "next/image";

const contributions = [
  {
    emoji: "/emojis/kuromi_spin.gif",
    title: "Client Development",
    description:
      "Active development on the NoRisk Client itself, implementing community-requested features and improving overall user experience and performance.",
  },
  {
    emoji: "/emojis/kuromi_roll.gif",
    title: "Server API Development",
    description:
      "Created the NoRisk Client Server API that allows server owners to interact directly with the client, control modules, and much more.",
  },
  {
    emoji: "/emojis/kuromi_blush.gif",
    title: "Server Mappings (Pretty Servers)",
    description:
      "Developed the server mappings system that lets servers customize their appearance in the client, disable specific modules, and provide server-specific configurations.",
  },
  {
    emoji: "/emojis/kuromi_laugh.gif",
    title: "Documentation & Community",
    description:
      "Documentation creation and community support, ensuring developers and server owners have all the resources they need.",
  },
];

export default function ContributionsSection() {
  return (
    <div className="mb-16">
      <h2
        className="font-display font-black leading-none mb-4"
        style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", color: "var(--text)" }}
      >
        My Contributions
      </h2>
      <div className="section-rule mb-6" />

      <div className="space-y-0">
        {contributions.map((item) => (
          <div
            key={item.title}
            className="flex items-start gap-4 py-5"
            style={{ borderBottom: "1px solid var(--border-subtle)" }}
          >
            <Image
              src={item.emoji}
              alt=""
              width={20}
              height={20}
              className="shrink-0 mt-0.5"
            />
            <div>
              <h3
                className="text-sm font-mono font-medium mb-1"
                style={{ color: "var(--text)" }}
              >
                {item.title}
              </h3>
              <p
                className="text-sm font-mono font-light leading-relaxed"
                style={{ color: "var(--text-muted)" }}
              >
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

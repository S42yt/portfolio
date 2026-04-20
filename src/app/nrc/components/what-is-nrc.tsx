export default function WhatIsNRCSection() {
  return (
    <div className="mb-16">
      <h2
        className="font-display font-black leading-none mb-4"
        style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", color: "var(--text)" }}
      >
        What is NoRisk Client?
      </h2>
      <div className="section-rule mb-6" />

      <div className="space-y-4 font-mono font-light text-sm leading-[1.75]" style={{ color: "var(--text-muted)" }}>
        <p>
          NoRisk Client is a{" "}
          <span style={{ color: "var(--text)" }}>modern, feature-rich Minecraft client</span>{" "}
          designed with performance and user experience in mind.
        </p>
        <p>
          The client focuses on{" "}
          <span style={{ color: "var(--text)" }}>transparent development</span>{" "}
          and community-driven features, ensuring players get the functionality
          they need while server owners maintain full control over their networks.
        </p>
      </div>
    </div>
  );
}

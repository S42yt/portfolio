export default function FeaturesSection() {
  return (
    <div className="mb-16">
      <h2
        className="font-display font-black leading-none mb-4"
        style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", color: "var(--text)" }}
      >
        Features
      </h2>
      <div className="section-rule mb-6" />

      <div className="space-y-0">
        <div
          className="py-5"
          style={{ borderBottom: "1px solid var(--border-subtle)" }}
        >
          <h3
            className="font-mono font-medium mb-2"
            style={{ color: "var(--text)" }}
          >
            Press F (default)
          </h3>
          <p className="text-sm font-mono font-light leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Press the button associated with swapping items to your offhand. The
            cursor needs to be in the inventory due to Minecraft limitations.
          </p>
        </div>

        <div
          className="py-5"
          style={{ borderBottom: "1px solid var(--border-subtle)" }}
        >
          <h3
            className="font-mono font-medium mb-2"
            style={{ color: "var(--text)" }}
          >
            Shift Right Click
          </h3>
          <p className="text-sm font-mono font-light leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Shift right-click on the villager to cycle through trades. Disabled
            by default but can be enabled in config. Made with Bedrock and
            Geyser in mind.
          </p>
        </div>
      </div>

      <p
        className="text-xs font-mono mt-5"
        style={{ color: "var(--text-faint)" }}
      >
        Note: If a villager has no profession or has been traded with, cycling
        is unavailable.
      </p>
    </div>
  );
}

export default function TechnicalDetailsSection() {
  const details = [
    { label: "Language", value: "Kotlin" },
    { label: "Platforms", value: "Spigot, Paper" },
    { label: "Compatibility", value: "Java & Bedrock (via Geyser)" },
  ];

  return (
    <div className="mb-16">
      <h2
        className="font-display font-black leading-none mb-4"
        style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", color: "var(--text)" }}
      >
        Technical Details
      </h2>
      <div className="section-rule mb-6" />

      <div className="space-y-0">
        {details.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between py-4"
            style={{ borderBottom: "1px solid var(--border-subtle)" }}
          >
            <span
              className="text-xs tracking-[0.2em] uppercase font-mono"
              style={{ color: "var(--text-faint)" }}
            >
              {item.label}
            </span>
            <span className="text-sm font-mono" style={{ color: "var(--text-muted)" }}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

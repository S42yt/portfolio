export default function ConfigurationSection() {
  return (
    <div className="mb-16">
      <h2
        className="font-display font-black leading-none mb-4"
        style={{
          fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)",
          color: "var(--text)",
        }}
      >
        Configuration
      </h2>
      <div className="section-rule mb-6" />

      <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
        Choose which method (or both) should be used to cycle through trades:
      </p>

      <pre
        className="panel p-5 text-sm leading-relaxed"
        style={{ color: "var(--text-secondary)" }}
      >
        {`strategy:\n  - KEYBOARD\n# - SHIFT_INTERACT`}
      </pre>

      <p className="text-xs mt-4" style={{ color: "var(--text-faint)" }}>
        Prefix a method with &apos;#&apos; to disable it. SHIFT_INTERACT
        supports Bedrock via Geyser.
      </p>
    </div>
  );
}

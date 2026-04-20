const items = [
  { label: "SSL/TLS", value: "Secure data transfer" },
  { label: "GDPR", value: "Compliant data handling" },
  { label: "Tokens", value: "Secure token protection" },
];

export default function PrivacySecuritySection() {
  return (
    <div className="mb-16">
      <h2
        className="font-display font-black leading-none mb-4"
        style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", color: "var(--text)" }}
      >
        Privacy & Security
      </h2>
      <div className="section-rule mb-6" />

      <div className="space-y-0">
        {items.map((item) => (
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

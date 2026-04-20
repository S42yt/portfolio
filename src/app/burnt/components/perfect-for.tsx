const audiences = [
  {
    label: "Streamers & Gamers",
    description:
      "Showcase your channels, current games, and live streaming status all in one place.",
  },
  {
    label: "Communities",
    description:
      "Share your presence across multiple platforms in a stylish, simple way.",
  },
  {
    label: "Content Creators",
    description:
      "Replace multiple bio links with one beautiful, comprehensive profile page.",
  },
];

export default function PerfectForSection() {
  return (
    <div className="mb-16">
      <h2
        className="font-display font-black leading-none mb-4"
        style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", color: "var(--text)" }}
      >
        Perfect For
      </h2>
      <div className="section-rule mb-6" />

      <div className="space-y-0">
        {audiences.map((item) => (
          <div
            key={item.label}
            className="py-5"
            style={{ borderBottom: "1px solid var(--border-subtle)" }}
          >
            <h3
              className="text-sm font-mono font-medium mb-1"
              style={{ color: "var(--text)" }}
            >
              {item.label}
            </h3>
            <p
              className="text-sm font-mono font-light leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

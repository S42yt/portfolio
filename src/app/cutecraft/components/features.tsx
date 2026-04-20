interface Feature {
  title: string;
  description: string;
}

interface ServerFeaturesSectionProps {
  features: Feature[];
}

export default function ServerFeaturesSection({ features }: ServerFeaturesSectionProps) {
  return (
    <div className="mb-16">
      <h2
        className="font-display font-black leading-none mb-4"
        style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", color: "var(--text)" }}
      >
        Server Features
      </h2>
      <div className="section-rule mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="py-5 pr-6"
            style={{ borderBottom: "1px solid var(--border-subtle)" }}
          >
            <h3
              className="text-sm font-mono font-medium mb-1"
              style={{ color: "var(--text)" }}
            >
              {feature.title}
            </h3>
            <p
              className="text-xs font-mono font-light leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface Feature {
  icon: IconDefinition;
  title: string;
  description: string;
  color: string;
}

interface FeaturesSectionProps {
  features: Feature[];
}

export default function FeaturesSection({ features }: FeaturesSectionProps) {
  return (
    <div className="mb-16">
      <h2
        className="font-display font-black leading-none mb-4"
        style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", color: "var(--text)" }}
      >
        Key Features
      </h2>
      <div className="section-rule mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex items-start gap-4 py-5 pr-6"
            style={{ borderBottom: "1px solid var(--border-subtle)" }}
          >
            <FontAwesomeIcon
              icon={feature.icon}
              className={`w-4 h-4 shrink-0 mt-0.5 ${feature.color}`}
            />
            <div>
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
          </div>
        ))}
      </div>
    </div>
  );
}

import Icon from "@/components/icon";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";

interface Contribution {
  icon: IconDefinition;
  title: string;
  description: string;
  color: string;
}

interface MyRoleSectionProps {
  contributions: Contribution[];
}

export default function MyRoleSection({ contributions }: MyRoleSectionProps) {
  return (
    <div className="mb-16">
      <h2
        className="font-display font-black leading-none mb-4"
        style={{
          fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)",
          color: "var(--text)",
        }}
      >
        My Role
      </h2>
      <div className="section-rule mb-6" />

      <p
        className="text-sm mb-6 max-w-xl leading-[1.75]"
        style={{ color: "var(--text-muted)" }}
      >
        As a core member of the CuteCraft development team, I focus on web
        development and design across multiple areas.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {contributions.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-4 py-5 pr-6"
            style={{ borderBottom: "1px solid var(--border-subtle)" }}
          >
            <Icon
              icon={item.icon}
              className={`w-4 h-4 shrink-0 mt-0.5 ${item.color}`}
            />
            <div>
              <h3
                className="text-sm font-medium mb-1"
                style={{ color: "var(--text)" }}
              >
                {item.title}
              </h3>
              <p
                className="text-xs leading-relaxed"
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

interface Skill {
  name: string;
  icon: string;
}

interface SkillsSectionProps {
  skills: Skill[];
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  return (
    <div className="mb-4">
      <p
        className="text-xs tracking-[0.3em] uppercase font-mono mb-5"
        style={{ color: "var(--text-faint)" }}
      >
        Stack
      </p>
      <div className="flex flex-wrap gap-x-7 gap-y-4">
        {skills.map((skill) => (
          <div key={skill.name} className="flex items-center gap-2 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={skill.icon}
              alt={skill.name}
              className="w-4 h-4 object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-200"
            />
            <span
              className="text-sm font-mono transition-colors duration-200 group-hover:text-[oklch(72%_0.014_285)]"
              style={{ color: "var(--text-muted)" }}
            >
              {skill.name}
            </span>
          </div>
        ))}
        <span className="text-sm font-mono" style={{ color: "var(--text-faint)" }}>
          + more
        </span>
      </div>
    </div>
  );
}

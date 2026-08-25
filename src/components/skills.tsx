import { CSSProperties } from "react";

interface Skill {
  name: string;
  icon: string;
}

interface SkillsSectionProps {
  skills: Skill[];
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  return (
    <div data-gsap="chips">
      <p className="eyebrow mb-5">Stack</p>
      <ul className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <li
            key={skill.name}
            className="chip"
            style={{ "--chip-index": index } as CSSProperties}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={skill.icon}
              alt=""
              aria-hidden="true"
              className="w-4 h-4 object-contain"
            />
            {skill.name}
          </li>
        ))}
        <li
          className="inline-flex items-center px-3.5 py-2 text-sm"
          style={{ color: "var(--text-tertiary)" }}
        >
          + more
        </li>
      </ul>
    </div>
  );
}

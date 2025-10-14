interface Skill {
  name: string;
  icon: string;
}

interface SkillsSectionProps {
  skills: Skill[];
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  return (
    <div className="mb-16">
      <div className="relative p-6 bg-black border border-zinc-800 overflow-hidden transition-all duration-300 hover:border-zinc-700 group">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 via-transparent to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="relative z-10">
          <h2 className="text-2xl font-medium text-white mb-6 text-center">
            My Skills
          </h2>

          <div className="grid grid-cols-4 md:grid-cols-8 gap-6 mb-6">
            {skills.map((skill, index) => (
              <div
                key={skill.name}
                className="flex flex-col items-center group/skill"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 mb-2 flex items-center justify-center bg-zinc-900 rounded-lg border border-zinc-800 group-hover/skill:border-zinc-600 transition-all duration-300 group-hover/skill:scale-110">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={skill.icon}
                    alt={skill.name}
                    className="w-8 h-8 object-contain filter brightness-90 group-hover/skill:brightness-110 transition-all duration-300"
                  />
                </div>
                <span className="text-xs text-zinc-400 group-hover/skill:text-white transition-colors duration-300 text-center">
                  {skill.name}
                </span>
              </div>
            ))}
          </div>

          <p className="text-center text-zinc-400 text-sm">and much more...</p>
        </div>
      </div>
    </div>
  );
}

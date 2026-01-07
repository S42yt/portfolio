import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocket, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faDiscord, faGithub } from "@fortawesome/free-brands-svg-icons";

interface Skill {
  name: string;
  icon: string;
}

interface AboutSectionProps {
  skills: Skill[];
}

export default function AboutSection({ skills }: AboutSectionProps) {
  return (
    <section id="about" className="py-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Currently Working On */}
        <div className="mb-16">
          <div className="relative p-6 bg-black border border-zinc-800 overflow-hidden transition-all duration-300 hover:border-zinc-700 group">
            <div className="absolute inset-0 bg-linear-to-br from-purple-600/10 via-transparent to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <FontAwesomeIcon
                  icon={faRocket}
                  className="w-6 h-6 text-purple-400"
                />
                <h2 className="text-2xl font-medium text-white">
                  Currently Working On
                </h2>
              </div>

              <div className="space-y-3 text-zinc-300">
                <div className="flex items-center gap-2">
                  <span className="text-green-400">🔭</span>
                  <span>I&apos;m currently working on </span>
                  <a
                    href="https://norisk.gg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors duration-300 underline"
                  >
                    NoRisk Client
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Get In Touch */}
        <div className="mb-16">
          <div className="relative p-6 bg-black border border-zinc-800 overflow-hidden transition-all duration-300 hover:border-zinc-700 group">
            <div className="absolute inset-0 bg-linear-to-br from-green-600/10 via-transparent to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="w-6 h-6 text-green-400"
                />
                <h2 className="text-2xl font-medium text-white">Get In Touch</h2>
              </div>

              <div className="flex flex-wrap gap-4">
                <a
                  href="https://discord.com/users/787306646417571860"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-zinc-400 hover:text-blue-400 transition-colors duration-300 group/link"
                >
                  <FontAwesomeIcon
                    icon={faDiscord}
                    className="w-5 h-5 group-hover/link:scale-110 transition-transform duration-300"
                  />
                  <span>Discord</span>
                </a>

                <a
                  href="https://github.com/S42yt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-zinc-400 hover:text-gray-300 transition-colors duration-300 group/link"
                >
                  <FontAwesomeIcon
                    icon={faGithub}
                    className="w-5 h-5 group-hover/link:scale-110 transition-transform duration-300"
                  />
                  <span>GitHub</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-16">
          <div className="relative p-6 bg-black border border-zinc-800 overflow-hidden transition-all duration-300 hover:border-zinc-700 group">
            <div className="absolute inset-0 bg-linear-to-br from-cyan-600/10 via-transparent to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

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
                    <div className="w-12 h-12 mb-2 flex items-center justify-center bg-zinc-900 border border-zinc-800 group-hover/skill:border-zinc-600 transition-all duration-300 group-hover/skill:scale-110">
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
      </div>
    </section>
  );
}

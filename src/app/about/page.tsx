"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faGithub } from "@fortawesome/free-brands-svg-icons";
import { faRocket, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import BackHome from "@/components/backHome";

export default function AboutPage() {
  const skills = [
    {
      name: "C",
      icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/c/c-original.svg",
    },
    {
      name: "TypeScript",
      icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg",
    },
    {
      name: "Next.js",
      icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original.svg",
    },
    {
      name: "Astro",
      icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/astro/astro-original.svg",
    },
    {
      name: "C#",
      icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/csharp/csharp-original.svg",
    },
    {
      name: "Rust",
      icon: "https://raw.githubusercontent.com/devicons/devicon/refs/heads/master/icons/rust/rust-original.svg",
    },
    {
      name: "Go",
      icon: "https://raw.githubusercontent.com/devicons/devicon/refs/heads/master/icons/go/go-original-wordmark.svg",
    },
    {
      name: "Kotlin",
      icon: "https://raw.githubusercontent.com/devicons/devicon/refs/heads/master/icons/kotlin/kotlin-original.svg",
    },
  ];

  return (
    <div className="min-h-screen py-20 noise-overlay">
      <div className="max-w-4xl mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 blur-3xl opacity-30 animate-pulse"></div>

          <div className="relative z-10">
            <h1 className="text-4xl md:text-6xl font-light text-white mb-4 tracking-tight font-mono">
              Hi there 👋, I&apos;m S42
            </h1>
            <p className="text-xl md:text-2xl text-zinc-400 font-light leading-relaxed font-mono max-w-3xl mx-auto">
              I&apos;m a developer with a focus on UI/UX and creating beautiful
              applications.
            </p>
          </div>
        </div>

        <div className="mb-16">
          <div className="relative p-6 bg-black border border-zinc-800 overflow-hidden transition-all duration-300 hover:border-zinc-700 group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

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
                  <span>Building </span>
                  <a
                    href="https://discord.gg/cutecraft"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors duration-300 underline"
                  >
                    CuteCraft.net
                  </a>
                  <span> and developing a plugin network for Minecraft</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <div className="relative p-6 bg-black border border-zinc-800 overflow-hidden transition-all duration-300 hover:border-zinc-700 group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 via-transparent to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="w-6 h-6 text-green-400"
                />
                <h2 className="text-2xl font-medium text-white">
                  Get In Touch
                </h2>
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

              <p className="text-center text-zinc-400 text-sm">
                and much more...
              </p>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <div className="relative p-6 bg-black border border-zinc-800 overflow-hidden transition-all duration-300 hover:border-zinc-700 group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative z-10">
              <h2 className="text-2xl font-medium text-white mb-6 text-center">
                GitHub Stats
              </h2>

              <div className="flex flex-col lg:flex-row gap-6 items-center justify-center">
                <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800 hover:border-zinc-700 transition-colors duration-300">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://github-readme-stats.vercel.app/api?username=S42yt&show_icons=true&theme=transparent&hide_border=true&title_color=ffffff&text_color=a1a1aa&icon_color=3b82f6"
                    alt="GitHub Stats"
                    className="max-w-full h-auto"
                  />
                </div>

                <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800 hover:border-zinc-700 transition-colors duration-300">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://github-readme-stats.vercel.app/api/top-langs/?username=S42yt&layout=compact&theme=transparent&hide_border=true&title_color=ffffff&text_color=a1a1aa"
                    alt="Top Languages"
                    className="max-w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <BackHome />
      </div>
    </div>
  );
}

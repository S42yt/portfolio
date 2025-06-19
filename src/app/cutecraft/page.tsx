"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faGithub } from "@fortawesome/free-brands-svg-icons";
import {
  faGlobe,
  faCode,
  faPalette,
  faServer,
  faUsers,
  faGamepad,
} from "@fortawesome/free-solid-svg-icons";
import BackHome from "@/components/backHome";

export default function CuteCraftPage() {
  const myContributions = [
    {
      icon: faCode,
      title: "Website Development",
      description:
        "Building and maintaining the main CuteCraft website with modern web technologies like Next.js and Astro.js",
      color: "text-blue-400",
    },
    {
      icon: faPalette,
      title: "UI/UX Design",
      description: "Designing beautiful user interfaces with custom textures",
      color: "text-pink-400",
    },
    {
      icon: faGamepad,
      title: "Item Designs",
      description:
        "Creating custom item designs and models for the Minecraft server",
      color: "text-purple-400",
    },
  ];

  const features = [
    {
      title: "🏗️ CityBuild Gameplay",
      description:
        "Build your own houses, deal with other players, make your plot bigger and more unique and find new friends!",
    },
    {
      title: "🇩🇪 German Community",
      description: "A welcoming German-speaking community with helpful staff",
    },
    {
      title: "⚡ Modern Infrastructure",
      description:
        "High-performance servers with custom plugins and using velocity as a proxy",
    },
    {
      title: "🎨 Custom Content",
      description:
        "Unique items, textures, and features designed specifically for CuteCraft",
    },
  ];

  return (
    <div className="min-h-screen py-20 noise-overlay">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-600/20 via-purple-600/20 to-cyan-600/20 blur-3xl opacity-30 animate-pulse"></div>

          <div className="relative z-10">
            <div className="mb-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/icons/cutecraft-icon.png"
                alt="CuteCraft Logo"
                className="w-24 h-24 mx-auto mb-6 rounded-lg shadow-lg"
                onError={(e) => {
                  e.currentTarget.src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'%3E%3Crect width='96' height='96' fill='%23F3A5BE' rx='12'/%3E%3Ctext x='48' y='58' font-family='monospace' font-size='32' fill='white' text-anchor='middle'%3ECC%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>

            <h1 className="text-4xl md:text-6xl font-light text-white mb-4 tracking-tight font-mono">
              CuteCraft
            </h1>
            <p className="text-xl md:text-2xl text-zinc-400 font-light leading-relaxed font-mono max-w-3xl mx-auto mb-6">
              German Minecraft CityBuild Network
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <span className="px-4 py-2 bg-pink-600/20 border border-pink-600/50 rounded-full text-pink-300 text-sm font-medium">
                🎮 Minecraft
              </span>
              <span className="px-4 py-2 bg-purple-600/20 border border-purple-600/50 rounded-full text-purple-300 text-sm font-medium">
                🏗️ CityBuild
              </span>
              <span className="px-4 py-2 bg-cyan-600/20 border border-cyan-600/50 rounded-full text-cyan-300 text-sm font-medium">
                🇩🇪 German
              </span>
            </div>

            <a
              href="https://cutecraft.net"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:from-pink-500 hover:to-purple-500 transition-all duration-300 font-medium"
            >
              <FontAwesomeIcon icon={faGlobe} className="w-5 h-5" />
              Visit Website
            </a>
          </div>
        </div>

        <div className="mb-16">
          <div className="relative p-6 bg-black border border-zinc-800 overflow-hidden transition-all duration-300 hover:border-zinc-700 group">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-600/10 via-transparent to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <FontAwesomeIcon
                  icon={faServer}
                  className="w-6 h-6 text-pink-400"
                />
                <h2 className="text-2xl font-medium text-white">
                  What is CuteCraft?
                </h2>
              </div>

              <div className="space-y-4 text-zinc-300">
                <p>
                  <strong className="text-white">CuteCraft</strong> is a premium
                  German Minecraft CityBuild network that provides players with
                  an exceptional CityBuild experience. Our server feature
                  custom-designed gameplay mechanics, unique items, and a
                  thriving community.
                </p>
                <p>
                  Whether you&apos;re a casual player or a more professional
                  player, CuteCraft offers something for everyone community
                  events, and active German-speaking playerbase.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <div className="relative p-6 bg-black border border-zinc-800 overflow-hidden transition-all duration-300 hover:border-zinc-700 group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative z-10">
              <h2 className="text-2xl font-medium text-white mb-8 text-center">
                Server Features
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:border-zinc-600 transition-all duration-300"
                  >
                    <h3 className="font-medium text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <div className="relative p-6 bg-black border border-zinc-800 overflow-hidden transition-all duration-300 hover:border-zinc-700 group">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 via-transparent to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <FontAwesomeIcon
                  icon={faUsers}
                  className="w-6 h-6 text-cyan-400"
                />
                <h2 className="text-2xl font-medium text-white">
                  My Role at CuteCraft
                </h2>
              </div>

              <div className="space-y-4 text-zinc-300 mb-8">
                <p>
                  As a core member of the CuteCraft development team, I focus
                  primarily on the
                  <strong className="text-white">
                    {" "}
                    web development
                  </strong> and{" "}
                  <strong className="text-white">design aspects</strong> of the
                  network. My work spans across multiple areas to ensure players
                  have the best possible experience both in-game and on our web
                  platforms.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myContributions.map((contribution, index) => (
                  <div
                    key={index}
                    className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:border-zinc-600 transition-all duration-300 group/item"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <FontAwesomeIcon
                        icon={contribution.icon}
                        className={`w-6 h-6 ${contribution.color} group-hover/item:scale-110 transition-transform duration-300`}
                      />
                      <h3 className="font-medium text-white">
                        {contribution.title}
                      </h3>
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {contribution.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Technologies Used */}
        <div className="mb-16">
          <div className="relative p-6 bg-black border border-zinc-800 overflow-hidden transition-all duration-300 hover:border-zinc-700 group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 via-transparent to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative z-10">
              <h2 className="text-2xl font-medium text-white mb-6 text-center">
                Technologies & Tools
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                  <h3 className="font-medium text-white mb-2">Frontend</h3>
                  <p className="text-sm text-zinc-400">Next.js, Astro.js</p>
                </div>

                <div className="text-center p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                  <h3 className="font-medium text-white mb-2">Design</h3>
                  <p className="text-sm text-zinc-400">Aseprite, Figma</p>
                </div>

                <div className="text-center p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                  <h3 className="font-medium text-white mb-2">Minecraft</h3>
                  <p className="text-sm text-zinc-400">Java Plugins, Paper</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <div className="relative p-6 bg-black border border-zinc-800 overflow-hidden transition-all duration-300 hover:border-zinc-700 group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative z-10">
              <h2 className="text-2xl font-medium text-white mb-6 text-center">
                Join the Community
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a
                  href="https://shop.cutecraft.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:border-zinc-600 transition-all duration-300 group/link"
                >
                  <FontAwesomeIcon
                    icon={faGlobe}
                    className="w-6 h-6 text-pink-400 group-hover/link:scale-110 transition-transform duration-300"
                  />
                  <div>
                    <h3 className="font-medium text-white">Main Website</h3>
                    <p className="text-sm text-zinc-400">cutecraft.net</p>
                  </div>
                </a>

                <a
                  href="https://discord.gg/cutecraft"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:border-zinc-600 transition-all duration-300 group/link"
                >
                  <FontAwesomeIcon
                    icon={faDiscord}
                    className="w-6 h-6 text-indigo-400 group-hover/link:scale-110 transition-transform duration-300"
                  />
                  <div>
                    <h3 className="font-medium text-white">Discord Server</h3>
                    <p className="text-sm text-zinc-400">Join our community</p>
                  </div>
                </a>

                <a
                  href="https://github.com/CuteCraft-Network"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:border-zinc-600 transition-all duration-300 group/link"
                >
                  <FontAwesomeIcon
                    icon={faGithub}
                    className="w-6 h-6 text-zinc-400 group-hover/link:text-white transition-colors duration-300"
                  />
                  <div>
                    <h3 className="font-medium text-white">GitHub</h3>
                    <p className="text-sm text-zinc-400">
                      Open source projects
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <div className="relative p-6 bg-black border border-zinc-800 overflow-hidden transition-all duration-300 hover:border-zinc-700 group">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 via-transparent to-yellow-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative z-10">
              <h2 className="text-2xl font-medium text-white mb-6 text-center">
                Server Information
              </h2>

              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 text-center">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-white mb-2">Server IP</h3>
                    <code className="text-lg font-mono text-cyan-400 bg-zinc-800 px-3 py-1 rounded">
                      cutecraft.net
                    </code>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div>
                      <h4 className="font-medium text-white mb-1">Version</h4>
                      <p className="text-sm text-zinc-400">1.21.5</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-white mb-1">Game Mode</h4>
                      <p className="text-sm text-zinc-400">CityBuild</p>
                    </div>
                  </div>
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

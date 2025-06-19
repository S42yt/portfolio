"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import {
  faDownload,
  faBook,
  faCog,
  faUsers,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import BackHome from "@/components/backHome";

export default function TradeCyclePage() {
  const downloads = [
    {
      name: "Spigot",
      url: "https://www.spigotmc.org/resources/tradecycle.122805/",
      description: "Spigot Version",
    },
    {
      name: "Modrinth",
      url: "https://modrinth.com/plugin/tradecycle",
      description: "Paper and Spigot Version",
    },
    {
      name: "Hangar",
      url: "https://hangar.papermc.io/S42yt/TradeCycle",
      description: "Paper Version",
    },
    {
      name: "CurseForge",
      url: "https://www.curseforge.com/minecraft/bukkit-plugins/tradecycle",
      description: "Paper Version",
    },
    {
      name: "GitHub Releases",
      url: "https://github.com/CuteCraft-Network/TradeCycle/releases/latest",
      description: "Paper and Spigot Version",
    },
  ];

  return (
    <div className="min-h-screen py-20 noise-overlay">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 via-emerald-600/20 to-teal-600/20 blur-3xl opacity-30 animate-pulse"></div>

          <div className="relative z-10">
            <h1 className="text-4xl md:text-6xl font-light text-white mb-4 tracking-tight font-mono">
              TradeCycle
            </h1>
            <p className="text-xl md:text-2xl text-zinc-400 font-light leading-relaxed font-mono max-w-3xl mx-auto mb-6">
              A multiplatform plugin written in Kotlin to cycle through Villager
              trades from UI
            </p>

            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://img.shields.io/github/workflow/status/S42YT/TradeCycle/Java%20CI%20with%20Gradle?style=for-the-badge"
                alt="Build Status"
                className="h-7"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://img.shields.io/github/v/release/S42YT/TradeCycle?style=for-the-badge"
                alt="GitHub Release"
                className="h-7"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://img.shields.io/spiget/downloads/122805?label=spigot%20downloads&style=for-the-badge&color=ee8917"
                alt="Spigot Downloads"
                className="h-7"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://img.shields.io/modrinth/dt/tradecycle?label=modrinth%20downloads&style=for-the-badge&color=5da545"
                alt="Modrinth Downloads"
                className="h-7"
              />
            </div>

            <p className="text-zinc-400">
              Inspired by{" "}
              <a
                href="https://modrinth.com/user/henkelmax"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                henkelmax
              </a>
              &apos;s mod{" "}
              <a
                href="https://modrinth.com/mod/trade-cycling"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Trade Cycling
              </a>
            </p>
          </div>
        </div>

        <div className="mb-16">
          <div className="relative p-6 bg-black border border-zinc-800 overflow-hidden transition-all duration-300 hover:border-zinc-700 group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 via-transparent to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative z-10">
              <h2 className="text-2xl font-medium text-white mb-6 text-center">
                Plugin Demo
              </h2>
              <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800 hover:border-zinc-700 transition-colors duration-300">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://raw.githubusercontent.com/CuteCraft-Network/TradeCycle/refs/heads/master/assets/cycle_success.gif"
                  alt="TradeCycle Plugin Demo"
                  className="w-full max-w-md mx-auto rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='300' viewBox='0 0 500 300'%3E%3Crect width='500' height='300' fill='%23111827'/%3E%3Ctext x='250' y='150' font-family='monospace' font-size='18' fill='%236B7280' text-anchor='middle' dy='0.35em'%3ETradeCycle Demo%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <div className="relative p-6 bg-black border border-zinc-800 overflow-hidden transition-all duration-300 hover:border-zinc-700 group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <FontAwesomeIcon
                  icon={faBook}
                  className="w-6 h-6 text-blue-400"
                />
                <h2 className="text-2xl font-medium text-white">Features</h2>
              </div>

              <div className="space-y-6 text-zinc-300">
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">
                    Two Methods to Cycle Trades:
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-zinc-900/30 rounded-lg border border-zinc-800">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0"
                      />
                      <div>
                        <h4 className="font-medium text-white mb-1">
                          Press F (default)
                        </h4>
                        <p className="text-sm text-zinc-400">
                          Press the button associated with swapping items to
                          your offhand.{" "}
                          <span className="text-yellow-400">Important:</span>{" "}
                          The cursor needs to be in the inventory due to
                          Minecraft limitations.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-zinc-900/30 rounded-lg border border-zinc-800">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0"
                      />
                      <div>
                        <h4 className="font-medium text-white mb-1">
                          Shift Right Click
                        </h4>
                        <p className="text-sm text-zinc-400">
                          Shift right-click on the villager to cycle through
                          trades. This variant is disabled by default but can be
                          enabled in the config. Made with Bedrock and Geyser in
                          mind.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
                  <p className="text-yellow-300 text-sm">
                    <strong>🚨 Note:</strong> If a villager has no profession or
                    has been traded with, you cannot cycle through trades.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <div className="relative p-6 bg-black border border-zinc-800 overflow-hidden transition-all duration-300 hover:border-zinc-700 group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <FontAwesomeIcon
                  icon={faCog}
                  className="w-6 h-6 text-purple-400"
                />
                <h2 className="text-2xl font-medium text-white">
                  Configuration
                </h2>
              </div>

              <div className="space-y-4">
                <p className="text-zinc-300">
                  You can configure which method (or both) should be used to
                  cycle through trades:
                </p>

                <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 font-mono text-sm">
                  <pre className="text-zinc-300">
                    {`strategy:
  - KEYBOARD
# - SHIFT_INTERACT`}
                  </pre>
                </div>

                <p className="text-zinc-400 text-sm">
                  &apos;#&apos; in front of a method will disable it. The
                  SHIFT_INTERACT was made with Bedrock and Geyser in mind so you
                  can also cycle trades on the bedrock edition.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Download Section */}
        <div className="mb-16">
          <div className="relative p-6 bg-black border border-zinc-800 overflow-hidden transition-all duration-300 hover:border-zinc-700 group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 via-transparent to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <FontAwesomeIcon
                  icon={faDownload}
                  className="w-6 h-6 text-emerald-400"
                />
                <h2 className="text-2xl font-medium text-white">Download</h2>
              </div>

              <p className="text-zinc-300 mb-6">
                You can download the plugin from the following sources:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {downloads.map((download, index) => (
                  <a
                    key={index}
                    href={download.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:border-zinc-600 transition-all duration-300 group/link"
                  >
                    <FontAwesomeIcon
                      icon={faDownload}
                      className="w-5 h-5 text-emerald-400 group-hover/link:scale-110 transition-transform duration-300"
                    />
                    <div>
                      <h3 className="font-medium text-white">
                        {download.name}
                      </h3>
                      <p className="text-sm text-zinc-400">
                        {download.description}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <div className="relative p-6 bg-black border border-zinc-800 overflow-hidden transition-all duration-300 hover:border-zinc-700 group">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-600/10 via-transparent to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <FontAwesomeIcon
                  icon={faUsers}
                  className="w-6 h-6 text-pink-400"
                />
                <h2 className="text-2xl font-medium text-white">
                  Contributing 🩷
                </h2>
              </div>

              <div className="space-y-4 text-zinc-300">
                <p>
                  Feel free to open an issue or a pull request, I will be happy
                  to help you!
                </p>

                <div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    Special thanks to contributors:
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-zinc-400">
                    <li>
                      <a
                        href="https://github.com/tamikaschu"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Tamikaschu
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <div className="relative p-6 bg-black border border-zinc-800 overflow-hidden transition-all duration-300 hover:border-zinc-700 group">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 via-transparent to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative z-10">
              <h2 className="text-2xl font-medium text-white mb-6 text-center">
                Project Links
              </h2>

              <div className="flex justify-center">
                <a
                  href="https://github.com/CuteCraft-Network/TradeCycle"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:border-zinc-600 transition-all duration-300 group/link max-w-md"
                >
                  <FontAwesomeIcon
                    icon={faGithub}
                    className="w-6 h-6 text-zinc-400 group-hover/link:text-white transition-colors duration-300"
                  />
                  <div>
                    <h3 className="font-medium text-white">
                      GitHub Repository
                    </h3>
                    <p className="text-sm text-zinc-400">
                      View source code & contribute
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <div className="relative p-6 bg-black border border-zinc-800 overflow-hidden transition-all duration-300 hover:border-zinc-700 group">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-transparent to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative z-10">
              <h2 className="text-2xl font-medium text-white mb-6 text-center">
                Technical Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                  <h3 className="font-medium text-white mb-2">Language</h3>
                  <p className="text-sm text-zinc-400">Kotlin</p>
                </div>

                <div className="text-center p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                  <h3 className="font-medium text-white mb-2">Platforms</h3>
                  <p className="text-sm text-zinc-400">Spigot, Paper</p>
                </div>

                <div className="text-center p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                  <h3 className="font-medium text-white mb-2">Compatibility</h3>
                  <p className="text-sm text-zinc-400">
                    Java and Bedrock (via Geyser)
                  </p>
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

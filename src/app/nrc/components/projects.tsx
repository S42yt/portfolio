import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faCode, faBook } from "@fortawesome/free-solid-svg-icons";

export default function ProjectsSection() {
  return (
    <div className="mb-16">
      <div className="relative p-6 bg-black border border-zinc-800 overflow-hidden transition-all duration-300 hover:border-zinc-700 group">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-transparent to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <FontAwesomeIcon
              icon={faCode}
              className="w-6 h-6 text-indigo-400"
            />
            <h2 className="text-2xl font-medium text-white">
              Related Projects
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:border-zinc-600 transition-all duration-300 group/project">
              <div className="flex items-center gap-3 mb-4">
                <FontAwesomeIcon
                  icon={faGithub}
                  className="w-6 h-6 text-orange-400 group-hover/project:scale-110 transition-transform duration-300"
                />
                <h3 className="text-xl font-medium text-white">
                  NoRisk Client Server API
                </h3>
              </div>

              <p className="text-zinc-400 mb-4 leading-relaxed">
                A API system that enables server owners to interact with the
                NoRisk Client. Works with Velocity, BungeeCord, Paper, Spigot,
                and Fabric servers.
              </p>

              <div className="space-y-2 mb-4">
                <div className="text-sm text-zinc-300">
                  • Show custom toasts and notifications
                </div>
                <div className="text-sm text-zinc-300">
                  • Block or allow specific modules
                </div>
                <div className="text-sm text-zinc-300">
                  • Create server-specific experiences
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <a
                  href="https://github.com/NoRiskClient/nrc-server-api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-lg hover:bg-zinc-700 transition-all duration-300 text-sm"
                >
                  <FontAwesomeIcon icon={faGithub} className="w-4 h-4" />
                  Repository
                </a>
                <a
                  href="https://docs.norisk.gg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-lg hover:bg-blue-600/30 transition-all duration-300 text-sm"
                >
                  <FontAwesomeIcon icon={faBook} className="w-4 h-4" />
                  Documentation
                </a>
              </div>
            </div>

            <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:border-zinc-600 transition-all duration-300 group/project">
              <div className="flex items-center gap-3 mb-4">
                <FontAwesomeIcon
                  icon={faGithub}
                  className="w-6 h-6 text-green-400 group-hover/project:scale-110 transition-transform duration-300"
                />
                <h3 className="text-xl font-medium text-white">
                  NoRisk Client Server Mappings
                </h3>
              </div>

              <p className="text-zinc-400 mb-4 leading-relaxed">
                Server mapping system that allows server owners to customize
                their server&apos;s appearance and behavior in the NoRisk Client
                without writing any code.
              </p>

              <div className="space-y-2 mb-4">
                <div className="text-sm text-zinc-300">
                  • Set HD icons & backgrounds
                </div>
                <div className="text-sm text-zinc-300">
                  • Define server gamemodes & socials
                </div>
                <div className="text-sm text-zinc-300">
                  • Disable modules without coding
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <a
                  href="https://github.com/NoRiskClient/nrc-server-mappings"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-lg hover:bg-zinc-700 transition-all duration-300 text-sm"
                >
                  <FontAwesomeIcon icon={faGithub} className="w-4 h-4" />
                  Repository
                </a>
                <a
                  href="https://github.com/NoRiskClient/nrc-server-mappings/tree/main/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600/20 text-green-400 border border-green-600/30 rounded-lg hover:bg-green-600/30 transition-all duration-300 text-sm"
                >
                  <FontAwesomeIcon icon={faBook} className="w-4 h-4" />
                  Documentation
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

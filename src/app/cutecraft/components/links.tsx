import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';

export default function CommunityLinksSection() {
  return (
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
                <p className="text-sm text-zinc-400">Open source projects</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
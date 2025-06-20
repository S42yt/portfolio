import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

export default function ProjectLinksSection() {
  return (
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
                <h3 className="font-medium text-white">GitHub Repository</h3>
                <p className="text-sm text-zinc-400">
                  View source code & contribute
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
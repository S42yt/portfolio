import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocket } from "@fortawesome/free-solid-svg-icons";

export default function CurrentWorkSection() {
  return (
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
  );
}

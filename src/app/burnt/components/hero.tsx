import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";

export default function HeroSection() {
  return (
    <div className="text-center mb-16 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 via-blue-600/20 to-purple-600/20 blur-3xl opacity-30 animate-pulse"></div>

      <div className="relative z-10">
        <h1 className="text-4xl md:text-6xl font-light text-white mb-4 tracking-tight font-mono">
          Burnt.net
        </h1>
        <p className="text-xl md:text-2xl text-zinc-400 font-light leading-relaxed font-mono max-w-3xl mx-auto mb-6">
          Create beautiful online profiles with Discord integration for gamers
          and streamers
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <span className="px-4 py-2 bg-cyan-600/20 border border-cyan-600/50 rounded-full text-cyan-300 text-sm font-medium">
            🎮 Gaming
          </span>
          <span className="px-4 py-2 bg-purple-600/20 border border-purple-600/50 rounded-full text-purple-300 text-sm font-medium">
            📺 Streaming
          </span>
          <span className="px-4 py-2 bg-blue-600/20 border border-blue-600/50 rounded-full text-blue-300 text-sm font-medium">
            🌐 Social
          </span>
        </div>

        <a
          href="https://burnt.rip"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 font-medium"
        >
          <FontAwesomeIcon icon={faGlobe} className="w-5 h-5" />
          Visit Burnt.rip
        </a>
      </div>
    </div>
  );
}
